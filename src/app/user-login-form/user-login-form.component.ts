// src/app/user-registration-form/user-login-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../data/fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../data/user';

/**
 * UserLoginFormComponent
 * @class
 * @classdesc This is the component class for the user login form
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss',
})
export class UserLoginFormComponent {
  @Input() userData: Partial<User> = { username: '', password: '' };
  loading = false;

  /**
   * @constructor
   * @param {FetchApiDataService} fetchApiData - This injects the fetch service
   * @param {MatDialogRef} dialogRef - This injects the reference to the dialog it was opened from
   * @param {MatSnackBar} snackBar - This injects the MatSnackBar module to display notifications back to the user
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  /**
   * @function loginUser - This method sends the form inputs to the backend
   * This method sends the form inputs to the backend
   * Once the user is logged in, the dialog will close
   * Now the user has a token to authorize API calls
   * The userData and token are saved to local storage
   */
  loginUser(): void {
    this.loading = true;
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();
        this.snackBar.open('User logged in successfully!', 'OK', {
          duration: 2000,
        });
        this.loading = false;
        console.log(result);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.router.navigate(['movies']);
      },
      (result) => {
        this.loading = false;
        console.log(result);
        this.snackBar.open('Login failed. No such user with password.', 'OK', {
          duration: 2000,
        });
      }
    );
  }
  hide = true;
}
