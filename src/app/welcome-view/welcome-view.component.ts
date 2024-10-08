// src/app/welcome-view/welcome-view.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../data/fetch-api-data.service';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * WelcomeViewComponent
 * @Class
 * @classdesc This component provides the welcome view
 */
@Component({
  selector: 'app-welcome-view',
  templateUrl: './welcome-view.component.html',
  styleUrl: './welcome-view.component.scss',
})
export class WelcomeViewComponent implements OnInit {
  /**
   * @description The constructor of `WelcomeViewComponent`
   * @constructor
   * @param {MatDialog} dialog  - Injects service to open Material Design dialogs
   */
  constructor(
    public dialog: MatDialog,
    public fetchApiData: FetchApiDataService,
  ) {}
  ngOnInit(): void {
    this.fetchApiData.initializeApi();
  }

  /**
   * @function openUserRegistrationDialog - Opens the user registration dialog
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }
  /**
   * @function openUserLoginDialog - Opens the user login dialog
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
