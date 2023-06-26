import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DBMovie, Movie } from 'src/app/models/movie/movie';
import { MovieService } from 'src/app/services/movie/movie.service';
import {
  faPlus,
  faStar,
  faSquarePlus,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ReviewService } from 'src/app/services/review/review.service';
import {
  CreateReview,
  ModifyReview,
  ReviewRes,
} from 'src/app/models/review/review';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { List } from 'src/app/models/list/list';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnInit, OnDestroy {
  username: string = this.authService.getUsername();
  isLoading: boolean = false;
  isRecommendationLoading: boolean = false;
  isReviewLoading: boolean = false;
  isReviewSubmitLoading: boolean = false;
  imageBaseUrl = 'https://image.tmdb.org/t/p';
  movie!: Movie;
  movies!: Array<Movie>;
  @Input('data') reviews: Array<ReviewRes> = [];
  page: number = 1;

  // subscription
  movieSubscription: Subscription = new Subscription();
  recommendationSubscription: Subscription = new Subscription();
  reviewSubscription: Subscription = new Subscription();
  routeSubscription: Subscription = new Subscription();

  // icons
  faPlus = faPlus;
  faStar = faStar;
  faSquarePlus = faSquarePlus;
  faUser = faUser;

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

  // modal
  reviewModalActive: boolean = false;
  reviewId!: string;
  isEditing: boolean = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService,
    private reviewService: ReviewService,
    private toaster: ToasterService,
    private listService: ListService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((routeParams) => {
      // unsubscribe from prev
      this.movieSubscription.unsubscribe();
      this.recommendationSubscription.unsubscribe();
      this.reviewSubscription.unsubscribe();

      this.movieSubscription = this.getMovie(+routeParams['id']);
      this.recommendationSubscription = this.getRecommendations(
        +routeParams['id']
      );
      this.reviewSubscription = this.getReviews(+routeParams['id']);
    });
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
    this.recommendationSubscription.unsubscribe();
    this.reviewSubscription.unsubscribe();
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
        console.log(errorRes);
      },
    });
  }

  getReviews(id: number): Subscription {
    this.isReviewLoading = true;

    return this.reviewService.getReviews(id).subscribe({
      next: (res) => {
        this.isReviewLoading = false;
        this.reviews = res;
        console.log(res);
      },
      error: (err) => {
        this.isReviewLoading = false;
        console.log(err);
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

  showReviewModal() {
    this.reviewModalActive = true;
  }

  hideReviewModal() {
    this.reviewModalActive = false;
  }

  showEditReviewModal(id: string) {
    this.reviewModalActive = true;
    this.isEditing = true;
    this.reviewId = id;
  }

  hideEditReviewModal() {
    this.reviewModalActive = false;
    this.isEditing = false;
  }

  createReview(form: NgForm, movie: Movie) {
    // don't submit when form is invalid
    if (form.invalid) {
      return;
    }

    // show loading component
    this.isReviewSubmitLoading = true;

    if (this.isEditing) {
      const review: ModifyReview = {
        id: this.reviewId,
        rating: form.value.rating,
        description: form.value.description,
        movieId: movie.id,
      };

      // make request
      this.reviewService.modifyReview(review).subscribe({
        next: (res) => {
          this.reviews = this.reviews.map((item) => {
            if (item.id == res.id) {
              item.rating = res.rating;
              item.description = res.description;
            }
            return item;
          });
          // render success toaster
          this.toaster.success('You have successfully edited your review.');
          // remove loading
          this.isReviewSubmitLoading = false;
          // hide review modal
          this.hideEditReviewModal();
        },
        error: (err) => {
          delete err.error['timestamp'];
          // render error toaster
          this.toaster.error(err.error);
          // remove loading
          this.isReviewSubmitLoading = false;
          // hid review modal
          this.hideEditReviewModal();
          console.log(err.error);
        },
      });
    } else {
      // set user values
      const review: CreateReview = {
        rating: form.value.rating,
        description: form.value.description,
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
      };

      // make request
      this.reviewService.createReview(review).subscribe({
        next: (resData) => {
          this.reviews = this.reviews.concat(resData);
          // render success toaster
          this.toaster.success('You have successfully created a new review.');
          // remove loading
          this.isReviewSubmitLoading = false;
          // hide review modal
          this.hideReviewModal();
        },
        error: (errorRes) => {
          delete errorRes.error['timestamp'];
          // render error toaster
          this.toaster.error(errorRes.error);
          // remove loading
          this.isReviewSubmitLoading = false;
          // hide review modal
          this.hideReviewModal();
          console.log(errorRes.error);
        },
      });
    }

    // reset form
    form.reset();
  }

  deleteReview(id: string, movieId: number) {
    this.isReviewLoading = true;

    this.reviewService.deleteReview(id, movieId).subscribe({
      next: () => {
        this.isReviewLoading = false;
        this.reviews = this.reviews.filter((item) => {
          item.id != id;
        });
        this.toaster.success('Successfully removed review');
      },
      error: (err) => {
        this.isReviewLoading = false;
        delete err.error['timestamp'];
        // render error toaster
        this.toaster.error(err.error);
        // hide review modal
        console.log(err);
      },
    });
  }

  // list modal
  isListLoading = false;
  listModalActive = false;
  activeListItem!: string;
  movieToAdd!: Movie;
  lists: Array<List> = [];

  showListModal(movie: Movie) {
    this.listModalActive = true;
    this.movieToAdd = movie;
    this.loadLists();
  }

  hideListModal() {
    this.listModalActive = false;
  }

  loadLists() {
    this.isListLoading = true;

    this.listService.getLists(this.authService.getUserId()).subscribe({
      next: (res) => {
        console.log(res);
        this.isListLoading = false;
        this.lists = res;
      },
      error: (err) => {
        this.isListLoading = false;
        console.log(err);
      },
    });
  }

  activateListItem(id: string) {
    this.activeListItem = id;
  }

  addMovieToList(id: string, movie: Movie) {
    this.isListLoading = true;

    this.listService.addMovieToList(id, movie).subscribe({
      next: (res) => {
        this.isListLoading = false;
        this.toaster.success(`Successfully added movie to ${res.name} list.`);
      },
      error: (err) => {
        this.isListLoading = false;
        delete err.error['timestamp'];
        // render error toaster
        this.toaster.error(err.error);
      },
    });
  }
}
