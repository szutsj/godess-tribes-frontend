import { BuildingsResponse } from './../_models/buildings-response';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ROOT_URL, COST_BASE_UPGRADE, COST_NEW_BUILDING } from './../constants';
import { catchError } from 'rxjs/operators';
import { ErrorHandlingService } from './error-handling.service';
import { Building } from '../_models/building';
import { share, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  public beginConstruction: EventEmitter<any> = new EventEmitter();
  public finishConstruction: EventEmitter<any> = new EventEmitter();
  public updateRessourceByConstruction: EventEmitter<any> = new EventEmitter();
  interval;
  keyTimeouts = 'APP_TIMEOUTS';
  buildingListObservable: Observable<BuildingsResponse>;
  buildingListData: BuildingsResponse;


  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) {}

  getBuildingsFromAPI(): Observable<BuildingsResponse> {
    if (this.buildingListData) {
      return of(this.buildingListData);
    } else if (this.buildingListObservable) {
      return this.buildingListObservable;
    } else {
      this.buildingListObservable = this.http.get<BuildingsResponse>(ROOT_URL + '/kingdom/buildings')
      .pipe(map(response => this.buildingListData = response),
            share());
      return this.buildingListObservable;
    }
  }

  refreshBuildingListFromAPI(): void {
    this.buildingListData = null;
    this.buildingListObservable = null;
  }

  addNewBuilding(type: string): void {
    this.refreshBuildingListFromAPI();
    this.updateRessourceByConstruction.emit(COST_NEW_BUILDING);
    this.http.post<Building>(ROOT_URL + '/kingdom/buildings', {type})
    .pipe(catchError(this.errorHandlingService.handleError))
    .subscribe(response => { this.handleBuildingProcess(response)},
              error => console.error(error));
  }

  handleBuildingProcess(building: Building): void {
    this.beginConstruction.emit();
    this.saveFinishedAtInLocalStorage(building.finishedAt);
    setTimeout(() => { this.refreshBuildingListFromAPI();
                       this.finishConstruction.emit(); }, building.finishedAt - building.startedAt);
  }

  upgradeBuilding(idToUpgrade: number, level: number): void {
    this.refreshBuildingListFromAPI();
    this.updateRessourceByConstruction.emit(COST_BASE_UPGRADE * (level - 1));
    this.http.put<Building>(ROOT_URL + '/kingdom/buildings/' + idToUpgrade, { level })
    .pipe(catchError(this.errorHandlingService.handleError))
    .subscribe(response => this.handleBuildingProcess(response),
              error => console.error(error));
  }

  checkIfBuildingIsProgressing(building: Building): boolean {
    const currentTime = new Date().getTime();
    return currentTime <= building.finishedAt;
  }

  saveFinishedAtInLocalStorage(finishedAt: number) {
    if (localStorage.getItem(this.keyTimeouts) === null) {
      localStorage.setItem(this.keyTimeouts, JSON.stringify([finishedAt]));
    } else {
      let savedTimeouts = [];
      const now = new Date().getTime();
      savedTimeouts = JSON.parse(localStorage.getItem(this.keyTimeouts));
      savedTimeouts = savedTimeouts.filter(timeout => (timeout > now));
      savedTimeouts.push(finishedAt);
      localStorage.setItem(this.keyTimeouts, JSON.stringify(savedTimeouts));
    }
  }

  setTimeoutsAgain() {
    if (localStorage.getItem(this.keyTimeouts)) {
      let savedTimeouts = [];
      savedTimeouts = JSON.parse(localStorage.getItem(this.keyTimeouts)).filter(timeout => (timeout > new Date().getTime()));
      savedTimeouts.forEach(timeout => { setTimeout(() => { this.finishConstruction.emit(); }, timeout - new Date().getTime()); });
      localStorage.setItem(this.keyTimeouts, JSON.stringify(savedTimeouts));
    }
  }
}
