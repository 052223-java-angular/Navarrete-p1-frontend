import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie/movie';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MovieService } from 'src/app/services/movie/movie.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  movies: Array<Movie> = [];
  username = this.authService.getUsername();
  imageBaseUrl = 'https://image.tmdb.org/t/p/original/';
  isLoading = false;

  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // load movies
    this.loadMovies();
  }

  private loadMovies(): void {
    this.isLoading = true;

    this.movieService.getMovies().subscribe({
      next: (resData) => {
        this.isLoading = false;
        console.log(resData);
        this.movies = resData;
      },
      error: (errorRes) => {
        this.isLoading = false;
        console.log(errorRes.error);
      },
    });
  }
}
