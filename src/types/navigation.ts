export type NavigationSection = 'feed' | 'trending' | 'favorites' | 'settings';

export interface NavItem {
  id: NavigationSection;
  label: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'feed',
    label: 'Feed',
    description: 'Personalized stream of news, movies, and community updates',
  },
  {
    id: 'trending',
    label: 'Trending',
    description: 'Top-ranked content gaining traction right now',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    description: 'Bookmarked articles, movies, and posts saved for later',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Manage content preferences, categories, and genres',
  },
];
