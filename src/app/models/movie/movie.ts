import { Review } from '../review/review';

export interface Movie {
  id: number;
  totalRating: number;
  totalVotes: number;
  reviews?: Array<Review>;
  adult: boolean;
  backdrop_path: string;
  genre_ids: Array<number>;
  original_language: string;
  original_title: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: false;
}

export interface TMBDMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: Array<number>;
  id: number;
  original_language: string;
  original_title: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: false;
  vote_count: number;
  vote_average: number;
}

export interface DBMovie {
  id: number;
  totalRating: number;
  totalVotes: number;
  reviews?: Array<Review>;
}
