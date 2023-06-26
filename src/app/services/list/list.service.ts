import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { List } from 'src/app/models/list/list';
import { Movie } from 'src/app/models/movie/movie';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLists(userId: string) {
    const lists = this.http.get<Array<List>>(`${this.baseUrl}/movie-lists`, {
      params: { userId },
    });

    return lists;
  }

  addMovieToList(id: string, movie: Movie) {
    const list = this.http.post<List>(
      `${this.baseUrl}/movie-lists/${id}/movies`,
      {
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
      }
    );

    return list;
  }
}
