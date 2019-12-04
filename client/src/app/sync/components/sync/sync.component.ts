import { SyncService } from './../../sync.service';
import { Component, OnInit } from '@angular/core';

const STATUS_INITIAL = 'STATUS_INITIAL'
const STATUS_IN_PROGRESS = 'STATUS_IN_PROGRESS'
const STATUS_COMPLETED = 'STATUS_COMPLETED'
const STATUS_ERROR = 'STATUS_ERROR'

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css']
})
export class SyncComponent implements OnInit {

  status = STATUS_INITIAL 

  constructor(
    private syncService:SyncService
  ) { }

  ngOnInit() {
  }

  async sync() {
    this.status = STATUS_IN_PROGRESS
    try {
      await this.syncService.sync()
      this.status = STATUS_COMPLETED
    } catch (e) {
      this.status = STATUS_ERROR
    }
  }

}
