import { ContentItem } from '@/types/content';
import { DEMO_NEWS_ITEMS } from './newsData';
import { DEMO_MOVIE_ITEMS } from './moviesData';
import { DEMO_SOCIAL_ITEMS } from './socialData';

export { DEMO_NEWS_ITEMS } from './newsData';
export { DEMO_MOVIE_ITEMS } from './moviesData';
export { DEMO_SOCIAL_ITEMS } from './socialData';

export const ALL_DEMO_CONTENT: ContentItem[] = [
  DEMO_NEWS_ITEMS[0],
  DEMO_MOVIE_ITEMS[0],
  DEMO_SOCIAL_ITEMS[0],
  DEMO_NEWS_ITEMS[1],
  DEMO_MOVIE_ITEMS[2],
  DEMO_SOCIAL_ITEMS[1],
  DEMO_NEWS_ITEMS[2],
  DEMO_MOVIE_ITEMS[1],
  DEMO_NEWS_ITEMS[3],
  DEMO_MOVIE_ITEMS[3],
  DEMO_SOCIAL_ITEMS[2],
  DEMO_NEWS_ITEMS[4],
  DEMO_MOVIE_ITEMS[4],
];

export const DEMO_USER_PROFILE = {
  name: 'Alex Rivera',
  role: 'Software Engineer Intern (Demo)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  email: 'alex.rivera.demo@internship.dev',
  badge: 'Phase 1 Evaluator',
};
