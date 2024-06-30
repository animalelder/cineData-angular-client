// src/app/nav-bar/nav-bar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * NavBarComponent
 * @class
 * @classdesc This component provides the navigation bar
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  /**
   * @description The constructor of `NavBarComponent`
   * @constructor
   * @param {MatSnackBar} snackBar - Injects service to display notifications back to the user
   * @param {Router} router - Injects the Angular router
   */
  constructor(public snackBar: MatSnackBar, public router: Router) {}

  ngOnInit(): void {}

  /**
   * @method openMovies - Navigates to the movies view
   */
  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * @method openProfile - Navigates to the profile view
   */
  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * @method logOut - Log out the user, clear local storage, and navigate to the welcome view
   */
  public logOut(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
    this.snackBar.open('You have been logged out.', 'OK', {
      duration: 2000,
    });
  }
}
