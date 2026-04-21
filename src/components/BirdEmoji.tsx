import React from 'react';
import { cn } from '../utils/helpers';

interface BirdEmojiProps {
  className?: string;
}

export const BirdEmoji: React.FC<BirdEmojiProps> = ({ className }) => {
  return (
    <img 
      src="https://em-content.zobj.net/source/apple/354/dove_1f54a-fe0f.png" 
      alt="🕊️" 
      className={cn("inline-block align-middle", className)}
      referrerPolicy="no-referrer"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
};
