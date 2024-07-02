// src/app/info-modal/info-modal.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * InfoModalComponent
 * @class
 * @classdesc This component provides the info modal, which is used for displaying movie details
 */
@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.scss',
})
export class InfoModalComponent implements OnInit {
  /**
   * @description The constructor of `InfoModalComponent`
   * @constructor
   * @param {MAT_DIALOG_DATA} data - Injects data passed to the dialog
   * @param {MatDialogRef} dialogRef - Injects service to open Material Design dialogs
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      body: string;
    },
    public dialogRef: MatDialogRef<InfoModalComponent>
  ) {}

  ngOnInit(): void {}

  /**
   * @function closeModal - Closes the dialog, which was opened from the MovieCardComponent
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
