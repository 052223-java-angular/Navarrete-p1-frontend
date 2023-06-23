import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie/movie';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MovieService } from 'src/app/services/movie/movie.service';

// icons
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  username = this.authService.getUsername();
  imageBaseUrl = 'https://image.tmdb.org/t/p/original/';
  isLoading = false;

  // pagination
  movies: Array<Movie> = [];
  p: number = 1;
  total: number = this.movieService.totalMovies;

  // icons
  faSquarePlus = faSquarePlus;
  faStar = faStar;

  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // load movies
    this.loadMovies(1);
  }

  loadMovies(page: number): void {
    this.isLoading = true;

    this.movieService.getMovies(page).subscribe({
      next: (resData) => {
        this.isLoading = false;
        this.p = +page;
        this.movies = resData;
      },
      error: (errorRes) => {
        this.isLoading = false;
        console.log(errorRes.error);
      },
    });
  }
}
