import { DBMovie } from '../movie/movie';

export interface ReviewRes {
  id: string;
  rating: number;
  description: string;
  username: string;
  avatar: string;
  title: string;
  posterPath: string;
  releaseDate: Date;
}

export interface CreateReview {
  rating: number;
  description: string;
  movieId: number;
  title: string;
  posterPath: string;
  releaseDate: Date;
}

export interface ModifyReview {
  id: string;
  rating: number;
  description: string;
  movieId: number;
}
