'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAnalytics } from '@/utils/analyticsTracker';
import AuthNavbar from '@/components/AuthNavbar';
import Footer from '@/components/Footer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminAnalytics() {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('week');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!isLoading && isAuthenticated) {
        setIsLoading(true);
        const data = await getAnalytics(period);
        setAnalytics(data);
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchAnalytics();
    }
  }, [period, loading, isAuthenticated, isLoading]);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (!loading && isAuthenticated && !hasRole('ADMIN')) {
      router.push('/dashboard');
    }
  }, [loading, isAuthenticated, router, hasRole]);

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  // Prepare chart data for traffic over time
  const trafficChartData = {
    labels: analytics?.trafficByDay?.map(item => new Date(item.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Page Views',
        data: analytics?.trafficByDay?.map(item => item.views) || [],
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Prepare chart data for top pages
  const topPagesChartData = {
    labels: analytics?.topPages?.map(page => page.path.substring(0, 20) + (page.path.length > 20 ? '...' : '')) || [],
    datasets: [
      {
        label: 'Page Views',
        data: analytics?.topPages?.map(page => page.views) || [],
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRole('ADMIN')) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-grok-dark text-white">
      <AuthNavbar />
      <div className="container mx-auto px-4 pt-16 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
          <p className="text-grok-text-secondary mt-2">
            View and analyze website traffic and user engagement
          </p>
        </div>

        {/* Period selector */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => handlePeriodChange('day')}
            className={`px-4 py-2 rounded-md ${
              period === 'day'
                ? 'bg-grok-purple text-white'
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handlePeriodChange('week')}
            className={`px-4 py-2 rounded-md ${
              period === 'week'
                ? 'bg-grok-purple text-white'
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => handlePeriodChange('month')}
            className={`px-4 py-2 rounded-md ${
              period === 'month'
                ? 'bg-grok-purple text-white'
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => handlePeriodChange('all')}
            className={`px-4 py-2 rounded-md ${
              period === 'all'
                ? 'bg-grok-purple text-white'
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
          >
            All Time
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Total Page Views</h3>
                  <div className="text-grok-purple">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold mt-2">{analytics?.totalPageViews || 0}</p>
                <p className="text-grok-text-secondary mt-1">
                  {period === 'day' ? 'Last 24 hours' : 
                   period === 'week' ? 'Last 7 days' : 
                   period === 'month' ? 'Last 30 days' : 'All time'}
                </p>
              </div>

              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Unique Visitors</h3>
                  <div className="text-grok-purple">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold mt-2">{analytics?.uniqueVisitors || 0}</p>
                <p className="text-grok-text-secondary mt-1">
                  {period === 'day' ? 'Last 24 hours' : 
                   period === 'week' ? 'Last 7 days' : 
                   period === 'month' ? 'Last 30 days' : 'All time'}
                </p>
              </div>

              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Avg. Views Per Page</h3>
                  <div className="text-grok-purple">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold mt-2">
                  {analytics?.topPages?.length ? 
                    (analytics.totalPageViews / analytics.topPages.length).toFixed(1) : 
                    '0'}
                </p>
                <p className="text-grok-text-secondary mt-1">
                  {period === 'day' ? 'Last 24 hours' : 
                   period === 'week' ? 'Last 7 days' : 
                   period === 'month' ? 'Last 30 days' : 'All time'}
                </p>
              </div>
            </div>

            {/* Main charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Traffic Over Time</h3>
                <div className="h-64">
                  {analytics?.trafficByDay?.length ? (
                    <Line 
                      data={trafficChartData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)',
                            },
                            ticks: {
                              color: 'rgba(255, 255, 255, 0.7)',
                            }
                          },
                          x: {
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)',
                            },
                            ticks: {
                              color: 'rgba(255, 255, 255, 0.7)',
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            labels: {
                              color: 'rgba(255, 255, 255, 0.7)',
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-grok-text-secondary">No traffic data available for this period</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Most Visited Pages</h3>
                <div className="h-64">
                  {analytics?.topPages?.length ? (
                    <Bar 
                      data={topPagesChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)',
                            },
                            ticks: {
                              color: 'rgba(255, 255, 255, 0.7)',
                            }
                          },
                          x: {
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)',
                            },
                            ticks: {
                              color: 'rgba(255, 255, 255, 0.7)',
                              maxRotation: 45,
                              minRotation: 45
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            labels: {
                              color: 'rgba(255, 255, 255, 0.7)',
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-grok-text-secondary">No page data available for this period</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed top pages table */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-xl mb-8">
              <h3 className="text-xl font-semibold mb-4">Top Pages Breakdown</h3>
              
              {analytics?.topPages?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 font-semibold">#</th>
                        <th className="py-3 px-4 font-semibold">Page URL</th>
                        <th className="py-3 px-4 font-semibold text-right">Views</th>
                        <th className="py-3 px-4 font-semibold text-right">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topPages.map((page, index) => (
                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-900">
                          <td className="py-2 px-4">{index + 1}</td>
                          <td className="py-2 px-4 max-w-xs truncate">{page.path}</td>
                          <td className="py-2 px-4 text-right">{page.views}</td>
                          <td className="py-2 px-4 text-right">
                            {((page.views / analytics.totalPageViews) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-8 text-grok-text-secondary">
                  No page data available for this period
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
} 