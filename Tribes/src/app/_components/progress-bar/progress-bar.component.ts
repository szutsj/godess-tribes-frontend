import { BuildingService } from './../../_services/building.service';
import { Notification } from '../../_models/notification';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})

export class ProgressBarComponent implements OnInit {

  @Input() notification: Notification;
  result: number;

  constructor(private buildingService: BuildingService) {
    this.buildingService.beginConstruction.subscribe({
      next: () => {
        this.refreshProgressBar();
      }
    });
    this.buildingService.finishConstruction.subscribe({
      next: () => {
        this.buildingService.handleBuildingProcess();
      }
    });
  }

  ngOnInit() {
    console.log(this.checkTimeDifference(this.notification));
    this.refreshProgressBar();
  }

  checkTimeDifference(notification: Notification): number {
    const currentTime = new Date().getTime();
    const minuteDiff = (notification.finishedAt - currentTime) / 1000 / 60;
    const totalMinutes = (notification.finishedAt - notification.startedAt) / 1000 / 60;
    return this.result = 100 - ((minuteDiff / totalMinutes) * 100);
  }

  refreshProgressBar(): void {
    this.buildingService.beginConstruction.subscribe();
    setInterval(() => { this.checkTimeDifference(this.notification); }, 1000);
  }

}
