import { DBMovie } from '../movie/movie';

export interface List {
  id: string;
  name: string;
  movies: Array<DBMovie>;
}
