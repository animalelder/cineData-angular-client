// src/app/user-update-form/user-update-form.component.ts
import { Component, OnInit, Input, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../data/fetch-api-data.service';
import { User } from '../data/user';
/**
 * UserUpdateFormComponent
 * @class
 * @classdesc This component provides the user update form
 */
@Component({
  selector: 'app-user-update-form',
  templateUrl: './user-update-form.component.html',
  styleUrl: './user-update-form.component.scss',
})
export class UserUpdateFormComponent implements OnInit {
  @Input() userData: User = {
    username: this.data.username,
    password: '',
    email: this.data.email,
    birthdate: this.data.birthdate,
  };
  loading = false;

  /**
   * @description The constructor of `UserUpdateFormComponent`
   * @constructor
   * @param {MAT_DIALOG_DATA} data - Injects data passed to the dialog
   * @param {FetchApiDataService} fetchApiData - Injects service to fetch API data
   * @param {MatDialogRef} dialogRef - Injects service to open Material Design dialogs
   * @param {MatSnackBar} snackBar - Injects service to display notifications back to the user
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      username: string;
      password: string;
      email: string;
      birthdate: string;
    },
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserUpdateFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /**
   * @function updateUser - Sends the updated user data to the backend
   */
  updateUser(): void {
    this.loading = true;
    this.fetchApiData.editUser(this.userData).subscribe(
      (result) => {
        this.loading = false;
        this.snackBar.open('User updated successfully!', 'OK', {
          duration: 2000,
        });
        this.dialogRef.close();
        console.log(result);
        localStorage.setItem('user', JSON.stringify(result));
      },
      (result) => {
        this.loading = false;
        console.log(result);
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      }
    );
  }
  hide = true;
}
