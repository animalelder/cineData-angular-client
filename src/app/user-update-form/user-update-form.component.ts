// src/app/user-update-form/user-update-form.component.ts
import { Component, OnInit, Input, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-update-form',
  templateUrl: './user-update-form.component.html',
  styleUrl: './user-update-form.component.scss',
})
export class UserUpdateFormComponent implements OnInit {
  @Input() userData = {
    username: this.data.username,
    password: '',
    email: this.data.email,
    birthdate: this.data.birthdate,
  };
  loading = false;

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
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

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
        this.router.navigate(['profile']);
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
