// src/app/profile-view/profile-view.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserUpdateFormComponent } from '../user-update-form/user-update-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
  inputs: ['user'],
})
export class ProfileViewComponent implements OnInit {
  @Input() updatedUser: any;
  @Input() user: any = JSON.parse(localStorage.getItem('user') || '');
  movies: any[] = [];
  favoriteMovies: any[] = [];
  movie: any = {};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getfavoriteMovies();
  }

  getUser(): void {
    let localUser: {} = JSON.parse(localStorage.getItem('user') || '');
    this.fetchApiData.getUser(localUser).subscribe((resp: any) => {
      this.user = resp;
      this.movies = this.user.favoriteMovies;
      console.log(this.user);
      return this.user;
    });
  }

  getfavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (res: any) => {
        this.favoriteMovies = res.filter((movie: any) => {
          return this.user.favoriteMovies.includes(movie._id);
        });
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

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
  }

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

  getGenre(movie: any): void {
    this.dialog.open(InfoModalComponent, {
      data: { title: movie.genre.name, body: movie.genre.description },
      width: '450px',
    });
  }

  getDirector(movie: any): void {
    let age = 2024 - Number(movie.director.birth.slice(0, 4));
    let heading = `${movie.director.name} (${movie.director.birth.slice(0, 4)}${
      movie.director.death ? ' - ' + movie.director.death.slice(0, 4) : ', alive at ' + age + ' years old'
    })`;
    this.dialog.open(InfoModalComponent, {
      data: { title: heading, body: movie.director.bio },
      width: '450px',
    });
  }

  getSynopsis(movie: any): void {
    let synopsis = movie.description.replace(/(\w{3,10})\.\s/g, '$1.\n\n');
    this.dialog.open(InfoModalComponent, {
      data: { title: movie.title, body: synopsis },
      width: '450px',
    });
  }

  toggleFavoriteMovie(movie: any): void {
    this.user = JSON.parse(localStorage.getItem('user') || '');

    if (this.isFavoriteMovie(movie)) {
      this.fetchApiData.deleteFavoriteMovies(movie).subscribe(
        (res) => {
          console.log(res);
          this.user = res;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.snackBar.open(`${movie.title} has been deleted from your favorites!`, 'OK', {
            duration: 3000,
          });
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      this.fetchApiData.addFavoriteMovies(movie).subscribe(
        (res) => {
          console.log(res);
          this.user = res;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.snackBar.open(`${movie.title} has been added to your favorites!`, 'OK', {
            duration: 3000,
          });
        },
        (err) => {
          console.error(err);
        }
      );
    }
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  isFavoriteMovie(movie: any): boolean {
    let user = JSON.parse(localStorage.getItem('user') || '');
    return user.favoriteMovies.includes(movie._id);
  }

  fav: string = 'favorite';
  notFav: string = 'favorite_border';
}
