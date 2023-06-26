import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  Subject,
  catchError,
  forkJoin,
  map,
  tap,
  throwError,
} from 'rxjs';
import {
  CreateReview,
  ModifyReview,
  ReviewRes,
} from 'src/app/models/review/review';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  baseUrl: string = environment.apiUrl;

  // subjects
  reviewsSubject: Subject<Array<ReviewRes>> = new Subject<Array<ReviewRes>>();

  constructor(private http: HttpClient) {}

  getReviews(id: number): Subject<Array<ReviewRes>> {
    const reviews = this.http.get<Array<ReviewRes>>(`${this.baseUrl}/reviews`, {
      params: { movieId: id },
    });

    reviews.subscribe({
      next: (res) => {
        this.reviewsSubject.next(res);
      },
      error: (err) => {
        console.log(err.error);
        this.reviewsSubject.next([]);
      },
    });

    return this.reviewsSubject;
  }

  createReview(review: CreateReview) {
    return this.http.post<ReviewRes>(`${this.baseUrl}/reviews`, review);
  }

  modifyReview(review: ModifyReview) {
    return this.http.put<ReviewRes>(
      `${this.baseUrl}/reviews/${review.id}`,
      review
    );
  }

  deleteReview(id: string, movieId: number) {
    return this.http.delete<void>(`${this.baseUrl}/reviews/${id}`, {
      params: { movieId },
    });
  }
}
