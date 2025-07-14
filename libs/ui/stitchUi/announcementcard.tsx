// components/AnnouncementCard.tsx
import React from 'react';

interface AnnouncementCardProps {
  avatarImg: string;
  senderName: string;
  senderRole: string;
  timestamp: string; // ISO 8601 format string (e.g., "2023-06-15T10:00:00Z")
  content: string;
  actionHref?: string;
  actionText?: string;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  avatarImg,
  senderName,
  senderRole,
  timestamp,
  content,
  actionHref,
  actionText = 'Learn more',
}) => {
  // Function to calculate time ago from ISO string
  const getTimeAgo = (isoString: string): string => {
    try {
      const now = new Date();
      const then = new Date(isoString);
      
      // Handle invalid dates
      if (isNaN(then.getTime())) {
        console.error('Invalid timestamp:', isoString);
        return 'Recently';
      }

      const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
      
      const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
      };
      
      for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
          return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
      }
      
      return 'Just now';
    } catch (error) {
      console.error('Error calculating time ago:', error);
      return 'Recently';
    }
  };

  return (
    <div className="bg-[var(--card-background)] rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-start space-x-4">
        <img
          alt={`${senderName}'s profile picture`}
          className="rounded-full h-14 w-14 object-cover"
          src={avatarImg}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56';
          }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{senderName}</p>
              <p className="text-sm text-[var(--text-secondary)]">{senderRole}</p>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              {getTimeAgo(timestamp)}
            </p>
          </div>
          <p className="mt-2 text-[var(--text-secondary)]">{content}</p>
          {actionHref && (
            <a
              className="text-sm font-medium text-blue-500 hover:underline mt-2 inline-block"
              href={actionHref}
            >
              {actionText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;