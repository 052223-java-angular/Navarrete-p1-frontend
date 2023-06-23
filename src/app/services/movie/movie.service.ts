import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, forkJoin, of, switchMap } from 'rxjs';
import { DBMovie, Movie, TMBDMovie } from 'src/app/models/movie/movie';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  // environment
  baseUrl: string = environment.apiUrl;
  externalApiUrl: string = environment.externalApiUrl;
  externalApiAuth: string = environment.externalAPiAuth;
  // subjects
  moviesSub: Subject<Array<Movie>> = new Subject<Array<Movie>>();
  // properties
  movies: Array<Movie> = [];

  constructor(private http: HttpClient) {}

  // get movies from db and external api
  getMovies(): Subject<Array<Movie>> {
    // request movie data from external api
    this.http
      .get<{ results: Array<TMBDMovie> }>(
        `${this.externalApiUrl}/discover/movie`,
        {
          headers: new HttpHeaders()
            .set('Authorization', this.externalApiAuth)
            .set('skip', 'true'),
          params: new HttpParams()
            .set('include_adult', 'false')
            .set('include_video', 'false')
            .set('language', 'en-US')
            .set('page', '1')
            .set('sort_by', 'popularity.desc'),
        }
      )
      .pipe(
        switchMap((externalApiRes) => {
          // movies array for subject
          const movies: Array<Movie> = [];
          // individual movie
          let movie: Movie;
          // movie ids for db request
          const idArr = [];

          // iterate through external api data
          for (let movieRes of externalApiRes.results) {
            // extract data
            const { vote_count, vote_average, ...rest } = movieRes;

            // store data in movie
            let tmbdMovie = rest as TMBDMovie;
            movie = { ...tmbdMovie, totalRating: 0, totalVotes: 0 };

            // push movie and ids
            movies.push(movie);
            idArr.push(movie.id);
          }
          // populate movies subject
          this.movies = movies;

          // request movie data from db
          const dbRes = this.http.get<Array<DBMovie>>(
            `${this.baseUrl}/movies`,
            {
              params: { ids: idArr.join(',') },
            }
          );
          // join both sets of data to combine into one array of movies
          return forkJoin([of(externalApiRes), dbRes]);
        })
      )
      .subscribe({
        next: (resData) => {
          // combine external api and db movie data
          const tmbdMovies = resData[0].results;
          const dbMovies = resData[1];

          // combine
          const map = new Map();
          tmbdMovies.forEach((item) => {
            const { vote_count, vote_average, ...rest } = item;
            map.set(item.id, { totalRating: 0, totalVotes: 0, ...rest });
          });
          dbMovies.forEach((item) => {
            const { id, ...restDB } = item;
            const { totalRating, totalVotes, ...restTMBD } = map.get(+id);
            map.set(+id, { ...restTMBD, ...restDB });
          });
          const merged = Array.from(map.values());

          // update movie subject
          this.moviesSub.next(merged);
        },
        error: (errorRes) => {
          console.log(errorRes.error);
          this.moviesSub.next(this.movies);
        },
      });

    return this.moviesSub;
  }
}
