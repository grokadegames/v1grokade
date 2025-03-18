'use client';

import { useEffect, useState, useMemo } from 'react';

// Component to display the ranking trend line
export default function RankingTrendline({ 
  entityId, 
  entityType = 'game', 
  rankingType = 'popularity',
  days = 30,
  width = 80,
  height = 30
}) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch history data when the component mounts
  useEffect(() => {
    async function fetchHistory() {
      if (!entityId) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `/api/rankings/history?entityId=${encodeURIComponent(entityId)}&entityType=${entityType}&rankingType=${rankingType}&days=${days}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch ranking history');
        }
        
        const data = await response.json();
        setHistoryData(data.historyData || []);
      } catch (err) {
        console.error('Error fetching ranking history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistory();
  }, [entityId, entityType, rankingType, days]);
  
  // Calculate the SVG path and trend direction
  const { pathData, trendDirection } = useMemo(() => {
    // Default values
    let path = '';
    let trend = 'stable'; // 'up', 'down', or 'stable'
    
    if (historyData.length < 2) {
      return { pathData: path, trendDirection: trend };
    }
    
    // For ranking, a lower position is better (1st is better than 10th)
    // So we need to invert the scale:
    //   - An "upward" trend means position is decreasing (improving rank)
    //   - A "downward" trend means position is increasing (declining rank)
    
    // Find min and max values for scaling
    const positions = historyData.map(item => item.position);
    const maxPosition = Math.max(...positions);
    const minPosition = Math.min(...positions);
    
    // Normalize data points to fit within SVG dimensions
    const normalize = (pos) => {
      // If all values are the same, place in the middle
      if (maxPosition === minPosition) {
        return height / 2;
      }
      // Invert Y axis (lower rank = higher on chart)
      // Scale to fit height, leaving a small margin
      return height - ((pos - minPosition) / (maxPosition - minPosition) * (height - 4)) - 2;
    };
    
    // Calculate time spacing based on number of data points
    const timeStep = width / (historyData.length - 1);
    
    // Calculate slope to determine trend direction
    const startPos = historyData[0].position;
    const endPos = historyData[historyData.length - 1].position;
    const positionChange = endPos - startPos;
    
    // Determine trend direction
    if (positionChange < 0) {
      trend = 'up'; // Rank got better (e.g., moved from 10th to 5th)
    } else if (positionChange > 0) {
      trend = 'down'; // Rank got worse (e.g., moved from 5th to 10th)
    } else {
      trend = 'stable';
    }
    
    // Create SVG path
    path = historyData.map((item, index) => {
      const x = timeStep * index;
      const y = normalize(item.position);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return { pathData: path, trendDirection: trend };
  }, [historyData, height, width]);
  
  // Generate random demo data if in development and no history exists
  // In production, real data should be used
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && historyData.length === 0 && !loading) {
      // Generate sample data for development
      const sampleData = Array.from({ length: Math.floor(Math.random() * 5) + 10 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (10 - i));
        
        // Random position between 1 and 20, with some trend bias
        const basePosition = Math.floor(Math.random() * 20) + 1;
        const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
        
        return {
          entityId,
          entityType,
          rankingType,
          position: Math.max(1, basePosition + variance * i/5),
          recordedAt: date
        };
      });
      
      setHistoryData(sampleData);
    }
  }, [loading, historyData.length, entityId, entityType, rankingType]);
  
  // Show blank space if still loading or no data
  if (loading || error || historyData.length < 2) {
    return (
      <div 
        className="rounded-md bg-gray-800" 
        style={{ width: `${width}px`, height: `${height}px` }}
      ></div>
    );
  }
  
  // Define the color based on trend direction
  const lineColor = trendDirection === 'up' 
    ? '#22c55e' // Green for improving rank
    : trendDirection === 'down' 
      ? '#ef4444' // Red for declining rank
      : '#9ca3af'; // Gray for stable
  
  return (
    <svg 
      className="rounded-md bg-black bg-opacity-25"
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={pathData}
        fill="none"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
} 