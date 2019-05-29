import { MAX_UPGRADE_LEVELS } from './../constants';
import { BuildingService } from './../building.service';
import { Component, OnInit } from '@angular/core';
import { BUILDINGS } from './../mock-building';
import { Notification } from '../notification';
import { Building } from './../building';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  listToDisplay: Notification[];
  results: Building[];

  constructor() { }

  ngOnInit() {
    this.generateListToDisplay();
  }

  checkIfBuildingIsProgressing(building: Building): boolean {
    let currentTime = new Date().getTime();
    console.log(currentTime);
    let parsedFinishedAt = building.finishedAt;
    console.log(parsedFinishedAt);
    return currentTime <= parsedFinishedAt;
  }

  createNotification(building: Building): Notification {
    if (building.level === 1) {
      return new Notification(building.buildingTypeENUM, building.level, 'Under construction');
    } else if (building.level > 1 && building.level <= MAX_UPGRADE_LEVELS) {
      return new Notification(building.buildingTypeENUM, building.level, 'Leveling up from ' + (building.level - 1) + ' to ' + building.level);
    }

  }

  generateListToDisplay(): void {
    this.listToDisplay = BUILDINGS.filter(building => this.checkIfBuildingIsProgressing(building))
      .map(building => this.createNotification(building));
  }

}
