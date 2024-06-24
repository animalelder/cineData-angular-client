// src/app/nav-bar/nav-bar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  constructor(public snackBar: MatSnackBar, public router: Router) {}

  ngOnInit(): void {}

  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  public openProfile(): void {
    this.router.navigate(['profile']);
  }

  public logOut(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
    this.snackBar.open('You have been logged out.', 'OK', {
      duration: 2000,
    });
  }
}
