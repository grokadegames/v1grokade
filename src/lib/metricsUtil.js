/**
 * Utility functions for tracking game metrics
 */

/**
 * Track a metric event (view, play, like, dislike)
 * @param {string} gameId - The ID of the game to track
 * @param {string} metricType - The type of metric (views, plays, likes, dislikes)
 * @param {number} increment - Amount to increment (default: 1)
 * @returns {Promise<Object>} - Response from the API
 */
export async function trackMetric(gameId, metricType, increment = 1) {
  if (!gameId || !metricType) {
    console.error('Missing required parameters for tracking metrics');
    return null;
  }
  
  try {
    const response = await fetch('/api/game-metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId,
        metricType,
        increment,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to track ${metricType} for game ${gameId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking metric:', error);
    return null;
  }
}

/**
 * Track a game view (call this when the game detail page is loaded)
 * @param {string} gameId - The ID of the game being viewed
 * @returns {Promise<Object>} - Response from the API
 */
export async function trackGameView(gameId) {
  return trackMetric(gameId, 'views');
}

/**
 * Track a game play (call this when the "Play Now" button is clicked)
 * @param {string} gameId - The ID of the game being played
 * @returns {Promise<Object>} - Response from the API
 */
export async function trackGamePlay(gameId) {
  return trackMetric(gameId, 'plays');
}

/**
 * Track a game like
 * @param {string} gameId - The ID of the game being liked
 * @returns {Promise<Object>} - Response from the API
 */
export async function trackGameLike(gameId) {
  return trackMetric(gameId, 'likes');
}

/**
 * Track a game dislike
 * @param {string} gameId - The ID of the game being disliked
 * @returns {Promise<Object>} - Response from the API
 */
export async function trackGameDislike(gameId) {
  return trackMetric(gameId, 'dislikes');
}

/**
 * Get metrics for a specific game
 * @param {string} gameId - The ID of the game
 * @returns {Promise<Object>} - Game metrics data
 */
export async function getGameMetrics(gameId) {
  try {
    const response = await fetch(`/api/game-metrics?gameId=${gameId}`);
    if (!response.ok) {
      throw new Error(`Failed to get metrics for game ${gameId}`);
    }
    
    const data = await response.json();
    return data.metrics;
  } catch (error) {
    console.error('Error getting game metrics:', error);
    return null;
  }
}

/**
 * Get metrics for all games
 * @returns {Promise<Array>} - Metrics data for all games
 */
export async function getAllGameMetrics() {
  try {
    const response = await fetch('/api/game-metrics');
    if (!response.ok) {
      throw new Error('Failed to get metrics for all games');
    }
    
    const data = await response.json();
    return data.metrics;
  } catch (error) {
    console.error('Error getting all game metrics:', error);
    return null;
  }
} 