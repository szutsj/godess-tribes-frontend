import { Notification } from './../notification';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})

export class ProgressBarComponent implements OnInit {

  @Input() notification: Notification;
  result: number;

  constructor() { }

  ngOnInit() {
    console.log(this.checkTimeDifference(this.notification));
  }

  checkTimeDifference(notification: Notification): number {
    const currentTime = new Date().getTime();
    let timeDiff = (notification.finishedAt - currentTime) / 1000 / 60;
    let totalTime = (notification.finishedAt - notification.startedAt) / 1000 / 60;
    return this.result = 100 - ((timeDiff / totalTime) * 100);
  }

}
