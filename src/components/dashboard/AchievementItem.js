import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AchievementItem({
  id,
  title,
  description,
  icon,
  linkText,
  linkUrl,
  isUnlocked = false,
  onUnlock,
  compact = false
}) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    setUnlocked(isUnlocked);
  }, [isUnlocked]);
  
  const handleClick = async (e) => {
    // Only handle achievement unlocking if not already unlocked
    if (!unlocked && isAuthenticated) {
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/achievements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ achievementId: id }),
        });
        
        if (response.ok) {
          setUnlocked(true);
          if (onUnlock) onUnlock(id);
        }
      } catch (error) {
        console.error('Error unlocking achievement:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className={`bg-gray-800 ${compact ? 'p-2' : 'p-4'} rounded-lg text-center ${unlocked ? '' : 'opacity-40 hover:opacity-60 transition-opacity'}`}>
      <div className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center`}>
        {unlocked ? (
          <svg xmlns="http://www.w3.org/2000/svg" className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-green-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <div className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} ${isLoading ? 'animate-pulse' : ''}`}>
            {icon}
          </div>
        )}
      </div>
      <h3 className={`font-medium mb-1 ${compact ? 'text-xs' : ''}`}>{title}</h3>
      {!compact && <p className="text-xs text-grok-text-secondary">{description}</p>}
      {linkText && linkUrl && (
        <Link 
          href={linkUrl} 
          className={`${compact ? 'text-[10px]' : 'text-xs'} text-purple-400 hover:text-purple-300 inline-block ${compact ? '' : 'mt-2'}`}
          onClick={handleClick}
        >
          {linkText}
        </Link>
      )}
    </div>
  );
} 