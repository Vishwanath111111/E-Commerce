'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating?: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingStars({ rating = 4.8, count, size = 'sm' }: RatingStarsProps) {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-gray-700 ml-1">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}
