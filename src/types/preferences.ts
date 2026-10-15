import { NewsCategory, MovieGenre } from './content';

export interface UserPreferences {
  selectedNewsCategories: NewsCategory[];
  selectedMovieGenres: MovieGenre[];
  contentFilters: {
    showNews: boolean;
    showMovies: boolean;
    showSocial: boolean;
  };
  compactView: boolean;
}

export const ALL_NEWS_CATEGORIES: NewsCategory[] = [
  'Technology',
  'Business',
  'Design',
  'Science',
  'Health',
];

export const ALL_MOVIE_GENRES: MovieGenre[] = [
  'Sci-Fi',
  'Drama',
  'Action',
  'Comedy',
  'Animation',
  'Documentary',
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  selectedNewsCategories: ['Technology', 'Design', 'Science'],
  selectedMovieGenres: ['Sci-Fi', 'Drama', 'Action'],
  contentFilters: {
    showNews: true,
    showMovies: true,
    showSocial: true,
  },
  compactView: false,
};
