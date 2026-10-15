'use client';

import React from 'react';
import { ContentItem } from '@/types/content';
import { NewsCard } from './NewsCard';
import { MovieCard } from './MovieCard';
import { SocialCard } from './SocialCard';

interface ContentCardProps {
  item: ContentItem;
  compact?: boolean;
  reorderControl?: React.ReactNode;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  compact = false,
  reorderControl,
}) => {
  switch (item.type) {
    case 'news':
      return <NewsCard item={item} compact={compact} reorderControl={reorderControl} />;
    case 'movie':
      return <MovieCard item={item} compact={compact} reorderControl={reorderControl} />;
    case 'social':
      return <SocialCard item={item} compact={compact} reorderControl={reorderControl} />;
    default: {
      const _exhaustiveCheck: never = item;
      return null;
    }
  }
};
