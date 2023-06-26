import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie/movie';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MovieService } from 'src/app/services/movie/movie.service';

// icons
import {
  faSquarePlus,
  faStar,
  faAnglesLeft,
  faAnglesRight,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit, OnDestroy {
  username = this.authService.getUsername();
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500/';
  isLoading = false;

  // pagination
  movies!: Array<Movie>;
  p: number = 1;
  total: number = this.movieService.totalMovies;

  // icons
  faSquarePlus = faSquarePlus;
  faStar = faStar;
  faAnglesLeft = faAnglesLeft;
  faAnglesRight = faAnglesRight;

  // subscription
  moviesSubscription: Subscription = new Subscription();

  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // load movies
    this.moviesSubscription = this.loadMovies(1);
  }

  ngOnDestroy(): void {
    this.moviesSubscription.unsubscribe();
  }

  loadMovies(page: number): Subscription {
    this.isLoading = true;

    return this.movieService.getMovies(page).subscribe({
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
