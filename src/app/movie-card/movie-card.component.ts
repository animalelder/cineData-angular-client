// src/app/movie-card/movie-card.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../data/fetch-api-data.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Movie } from '../data/movie';
import { User } from '../data/user';

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
  @Input() filteredFaves = false;

  movies: Movie[] = [];
  user: User = JSON.parse(localStorage.getItem('user') ?? '{}');
  favoriteMovies: any = [];
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
    this.getMovies();
    console.log('init', this.movies);
  }

  /**
   * @method getMovies - Gets the movies from the backend
   * After the movies are fetched, they are stored in the movies variable
   * If the user is on the favorites page, only the favorite movies are displayed
   * @returns {Movies[]} movies - An array of movie objects
   */
  getMovies(): Movie[] {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('first movie pull');
      this.movies.forEach((movie) => {
        if (movie.title.length > 21) {
          movie.title = movie.title.slice(0, 21) + '...';
        }
      });
    });
    if (this.filteredFaves) {
      this.getUserFavMovies();
      console.log('get user fav movies');
      console.log(this.favoriteMovies);
      // this.movies = this.movies.filter((movie) => this.favoriteMovies.includes(movie._id));
    }
    return this.movies;
  }

  /**
   * @method getUserFavMovies - Gets the user data from the backend
   * After the user data is fetched, it is stored in the user variable
   * The user's favorite movies are stored in the favoriteMovies variable
   * @returns {Movies[]} filtered array of favorite movies
   */
  getUserFavMovies(): any {
    // let user: User = JSON.parse(localStorage.getItem('user') || '');
    this.fetchApiData.getUser(this.user).subscribe((resp: any) => {
      this.user = resp;
      // this.movies = this.user.favoriteMovies;
      console.log('user fetched');
      this.favoriteMovies = this.user.favoriteMovies;
      this.movies = this.movies.filter((movie) => this.favoriteMovies.includes(movie._id));
      console.log('fav', this.favoriteMovies);
      // return this.user;
      return this.movies;
    });
  }

  /**
   * @method getGenre - Opens a dialog with the genre information
   * @param {Movie} movie - The movie object
   */
  getGenre(movie: Movie): void {
    this.dialog.open(InfoModalComponent, {
      data: { title: movie.genre.name, body: movie.genre.description },
      width: '450px',
    });
  }

  /**
   * @method getDirector - Opens a dialog with the director information
   * @param {Movie} movie - The movie object
   */
  getDirector(movie: Movie): void {
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
   * @param {Movie} movie - The movie object
   */
  getSynopsis(movie: Movie): void {
    let synopsis = movie.description.replace(/(\w{3,10})\.\s/g, '$1.\n\n');
    this.dialog.open(InfoModalComponent, {
      data: { title: movie.title, body: synopsis },
      width: '450px',
    });
  }

  /**
   * @method toggleFavoriteMovie - Toggles the favorite movie status
   * @param {Movie} movie - The movie object
   * The user's favorite movies are updated on the backend and in local storage
   * If the movie is a favorite, it is removed from the user's favorites
   * Else the movie is added to user's favorites
   * A notification is displayed to the user
   * The user's favorite movies are updated in local storage
   */
  toggleFavoriteMovie(movie: Movie): void {
    let user: User = JSON.parse(localStorage.getItem('user') || '');

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
   * @param {Movie} movie - The movie object
   * @returns {Boolean} - True if the movie is a favorite, false if not
   */
  isFavoriteMovie(movie: Movie): boolean {
    let user = JSON.parse(localStorage.getItem('user') || '');
    return user.favoriteMovies.includes(movie._id);
  }
}
