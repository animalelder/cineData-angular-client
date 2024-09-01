import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';
import { Movie, Genre, Director } from './movie';

const apiUrl = 'https://cinedata-movie-api.onrender.com/';
@Injectable({
  providedIn: 'root',
})

/**
 * This service contains all the API calls for the app
 * @class FetchApiDataService
 * @constructor
 * @param {HttpClient} private http - Injects HttpClient
 */
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /** Every public method uses this to extract the response data
   * @param {Object} res - API response
   * @returns {any} - Response data
   */
  private extractResponseData(res: Object): any {
    const body = res;
    return body || {};
  }

  /**
   * Create a new user account
   * @param {Partial<User>} userDetails - Username, Password, Email, Birthday
   * @returns {Observable<any>} Observable for the API response
   */
  public userRegistration(userDetails: Partial<User>): Observable<any | Error> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Login a user
   * @param {Partial<User>} userDetails Login details
   * @returns
   */
  public userLogin(userDetails: Partial<User>): Observable<any | Error> {
    console.log(userDetails);
    return this.http
      .post(
        apiUrl +
          `login?Username=${userDetails.username}&Password=${userDetails.password}`,
        userDetails,
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get all movies (Authorization required)
   * @returns Array of all movies
   */
  public getAllMovies(): Observable<Movie[]> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Returns a single movie by title
   * @param {string} title Movie Title
   * @returns {Observable<any>} Object with movie details
   */
  public getMovie(title: string): Observable<Movie> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get information about a director by name
   * @param {string} directorName  Director's Name
   * @returns {Observable<any>} Details of the queried director
   */
  public getDirector(directorName: string): Observable<Director> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/directors/' + directorName, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get information about a genre by name
   * @param {string} genreName Genre Name
   * @returns {Observable<any>} Details of the queried genre
   */
  public getGenre(genreName: string): Observable<Genre> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genre/' + genreName, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get information about a user by username
   * @param {Partial<User>} userDetails Username
   * @returns {Observable<User>} User details
   */
  public getUser(userDetails: Partial<User>): Observable<User> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + userDetails.username, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Get favorite movies of user
   * @param {Partial<User>} userDetails User details
   * @returns {Observable<Movie[]>} Favorite movies
   */
  public getFavoriteMovies(userDetails: User): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + userDetails.username + 'favoriteMovies', {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Add a movie to favorites
   * @param {Movie} movie ID Movie to add
   * @returns {Observable<User>} Updated user details
   */
  public addFavoriteMovies(movie: Movie): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(
        apiUrl +
          'users/' +
          user.username +
          '/favorites/' +
          encodeURIComponent(movie._id),
        null,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
        },
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Remove a movie from favorites
   * @param {Movie} movie ID to identify movie
   * @returns {Observable<User>} Updated user details
   */
  public deleteFavoriteMovies(movie: Movie): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    return this.http
      .delete(
        apiUrl +
          'users/' +
          user.username +
          '/favorites/' +
          encodeURIComponent(movie._id),
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
        },
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Edit user information
   * @param {Partial<User>} userDetails username, password, email, birthdate
   * @returns {Observable<User>} Updated user details
   */
  public editUser(userDetails: Partial<User>): Observable<User> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + user.username, JSON.stringify(userDetails), {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Delete user account
   * @returns {Observable<any>} the API response
   */
  public deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + user.username, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public initializeApi(): Observable<any> {
    return this.http.get(apiUrl).pipe(catchError(this.handleError));
  }

  /** All public methods use this to handle errors
   * @param {HttpErrorResponse} error - API error response
   * @returns {Error} - Error message
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else if (error.status.toString().startsWith('4')) {
      console.error('User does not exist.');
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  }
}
