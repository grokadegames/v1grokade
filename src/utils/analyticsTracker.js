/**
 * Utility for tracking page views and other analytics
 */

/**
 * Track a page view
 * @param {string} path - The current page path
 * @param {string|null} userId - The current user ID if authenticated
 * @returns {Promise<Object|null>} - The response from the API or null if failed
 */
export async function trackPageView(path, userId = null) {
  try {
    // Get user agent and referrer from browser
    const userAgent = navigator.userAgent;
    const referer = document.referrer;
    
    // Call the analytics API endpoint
    const response = await fetch('/api/analytics/page-views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        userId,
        userAgent,
        referer,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to track page view for ${path}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking page view:', error);
    return null;
  }
}

/**
 * Get analytics data for a specific period
 * @param {string} period - The period to get analytics for (day, week, month, all)
 * @param {string|null} path - Optional path filter
 * @returns {Promise<Object|null>} - The analytics data or null if failed
 */
export async function getAnalytics(period = 'week', path = null) {
  try {
    let url = `/api/analytics/page-views?period=${period}`;
    if (path) {
      url += `&path=${encodeURIComponent(path)}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to get analytics for period ${period}`);
    }
    
    const data = await response.json();
    return data.analytics;
  } catch (error) {
    console.error('Error getting analytics:', error);
    return null;
  }
} 