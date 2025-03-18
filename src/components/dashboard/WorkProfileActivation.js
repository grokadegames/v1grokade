import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function WorkProfileActivation() {
  const { user, hasRole } = useAuth();
  const [isActivating, setIsActivating] = useState(false);
  const [message, setMessage] = useState(null);
  
  const activateWorkProfile = async () => {
    setIsActivating(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/users/roles/applicant', {
        method: 'POST',
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Work profile activated! Please refresh the page.' });
        // Force reload after a short delay to update user roles
        setTimeout(() => window.location.reload(), 2000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to activate profile');
      }
    } catch (error) {
      console.error('Error activating work profile:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsActivating(false);
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-3">Work Profile Status</h2>
      
      {hasRole('APPLICANT') ? (
        <div className="bg-purple-600/20 p-4 rounded-lg">
          <p className="text-white">
            Your work profile is <span className="font-bold text-green-400">activated</span>. 
            You can now create and manage your talent profile below.
          </p>
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-white mb-4">
            Activate your work profile to appear in the talent directory and get discovered by potential employers.
          </p>
          <button 
            onClick={activateWorkProfile}
            disabled={isActivating}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isActivating ? 'Activating...' : 'Activate Work Profile'}
          </button>
          
          {message && (
            <div className={`mt-3 p-2 rounded ${message.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 