import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from 'src/app/models/movie/movie';
import { MovieService } from 'src/app/services/movie/movie.service';
import {
  faPlus,
  faStar,
  faSquarePlus,
} from '@fortawesome/free-solid-svg-icons';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isRecommendationLoading: boolean = false;
  isReviewLoading: boolean = false;
  imageBaseUrl = 'https://image.tmdb.org/t/p';
  movie!: Movie;
  movies!: Array<Movie>;

  // subscription
  movieSubscription: Subscription = new Subscription();
  recommendationSubscription: Subscription = new Subscription();
  routeSubscription: Subscription = new Subscription();

  // icons
  faPlus = faPlus;
  faStar = faStar;
  faSquarePlus = faSquarePlus;

  // carousel options
  isDragging = false;
  customOptions: OwlOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 200,
    navText: ['<<', '>>'],
    nav: true,
    autoWidth: true,
    margin: 20,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      // unsubscribe from prev
      this.movieSubscription.unsubscribe();
      this.recommendationSubscription.unsubscribe();

      this.movieSubscription = this.getMovie(+routeParams['id']);
      this.recommendationSubscription = this.getRecommendations(
        +routeParams['id']
      );
    });
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
    this.recommendationSubscription.unsubscribe();
  }

  getMovie(id: number): Subscription {
    this.isLoading = true;

    return this.movieService.getMovie(id).subscribe({
      next: (resData) => {
        this.isLoading = false;
        this.movie = resData;
      },
      error: (errorRes) => {
        this.isLoading = false;
        console.log(errorRes);
      },
    });
  }

  getRecommendations(id: number): Subscription {
    this.isRecommendationLoading = true;

    return this.movieService.getRecommendations(id).subscribe({
      next: (resData) => {
        this.isRecommendationLoading = false;
        this.movies = resData;
        this.createOwlOptions(this.movies.length);
      },
      error: (errorRes) => {
        this.isRecommendationLoading = false;
        console.log(errorRes``);
      },
    });
  }

  createOwlOptions(size: number) {
    this.customOptions.responsive = {
      0: {
        loop: size <= 2 ? false : true,
        items: 2,
        slideBy: 2,
      },
      400: {
        loop: size <= 3 ? false : true,
        items: 3,
        slideBy: 3,
      },
      740: {
        loop: size <= 4 ? false : true,
        items: 4,
        slideBy: 4,
      },
      940: {
        loop: size <= 5 ? false : true,
        items: 5,
        slideBy: 5,
      },
      1140: {
        loop: size <= 6 ? false : true,
        items: 6,
        slideBy: 6,
      },
    };
  }
}
