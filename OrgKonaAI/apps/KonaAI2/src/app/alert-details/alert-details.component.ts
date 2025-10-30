import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { commonModels,AlertTypes } from '../models/common-models';


@Component({
  selector: 'app-alert-details',
  standalone: true,
  imports: [
    FormsModule, CommonModule
  ],
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.scss']
})
export class AlertDetailsComponent {
  isEntitylevel: boolean = false;
  isTransactionLevel: boolean = false;
  isMultiLevelTransaction: boolean = false;
  id: any;
  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('type');
    console.log('Alert type:', this.id);
     if (this.id === AlertTypes.ENTITY) {
      this.isEntitylevel = true;
    } else if (this.id === AlertTypes.TRANSACTION) {
      this.isTransactionLevel = true;
    } else if (this.id === AlertTypes.MULTI_TRANSACTION) {
      this.isMultiLevelTransaction = true;
    }
  }
}