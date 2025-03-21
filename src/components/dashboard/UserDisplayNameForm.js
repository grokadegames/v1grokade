import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast, TOAST_TYPES } from '@/contexts/ToastContext';

export default function UserDisplayNameForm() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/users/displayname', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update display name');
      }
      
      // Refresh user data to update the UI
      await refreshUser();
      
      showToast({
        message: 'Display name updated successfully',
        type: TOAST_TYPES.SUCCESS,
      });
      
    } catch (error) {
      console.error('Error updating display name:', error);
      setError(error.message);
      
      showToast({
        message: error.message || 'Failed to update display name',
        type: TOAST_TYPES.ERROR,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="displayName" className="block text-gray-300 mb-2">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Your display name"
          required
        />
        {error && (
          <p className="text-red-400 text-sm mt-1">{error}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
      >
        {isSubmitting ? 'Saving...' : 'Save Display Name'}
      </button>
    </form>
  );
} 