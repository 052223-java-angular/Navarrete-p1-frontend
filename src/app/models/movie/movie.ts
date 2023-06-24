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
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: false;

  // optional
  budget?: number;
  genres?: Array<{ id: number; name: string }>;
  homepage?: string;
  production_companies?: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  revenue?: number;
  runtime?: number;
  status?: string;
  tagline?: string;
}

export interface TMBDMovie {
  id: number;
  adult: boolean;
  backdrop_path: string;
  genre_ids: Array<number>;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: false;
  vote_count: number;
  vote_average: number;

  // optional
  budget?: number;
  genres?: Array<{ id: number; name: string }>;
  homepage?: string;
  production_companies?: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  revenue?: number;
  runtime?: number;
  status?: string;
  tagline?: string;
}

export interface DBMovie {
  id: number;
  totalRating: number;
  totalVotes: number;
  reviews?: Array<Review>;
}
