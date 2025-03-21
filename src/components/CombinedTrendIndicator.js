'use client';

import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

/**
 * Combined component that shows trend indicators
 * Simplified to only show percentage without graph
 */
export default function CombinedTrendIndicator({ 
  entityId, 
  entityType = 'game', 
  rankingType = 'popularity',
  width = 120,
  height = 40,
  showPeriods = ['1d'],
  activePeriod = '1d',
  showPercentOnly = false
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
    
    // Get oldest and newest record
    const oldestRecord = sortedData[0];
    const newestRecord = sortedData[sortedData.length - 1];
    
    // Determine which metric to use based on ranking type
    let metricValue, metricChange, percentChange;
    
    if (periodData.rankingType === 'popularity') {
      // For popularity, use combined views+plays
      const oldViews = oldestRecord.views || 0;
      const oldPlays = oldestRecord.plays || 0;
      const newViews = newestRecord.views || 0;
      const newPlays = newestRecord.plays || 0;
      
      const oldMetric = oldViews + (oldPlays * 2); // Same formula as popularity score
      const newMetric = newViews + (newPlays * 2);
      
      metricValue = newMetric;
      metricChange = newMetric - oldMetric;
      
      // Calculate percentage change, avoid division by zero
      percentChange = oldMetric > 0 ? (metricChange / oldMetric) * 100 : 0;
    } 
    else if (periodData.rankingType === 'quality') {
      // For quality, use score directly (it's already the likes ratio)
      const oldScore = oldestRecord.score || 0.5;
      const newScore = newestRecord.score || 0.5;
      
      metricValue = newScore;
      metricChange = newScore - oldScore;
      
      // Calculate percentage change for the score
      percentChange = oldScore > 0 ? (metricChange / oldScore) * 100 : 0;
    }
    else if (periodData.rankingType === 'creator') {
      // For creators, use total views & plays growth
      const oldViews = oldestRecord.views || 0;
      const oldPlays = oldestRecord.plays || 0; 
      const newViews = newestRecord.views || 0;
      const newPlays = newestRecord.plays || 0;
      
      const oldMetric = oldViews + oldPlays;
      const newMetric = newViews + newPlays;
      
      metricValue = newMetric;
      metricChange = newMetric - oldMetric;
      
      // Calculate percentage change
      percentChange = oldMetric > 0 ? (metricChange / oldMetric) * 100 : 0;
    }
    
    // Don't amplify changes, but still cap at reasonable levels
    percentChange = Math.min(Math.max(percentChange, -50), 50);
    
    // Instead of using the actual data points, create a simple diagonal line
    // based on whether the trend is positive or negative
    let sparklineData;
    if (percentChange > 0) {
      // Positive trend: line from bottom left to top right
      sparklineData = [30, 70];
    } else if (percentChange < 0) {
      // Negative trend: line from top left to bottom right
      sparklineData = [70, 30];
    } else {
      // Neutral trend: horizontal line
      sparklineData = [50, 50];
    }
    
    return { 
      metricChange,
      percentChange, 
      hasData: true,
      oldValue: oldestRecord,
      newValue: newestRecord,
      sparklineData,
      data: sortedData
    };
  }
  
  // Format percentage for display
  function formatPercentage(value) {
    if (value === 0) return '0%';
    
    // Round to nearest integer for cleaner display
    const rounded = Math.round(Math.abs(value));
    
    // Always return with a sign
    const sign = value > 0 ? '+' : '-';
    return `${sign}${rounded}%`;
  }
  
  // Render the trend chart with only percentage, no sparkline
  function renderTrendChart(period) {
    // Check if we're rendering the active period that already has change calculated
    if (period === activePeriod && change && change.hasData) {
      const isPositive = change.percentChange > 0;
      const isStable = change.percentChange === 0;
      
      // Color palette - increased saturation
      const upColor = "#10b981"; // Brighter green
      const downColor = "#ef4444"; // Bright red
      const stableColor = "#9ca3af"; // Gray
      
      const lineColor = isPositive ? upColor : isStable ? stableColor : downColor;
      
      const formattedPercentage = formatPercentage(change.percentChange);
      
      return (
        <div className="relative h-full flex items-center justify-end w-full">
          <div 
            className="px-3 py-1 text-sm font-medium rounded-md"
            style={{ 
              color: lineColor,
              fontWeight: 800,
              backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : isStable ? 'rgba(156, 163, 175, 0.1)' : 'rgba(239, 68, 68, 0.1)'
            }}
          >
            {formattedPercentage}
          </div>
        </div>
      );
    }
    
    // For non-active periods or if active period has no data, calculate the change
    const periodChange = period === activePeriod ? change : calculateChange(historyData[period]);
    
    // Demo data for empty states
    if (!periodChange.hasData) {
      return (
        <div className="relative h-full flex items-center justify-end">
          <div className="px-3 py-1 text-sm font-medium rounded-md text-gray-500 bg-gray-800/20">
            --
          </div>
        </div>
      );
    }
    
    const isPositive = periodChange.percentChange > 0;
    const isStable = periodChange.percentChange === 0;
    
    // Color palette - increased saturation
    const upColor = "#10b981"; // Brighter green
    const downColor = "#ef4444"; // Bright red
    const stableColor = "#9ca3af"; // Gray
    
    const lineColor = isPositive ? upColor : isStable ? stableColor : downColor;
    
    const formattedPercentage = formatPercentage(periodChange.percentChange);
    
    return (
      <div className="relative h-full flex items-center justify-end w-full">
        <div 
          className="px-3 py-1 text-sm font-medium rounded-md"
          style={{ 
            color: lineColor,
            fontWeight: 800,
            backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : isStable ? 'rgba(156, 163, 175, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}
        >
          {formattedPercentage}
        </div>
      </div>
    );
  }
  
  // Calculate change data based on history data
  const change = historyData[activePeriod] ? calculateChange(historyData[activePeriod]) : null;
  
  // For "showPercentOnly" mode, render just the percentage for active period
  if (showPercentOnly) {
    // Check if we have data
    if (!change || !change.hasData) {
      return (
        <div className="px-3 py-1 text-sm font-medium rounded-md text-gray-500 bg-gray-800/20">
          --
        </div>
      );
    }
    
    const isPositive = change.percentChange > 0;
    const isStable = change.percentChange === 0;
    
    // Color palette
    const upColor = "#10b981"; // Green
    const downColor = "#ef4444"; // Red
    const stableColor = "#9ca3af"; // Gray
    
    const textColor = isPositive ? upColor : isStable ? stableColor : downColor;
    
    const formattedPercentage = formatPercentage(change.percentChange);
    
    return (
      <div 
        className="px-3 py-1 text-sm font-medium rounded-md"
        style={{ 
          color: textColor,
          fontWeight: 700,
          backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : isStable ? 'rgba(156, 163, 175, 0.1)' : 'rgba(239, 68, 68, 0.1)'
        }}
      >
        {formattedPercentage}
      </div>
    );
  }
  
  // For regular mode, return the standard component
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-grok-purple rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-xs text-red-500">Error</div>
    );
  }
  
  // Display active period chart, or the first chart if active period is not in showPeriods
  const periodToRender = showPeriods.includes(activePeriod) ? activePeriod : showPeriods[0];
  
  return renderTrendChart(periodToRender);
} 