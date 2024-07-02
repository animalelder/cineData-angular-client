// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../data/fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from '../data/user';

/**
 * UserRegistrationFormComponent
 * @class
 * @classdesc This is the component class for the user registration form
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  @Input({ alias: 'user' }) userData: Partial<User> = { username: '', password: '', email: '', birthdate: '' };
  loading = false;

  /**
   * @constructor
   * @param {FetchApiDataService} fetchApiData - This injects the fetch service
   * @param {MatDialogRef} dialogRef - This injects the reference to the dialog so we can close it
   * @param {MatSnackBar} snackBar - This injects the MatSnackBar module to display notifications back to the user
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  /**
   * @method registerUser - Register a new user account
   * This method sends the form inputs to the backend
   */
  registerUser(): any {
    this.loading = true;
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.loading = false;
        this.dialogRef.close(); // This will close the modal on success!
        console.log(result);
        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
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
