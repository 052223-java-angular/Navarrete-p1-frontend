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
import { List } from 'src/app/models/list/list';
import { ListService } from 'src/app/services/list/list.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

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
    private authService: AuthService,
    private listService: ListService,
    private toaster: ToasterService
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
