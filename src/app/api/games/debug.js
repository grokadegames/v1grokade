'use client';

import { useState, useEffect } from 'react';

export default function GameApiDebugger() {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prismaError, setPrismaError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        setPrismaError(null);

        // Attempt to fetch games API
        const response = await fetch('/api/games');
        
        // Get response data regardless of status code
        const data = await response.json();
        
        // Set the API response
        setApiResponse({
          status: response.status,
          ok: response.ok,
          data
        });

        // Check for database connection
        try {
          const dbCheckResponse = await fetch('/api/debug/db-check');
          const dbCheckData = await dbCheckResponse.json();
          
          if (!dbCheckResponse.ok) {
            setPrismaError({
              status: dbCheckResponse.status,
              message: dbCheckData.message || 'Database connection failed'
            });
          }
        } catch (dbErr) {
          setPrismaError({
            message: dbErr.message || 'Failed to check database connection',
            error: dbErr
          });
        }
      } catch (err) {
        setError({
          message: err.message || 'Failed to fetch games',
          error: err
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-4">Game API Debugger</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">API Response</h2>
            {error ? (
              <div className="bg-red-900 p-4 rounded-md">
                <h3 className="font-bold">Error fetching API</h3>
                <p>{error.message}</p>
                <pre className="mt-2 overflow-x-auto text-xs">{JSON.stringify(error, null, 2)}</pre>
              </div>
            ) : (
              <div>
                <div className={`p-4 rounded-md ${apiResponse?.ok ? 'bg-green-900' : 'bg-red-900'}`}>
                  <p><span className="font-bold">Status:</span> {apiResponse?.status}</p>
                  <p><span className="font-bold">Success:</span> {apiResponse?.ok ? 'Yes' : 'No'}</p>
                </div>
                <div className="mt-4 bg-gray-900 p-4 rounded-md overflow-x-auto">
                  <pre className="text-xs">{JSON.stringify(apiResponse?.data, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
          
          {prismaError && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Database Connection</h2>
              <div className="bg-red-900 p-4 rounded-md">
                <h3 className="font-bold">Database Error</h3>
                <p>{prismaError.message}</p>
                <pre className="mt-2 overflow-x-auto text-xs">{JSON.stringify(prismaError, null, 2)}</pre>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Troubleshooting Steps</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Check that your database connection string is correctly set in the environment variables</li>
              <li>Verify that the Prisma schema matches your database structure</li>
              <li>Ensure that the API endpoint is properly handling errors</li>
              <li>Check that you have games data in your database</li>
              <li>Make sure your API response is formatting data correctly for the GameCard component</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 