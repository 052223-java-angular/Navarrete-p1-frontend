import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Subject,
  forkJoin,
  of,
  switchMap,
  catchError,
  Observable,
  throwError,
  tap,
  map,
} from 'rxjs';
import { DBMovie, Movie, TMBDMovie } from 'src/app/models/movie/movie';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  // environment
  baseUrl: string = environment.apiUrl;
  externalApiUrl: string = environment.externalApiUrl;
  externalApiAuth: string = environment.externalAPiAuth;
  // subjects
  moviesSubject: Subject<Array<Movie>> = new Subject<Array<Movie>>();
  movieSubject: Subject<Movie> = new Subject<Movie>();
  movieRecommendationSubject: Subject<Array<Movie>> = new Subject<
    Array<Movie>
  >();
  // fields
  movies!: Array<Movie>;
  movie!: Movie;
  totalPages: number = 500;
  MoviesPerPage: number = 20;
  totalMovies: number = this.totalPages * this.MoviesPerPage;

  constructor(private http: HttpClient) {}

  // get movies from db and external api
  getMovies(page: number): Subject<Array<Movie>> {
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
            .set('page', page + '')
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
            movie = { ...rest, totalRating: 0, totalVotes: 0 };

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
          // update movie subject
          this.moviesSubject.next(
            this.combineMovies(resData[0].results, resData[1])
          );
        },
        error: (errorRes) => {
          console.log(errorRes.error);
          this.moviesSubject.next(this.movies);
        },
      });

    return this.moviesSubject;
  }

  getMovie(id: number): Subject<Movie> {
    // request movie data from external api
    this.http
      .get<TMBDMovie>(`${this.externalApiUrl}/movie/${id}`, {
        headers: new HttpHeaders()
          .set('Authorization', this.externalApiAuth)
          .set('skip', 'true'),
        params: new HttpParams().set('language', 'en-US'),
      })
      .pipe(
        switchMap((externalApiRes) => {
          const { vote_average, vote_count, ...restTMBD } = externalApiRes;
          this.movie = { ...restTMBD, totalRating: 0, totalVotes: 0 };
          // request movie data from db
          const dbRes = this.http.get<Array<DBMovie>>(
            `${this.baseUrl}/movies`,
            {
              params: { ids: [id] },
            }
          );
          // join both sets of data to combine into one array of movies
          return forkJoin([of(externalApiRes), dbRes]);
        })
      )
      .subscribe({
        next: (resData) => {
          // combine external api and db movie data
          const { vote_average, vote_count, ...restTMBD } = resData[0];
          const { id, ...restDB } = resData[1][0];

          this.movieSubject.next({ ...restTMBD, ...restDB });
        },
        error: (errorRes) => {
          console.log(errorRes.error);
          this.movieSubject.next(this.movie);
        },
      });

    return this.movieSubject;
  }

  getRecommendations(movieId: number): Subject<Array<Movie>> {
    // request movies from db
    const movies = this.http
      .get<Array<DBMovie>>(
        `${this.baseUrl}/movies/${movieId}/recommendation?amount=10`
      )
      .pipe(
        catchError((err): Observable<any> => {
          // request external api data
          const tmbdMovies = this.http.get<{ results: Array<TMBDMovie> }>(
            `${this.externalApiUrl}/movie/${movieId}/recommendations`,
            {
              headers: new HttpHeaders()
                .set('Authorization', this.externalApiAuth)
                .set('skip', 'true'),
              params: new HttpParams()
                .set('language', 'en-US')
                .set('page', '1'),
            }
          );

          const dbMovies = tmbdMovies.pipe(
            switchMap((res) => {
              const tmbdMovies = res.results;
              const idArr: Array<number> = [];
              for (let tmbdMovie of tmbdMovies) {
                idArr.push(tmbdMovie.id);
              }

              return this.http.get<Array<DBMovie>>(`${this.baseUrl}/movies`, {
                params: { ids: idArr.join(',') },
              });
            })
          );

          const movies = forkJoin([tmbdMovies, dbMovies]).pipe(
            map((res) => {
              return this.combineMovies(res[0].results, res[1]);
            })
          );

          movies.subscribe({
            next: (res) => {
              this.movieRecommendationSubject.next(res);
            },
          });

          return throwError(() => err);
        })
      )
      .pipe(
        switchMap((dbRes: Array<DBMovie>) => {
          const tmbdMovies = forkJoin(
            dbRes.map((dbMovie) =>
              this.http.get<TMBDMovie>(
                `${this.externalApiUrl}/movie/${dbMovie.id}`,
                {
                  headers: new HttpHeaders()
                    .set('Authorization', this.externalApiAuth)
                    .set('skip', 'true'),
                  params: new HttpParams().set('language', 'en-US'),
                }
              )
            )
          ).pipe(
            tap((res) => {
              return res;
            })
          );

          return forkJoin([tmbdMovies, of(dbRes)]);
        }),
        map((res) => {
          return this.combineMovies(res[0], res[1]);
        })
      );

    const moreMovies = movies.pipe(
      switchMap((res) => {
        return this.http
          .get<{ results: Array<TMBDMovie> }>(
            `${this.externalApiUrl}/movie/${movieId}/recommendations`,
            {
              headers: new HttpHeaders()
                .set('Authorization', this.externalApiAuth)
                .set('skip', 'true'),
              params: new HttpParams()
                .set('language', 'en-US')
                .set('page', '1'),
            }
          )
          .pipe(
            map((resData) => {
              const movies: Array<Movie> = [];
              // populate movieArr
              let counter = 11 - length;
              for (let tmbdMovie of resData.results) {
                if (counter == 0) {
                  break;
                }

                // make sure no duplicates
                if (res.find((item) => item.id == tmbdMovie.id)) {
                  continue;
                }

                const { vote_average, vote_count, ...rest } = tmbdMovie;

                movies.push({
                  ...rest,
                  totalRating: 0,
                  totalVotes: 0,
                });
                counter--;
              }

              return movies;
            })
          );
      })
    );

    forkJoin([movies, moreMovies])
      .pipe(
        map((res) => {
          return res[0].concat(res[1]);
        })
      )

      .subscribe({
        next: (res) => {
          // update movie recommendation subject
          this.movieRecommendationSubject.next(res);
        },
        error: (error) => {
          console.log(error.error);
        },
      });

    return this.movieRecommendationSubject;
  }

  private combineMovies(
    tmbdMovies: Array<TMBDMovie>,
    dbMovies: Array<DBMovie>
  ): Array<Movie> {
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
    return Array.from(map.values());
  }
}
