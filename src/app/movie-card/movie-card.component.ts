// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoModalComponent } from '../info-modal/info-modal.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(public fetchApiData: FetchApiDataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.table(this.movies);
      console.log(this.movies);
      return this.movies;
    });
  }
  getGenre(movie: any): void {
    this.dialog.open(InfoModalComponent, {
      data: { title: movie.genre.name, body: movie.genre.description },
      width: '450px',
    });
  }

  getDirector(movie: any): void {
    this.dialog.open(InfoModalComponent, {
      data: { title: movie.director.name, body: movie.director.bio },
      width: '450px',
    });
  }

  getSynopsis(movie: any): void {
    let synopsis = movie.description.split('. ').reduce((acc: string, curr: string) => acc + curr + '.\n\n', '');
    this.dialog.open(InfoModalComponent, {
      data: { title: movie.title, body: synopsis },
      width: '450px',
    });
  }
}
