import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from 'src/app/models/movie/movie';
import { MovieService } from 'src/app/services/movie/movie.service';
import { faPlus, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  id: string | null = this.activatedRoute.snapshot.paramMap.get('id');
  imageBaseUrl = 'https://image.tmdb.org/t/p/original/';
  movie!: Movie;

  // subscription
  movieSubscription: Subscription = new Subscription();

  // icons
  faPlus = faPlus;
  faStar = faStar;

  constructor(
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.movieSubscription = this.getMovie(+(this.id as string));
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
  }

  getMovie(id: number): Subscription {
    this.isLoading = true;

    return this.movieService.getMovie(id).subscribe({
      next: (resData) => {
        this.isLoading = false;
        this.movie = resData;
        console.log(resData);
      },
      error: (errorRes) => {
        this.isLoading = false;
        console.log(errorRes);
      },
    });
  }
}
