// src/app/movie-card/movie-card.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  movie: any = {};
  userData: any = {};
  user: any = {};
  favoriteMovies: any[] = [];
  favMovies: any[] = [];

  constructor(public fetchApiData: FetchApiDataService, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): any {
    this.fetchApiData.getAllMovies().subscribe((resp: any[]) => {
      this.movies = resp;
      return this.movies;
    });
  }

  getUser(): void {
    let user: any = JSON.parse(localStorage.getItem('user') || '');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.user = resp;
      this.movies = this.user.favoriteMovies;
      console.log(this.user);
      this.favoriteMovies = user.favoriteMovies;
      return this.user;
    });
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
    let user: {} = JSON.parse(localStorage.getItem('user') || '');

    if (this.isFavoriteMovie(movie)) {
      this.fetchApiData.deleteFavoriteMovies(movie).subscribe(
        (res) => {
          user = res;
          localStorage.setItem('user', JSON.stringify(user));
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
          user = res;
          localStorage.setItem('user', JSON.stringify(user));
          this.snackBar.open(`${movie.title} has been added to your favorites!`, 'OK', {
            duration: 3000,
          });
        },
        (err) => {
          console.error(err);
        }
      );
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  isFavoriteMovie(movie: any): boolean {
    let user = JSON.parse(localStorage.getItem('user') || '');
    return user.favoriteMovies.includes(movie._id);
  }

  fav: string = 'favorite';
  notFav: string = 'favorite_border';
}
