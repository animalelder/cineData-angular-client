// src/app/movie-card/movie-card.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';

/**
 * MovieCardComponent
 * @class
 * @classdesc This component provides the movie card and interactivity between the user and the movies
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  @Input() filteredFaves: boolean = false;

  movies: any[] = [];
  movie: any = {};
  userData: any = {};
  user: any = {};
  favoriteMovies: any[] = [];
  favMovies: any[] = [];
  fav: string = 'favorite';
  notFav: string = 'favorite_border';

  /**
   * @description The constructor of `MovieCardComponent`
   * @constructor
   * @param {FetchApiDataService} fetchApiData - Injects service to fetch API data
   * @param {MatDialog} dialog - Injects service to open Material Design dialogs
   * @param {MatSnackBar} snackBar - Injects service to display notifications back to the user
   */
  constructor(public fetchApiData: FetchApiDataService, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  /** When initialized, the user's data and all movies are downloaded from the backend */
  ngOnInit(): void {
    this.getUser();
    this.getMovies();
  }

  /**
   * @method getMovies - Gets the movies from the backend
   * After the movies are fetched, they are stored in the movies variable
   * If the user is on the favorites page, only the favorite movies are displayed
   * @returns {Array} movies - An array of movie objects
   */
  getMovies(): any {
    this.fetchApiData.getAllMovies().subscribe((resp: any[]) => {
      this.movies = resp;
      this.movies.forEach((movie) => {
        if (movie.title.length > 21) {
          movie.title = movie.title.slice(0, 21) + '...';
        }
      });
      if (this.filteredFaves) {
        this.movies = this.movies.filter((movie) => this.favoriteMovies.includes(movie._id));
      }
      return this.movies;
    });
  }

  /**
   * @method getUser - Gets the user data from the backend
   * After the user data is fetched, it is stored in the user variable
   */
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

  /**
   * @method getGenre - Opens a dialog with the genre information
   * @param {Object} movie - The movie object
   */
  getGenre(movie: any): void {
    this.dialog.open(InfoModalComponent, {
      data: { title: movie.genre.name, body: movie.genre.description },
      width: '450px',
    });
  }

  /**
   * @method getDirector - Opens a dialog with the director information
   * @param {Object} movie - The movie object
   */
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

  /**
   * @method getSynopsis - Opens a dialog with the movie synopsis
   * @param {Object} movie - The movie object
   */
  getSynopsis(movie: any): void {
    let synopsis = movie.description.replace(/(\w{3,10})\.\s/g, '$1.\n\n');
    this.dialog.open(InfoModalComponent, {
      data: { title: movie.title, body: synopsis },
      width: '450px',
    });
  }

  /**
   * @method toggleFavoriteMovie - Toggles the favorite movie status
   * @param {Object} movie - The movie object
   * The user's favorite movies are updated on the backend and in local storage
   * If the movie is a favorite, it is removed from the user's favorites
   * Else the movie is added to user's favorites
   * A notification is displayed to the user
   * The user's favorite movies are updated in local storage
   */
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

  /**
   * @method isFavoriteMovie - Checks if the movie is a favorite
   * @param {Object} movie - The movie object
   * @returns {Boolean} - True if the movie is a favorite, false if not
   */
  isFavoriteMovie(movie: any): boolean {
    let user = JSON.parse(localStorage.getItem('user') || '');
    return user.favoriteMovies.includes(movie._id);
  }
}
