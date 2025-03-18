'use client';

import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

/**
 * Component to display ranking trend indicators with arrows and percentage changes
 * Shows changes over different time periods (1h, 1d, 7d)
 */
export default function RankingTrendIndicator({ 
  entityId, 
  entityType = 'game', 
  rankingType = 'popularity',
  showPeriods = ['1h', '1d', '7d'],
  compact = false
}) {
  const [historyData, setHistoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch history data for multiple time periods when the component mounts
  useEffect(() => {
    async function fetchHistory() {
      if (!entityId) return;
      
      setLoading(true);
      
      try {
        // Fetch data for each period
        const periodPromises = {
          '1h': fetch(`/api/rankings/history?entityId=${encodeURIComponent(entityId)}&entityType=${entityType}&rankingType=${rankingType}&hours=1`).then(res => res.ok ? res.json() : null),
          '1d': fetch(`/api/rankings/history?entityId=${encodeURIComponent(entityId)}&entityType=${entityType}&rankingType=${rankingType}&hours=24`).then(res => res.ok ? res.json() : null),
          '7d': fetch(`/api/rankings/history?entityId=${encodeURIComponent(entityId)}&entityType=${entityType}&rankingType=${rankingType}&days=7`).then(res => res.ok ? res.json() : null)
        };
        
        // Resolve all promises
        const results = {
          '1h': await periodPromises['1h'],
          '1d': await periodPromises['1d'], 
          '7d': await periodPromises['7d']
        };
        
        setHistoryData(results);
      } catch (err) {
        console.error('Error fetching ranking history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistory();
  }, [entityId, entityType, rankingType]);
  
  // Calculate position change and percentage for a period
  function calculateChange(periodData) {
    if (!periodData || !periodData.historyData || periodData.historyData.length < 2) {
      return { positionChange: 0, percentChange: 0, hasData: false };
    }
    
    const sortedData = [...periodData.historyData].sort((a, b) => 
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );
    
    const oldestPosition = sortedData[0].position;
    const latestPosition = sortedData[sortedData.length - 1].position;
    
    // For positions, a decrease is positive (better ranking)
    const positionChange = oldestPosition - latestPosition;
    
    // Calculate percentage change
    // For ranks, we invert the percentage calculation since lower is better
    const percentChange = oldestPosition === 0 
      ? 0 
      : (positionChange / oldestPosition) * 100;
    
    return { 
      positionChange, 
      percentChange, 
      hasData: true,
      oldPosition: oldestPosition,
      newPosition: latestPosition
    };
  }
  
  // Generate individual trend indicator
  function renderTrendIndicator(period) {
    const change = calculateChange(historyData[period]);
    
    if (!change.hasData) {
      return compact ? (
        <span className="text-gray-400 text-xs">-</span>
      ) : (
        <div className="flex items-center space-x-1 text-gray-400">
          <span>-</span>
          <span className="text-xs">{period}</span>
        </div>
      );
    }
    
    const isUp = change.positionChange > 0;
    const isStable = change.positionChange === 0;
    const color = isUp ? "text-green-500" : isStable ? "text-gray-400" : "text-red-500";
    const arrow = isUp ? "▲" : isStable ? "•" : "▼";
    
    return compact ? (
      <span 
        className={`${color} text-xs font-semibold`}
        data-tooltip-id={`trend-${entityId}-${period}`}
        data-tooltip-content={`${isUp ? 'Up' : isStable ? 'No change' : 'Down'} from #${change.oldPosition} to #${change.newPosition}`}
      >
        {arrow} {Math.abs(change.percentChange).toFixed(1)}%
      </span>
    ) : (
      <div 
        className={`flex items-center space-x-1 ${color}`}
        data-tooltip-id={`trend-${entityId}-${period}`}
        data-tooltip-content={`${isUp ? 'Up' : isStable ? 'No change' : 'Down'} from #${change.oldPosition} to #${change.newPosition}`}
      >
        <span>{arrow}</span>
        <span className="font-semibold">{Math.abs(change.percentChange).toFixed(1)}%</span>
        <span className="text-xs opacity-75">({period})</span>
      </div>
    );
  }
  
  // If there's a loading error, show nothing
  if (error) {
    return null;
  }
  
  // Show loading indicator or nothing if compact
  if (loading) {
    return compact ? null : <div className="text-gray-400 text-xs">Loading...</div>;
  }
  
  return (
    <div className={`flex ${compact ? 'space-x-2' : 'flex-col space-y-1'}`}>
      {showPeriods.map(period => (
        <div key={period}>
          {renderTrendIndicator(period)}
          <Tooltip id={`trend-${entityId}-${period}`} />
        </div>
      ))}
    </div>
  );
} 