import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast, TOAST_TYPES } from '@/contexts/ToastContext';

export default function UserDisplayNameForm() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [updateSuccessful, setUpdateSuccessful] = useState(false);
  
  // Initialize the form field whenever the user object changes
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user?.displayName]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!displayName || !displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    setUpdateSuccessful(false);
    
    try {
      // Show processing toast
      showToast({
        message: 'Updating display name...',
        type: TOAST_TYPES.INFO,
      });
      
      // Make the API call
      const response = await fetch('/api/users/displayname', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName: displayName.trim() }),
      });
      
      // Get response data
      const data = await response.json();
      
      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update display name');
      }
      
      // Update was successful
      setUpdateSuccessful(true);
      
      // Show success toast
      showToast({
        message: 'Display name updated successfully',
        type: TOAST_TYPES.SUCCESS,
      });
      
      // Manually update the document title if needed
      if (typeof document !== 'undefined') {
        document.title = `${displayName.trim()} | Grokade Dashboard`;
      }
      
      // We don't refresh the user data here to avoid the error
      // The user's display name will update on the next page navigation
      
    } catch (error) {
      console.error('Error updating display name:', error);
      setError(error.message || 'An error occurred');
      
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
          disabled={isSubmitting}
          maxLength={50}
          required
        />
        {error && (
          <p className="text-red-400 text-sm mt-1">{error}</p>
        )}
        {updateSuccessful && (
          <p className="text-green-400 text-sm mt-1">Your display name has been updated successfully.</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Display Name'}
      </button>
    </form>
  );
} 