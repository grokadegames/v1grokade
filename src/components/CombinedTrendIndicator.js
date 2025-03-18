'use client';

import { useEffect, useState } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Tooltip } from 'react-tooltip';

/**
 * Combined component that shows both sparklines and trend indicators
 * Redesigned to match the visual style in the screenshot
 */
export default function CombinedTrendIndicator({ 
  entityId, 
  entityType = 'game', 
  rankingType = 'popularity',
  width = 120,
  height = 40,
  showPeriods = ['1d'],
  activePeriod = '1d'
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
        // Configure period parameters for API
        const periodConfig = {
          '1d': { hours: 24 },
          '7d': { days: 7 },
          '30d': { days: 30 }
        };
        
        // Determine which periods to fetch
        const periodsToFetch = showPeriods.includes(activePeriod) 
          ? showPeriods 
          : [...showPeriods, activePeriod];
        
        // Fetch data for each period
        const periodPromises = {};
        periodsToFetch.forEach(period => {
          const config = periodConfig[period];
          let queryParam = '';
          
          if (config.hours) {
            queryParam = `hours=${config.hours}`;
          } else if (config.days) {
            queryParam = `days=${config.days}`;
          }
          
          if (queryParam) {
            periodPromises[period] = fetch(
              `/api/rankings/history?entityId=${encodeURIComponent(entityId)}&entityType=${entityType}&rankingType=${rankingType}&${queryParam}`
            ).then(res => res.ok ? res.json() : null);
          }
        });
        
        // Resolve all promises
        const results = {};
        for (const period of Object.keys(periodPromises)) {
          results[period] = await periodPromises[period];
        }
        
        setHistoryData(results);
      } catch (err) {
        console.error('Error fetching ranking history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistory();
  }, [entityId, entityType, rankingType, showPeriods, activePeriod]);
  
  // Calculate change data for a period
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
    
    // Extract points for sparkline - ensure we have at least 10 points for a smoother line
    const dataPoints = sortedData.map(item => 100 - item.position);
    
    // If we have very few data points, interpolate to create a smoother line
    let sparklineData = dataPoints;
    if (dataPoints.length > 1 && dataPoints.length < 10) {
      sparklineData = [];
      const totalPoints = 10;
      for (let i = 0; i < totalPoints; i++) {
        const index = (i / (totalPoints - 1)) * (dataPoints.length - 1);
        const lowerIndex = Math.floor(index);
        const upperIndex = Math.ceil(index);
        const weight = index - lowerIndex;
        
        if (lowerIndex === upperIndex) {
          sparklineData.push(dataPoints[lowerIndex]);
        } else {
          const interpolatedValue = 
            dataPoints[lowerIndex] * (1 - weight) + 
            dataPoints[upperIndex] * weight;
          sparklineData.push(interpolatedValue);
        }
      }
    }
    
    return { 
      positionChange, 
      percentChange, 
      hasData: true,
      oldPosition: oldestPosition,
      newPosition: latestPosition,
      sparklineData,
      data: sortedData
    };
  }
  
  // Format percentage for display
  function formatPercentage(value) {
    if (value === 0) return '0%';
    const rounded = Math.abs(value).toFixed(1);
    // Remove trailing zeros after decimal point
    return rounded.endsWith('.0') 
      ? `${Math.abs(parseInt(rounded))}%` 
      : `${rounded}%`;
  }
  
  // Render the trend chart
  function renderTrendChart(period) {
    const change = calculateChange(historyData[period]);
    
    // Demo data for empty states to show a line
    if (!change.hasData || change.sparklineData.length < 2) {
      // Create some random demo data that looks like a trend
      const demoData = [];
      for (let i = 0; i < 10; i++) {
        // Random values that trend slightly upward for visual appeal
        demoData.push(40 + Math.random() * 20 + i);
      }
      
      return (
        <div className="relative h-full flex items-center">
          <Sparklines 
            data={demoData} 
            width={width} 
            height={height - 10}
            margin={2}
          >
            <SparklinesLine 
              color="rgba(75, 85, 99, 0.5)" 
              style={{ 
                strokeWidth: 3, 
                stroke: "rgba(75, 85, 99, 0.5)", 
                fill: "none" 
              }}
            />
          </Sparklines>
          <div className="absolute right-1 text-xs font-medium text-gray-500">
            --
          </div>
        </div>
      );
    }
    
    const isUp = change.positionChange > 0;
    const isStable = change.positionChange === 0;
    
    // Color palette
    const upColor = "#22c55e"; // Brighter green 
    const downColor = "#ef4444"; // Red
    const stableColor = "#9ca3af"; // Gray
    
    const lineColor = isUp ? upColor : isStable ? stableColor : downColor;
    const fillColor = isUp 
      ? "rgba(34, 197, 94, 0.25)" 
      : isStable 
        ? "rgba(156, 163, 175, 0.1)" 
        : "rgba(239, 68, 68, 0.25)";
    
    const formattedPercentage = formatPercentage(change.percentChange);
    
    return (
      <div className="relative h-full flex items-center w-full">
        <div className="flex-grow mr-2">
          <Sparklines 
            data={change.sparklineData} 
            width={width * 2 - 40} /* Increased width by 200% */
            height={height - 10}
            margin={2}
            min={Math.min(...change.sparklineData) * 0.95}
            max={Math.max(...change.sparklineData) * 1.05}
          >
            <SparklinesLine 
              color={lineColor} 
              style={{ 
                strokeWidth: 7, /* Increased thickness by 200% */
                stroke: lineColor,
                fill: fillColor
              }}
            />
          </Sparklines>
        </div>
        
        <div 
          className="min-w-[40px] text-right text-xs font-medium pl-1"
          style={{ 
            color: lineColor,
            fontWeight: 700
          }}
        >
          {isUp ? '+' : isStable ? '' : '-'}{formattedPercentage}
        </div>
      </div>
    );
  }
  
  // If there's a loading error, show nothing
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-gray-800/20 w-full h-full rounded-md"></div>
      </div>
    );
  }
  
  // Show loading placeholder
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse bg-gray-800/20 w-full h-full rounded-md"></div>
      </div>
    );
  }
  
  // Calculate the tooltip content
  const tooltipContent = (() => {
    const change = calculateChange(historyData[activePeriod]);
    if (!change.hasData) return `No trend data for ${activePeriod}`;
    
    const direction = change.positionChange > 0 
      ? 'Improved' 
      : change.positionChange < 0 
        ? 'Dropped' 
        : 'Stable';
    
    return `${direction} by ${Math.abs(change.positionChange)} position${Math.abs(change.positionChange) !== 1 ? 's' : ''} over ${activePeriod}`;
  })();
  
  return (
    <div 
      className="w-full h-full flex items-center"
      data-tooltip-id={`trend-tooltip-${entityId}`}
      data-tooltip-content={tooltipContent}
    >
      {renderTrendChart(activePeriod)}
      <Tooltip id={`trend-tooltip-${entityId}`} />
    </div>
  );
} 