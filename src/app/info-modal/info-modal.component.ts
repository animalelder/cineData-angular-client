import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.scss',
})
export class InfoModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      body: string;
    },
    public dialogRef: MatDialogRef<InfoModalComponent>
  ) {}

  ngOnInit(): void {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
