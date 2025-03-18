'use client';

import { useEffect, useState } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

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
  const [trendDirection, setTrendDirection] = useState('stable');
  
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
  
  // Calculate trend direction and prepare data for sparklines
  useEffect(() => {
    if (!loading && historyData.length >= 2) {
      // Sort data by date
      const sortedData = [...historyData].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const firstPosition = sortedData[0].position;
      const lastPosition = sortedData[sortedData.length - 1].position;
      
      // For positions, lower number is better (e.g., #1 is better than #10)
      // So if last position < first position = improving trend (UP)
      if (lastPosition < firstPosition) {
        setTrendDirection('up');
      } else if (lastPosition > firstPosition) {
        setTrendDirection('down');
      } else {
        setTrendDirection('stable');
      }
    } else if (isDevelopment() && !loading && historyData.length < 2) {
      // In development, create random sample data for visualization
      generateDemoData();
    }
  }, [loading, historyData]);

  // Create some demo data for development visualization
  const generateDemoData = () => {
    const demoDirection = Math.random() > 0.5 ? 'up' : 'down';
    setTrendDirection(demoDirection);
  };
  
  // Function to check if we're in development environment
  const isDevelopment = () => {
    return process.env.NODE_ENV === 'development';
  };
  
  // Convert history data to values for Sparklines
  const sparklineData = historyData.length >= 2 
    ? [...historyData]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        // Invert position values since lower is better for rankings
        .map(item => 100 - item.position)
    : [50, 50]; // Default flat line if no data

  // Define the color based on trend direction
  const lineColor = trendDirection === 'up' 
    ? '#22c55e' // Green for improving rank
    : trendDirection === 'down' 
      ? '#ef4444' // Red for declining rank
      : '#9ca3af'; // Gray for stable
  
  return (
    <div className="rounded-md bg-transparent border border-gray-700" style={{ width, height }}>
      <Sparklines 
        data={sparklineData} 
        width={width} 
        height={height}
        margin={2}
        min={0}
      >
        <SparklinesLine 
          color={lineColor} 
          style={{ strokeWidth: 3, stroke: lineColor, fill: "none" }}
        />
      </Sparklines>
    </div>
  );
} 