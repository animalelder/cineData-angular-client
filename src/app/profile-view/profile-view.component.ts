// src/app/profile-view/profile-view.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserUpdateFormComponent } from '../user-update-form/user-update-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

/**
 * ProfileViewComponent
 * @class
 * @classdesc This component provides the profile view
 */
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
  inputs: ['user'],
})
export class ProfileViewComponent implements OnInit {
  @Input() updatedUser: any;
  @Input() user: any = JSON.parse(localStorage.getItem('user') || '');

  /**
   * @description The constructor of `ProfileViewComponent`
   * @constructor
   * @param {FetchApiDataService} fetchApiData - Injects service to fetch API data
   * @param {MatDialog} dialog - Injects service to open Material Design dialogs
   * @param {MatSnackBar} snackBar - Injects service to display notifications back to the user
   * @param {Router} router - Injects the Angular router
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}
  /**
   * @method ngOnInit automatically get user data on initialization
   */
  ngOnInit(): void {
    this.getUser();
  }

  /**
   * @method getUser - Gets the user data from the backend
   * After the user data is fetched, it is stored in the user variable
   */
  getUser(): void {
    let localUser: {} = JSON.parse(localStorage.getItem('user') || '');
    this.fetchApiData.getUser(localUser).subscribe((resp: any) => {
      this.user = resp;
      console.log(this.user);
      return this.user;
    });
  }

  /**
   * @method openUpdateUserDialog - Opens the user update dialog
   * After the dialog is closed, the user data is updated
   */
  openUpdateUserDialog(): void {
    this.dialog.open(UserUpdateFormComponent, {
      data: {
        username: this.user.username,
        password: '',
        email: this.user.email,
        birthdate: this.user.birthdate,
      },
      width: '280px',
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.user = JSON.parse(localStorage.getItem('user') || '');
    });
  }

  /**
   * @method deleteUser - Deletes the user account
   * After the user is deleted, the user is logged out and the welcome view is displayed
   */
  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('User successfully deleted.', 'OK', {
          duration: 2000,
        });
      });
      this.fetchApiData.deleteUser().subscribe((result: void) => {
        console.log(result);
      });
    }
  }
}
