import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast, TOAST_TYPES } from '@/contexts/ToastContext';

export default function UserDisplayNameForm() {
  // Get user data but don't use refreshUser
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState('');
  const [status, setStatus] = useState({
    isSubmitting: false,
    error: '',
    success: false
  });
  
  // Set initial value once when component mounts
  useEffect(() => {
    if (user?.displayName) {
      setFormData(user.displayName);
    }
  }, [user?.displayName]);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validation
    if (!formData.trim()) {
      setStatus(prev => ({ ...prev, error: 'Display name cannot be empty' }));
      return;
    }
    
    // Clear errors and set submitting
    setStatus({ isSubmitting: true, error: '', success: false });
    
    try {
      // Make API call
      const response = await fetch('/api/users/displayname', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: formData.trim() })
      });
      
      // Simple error handling
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update display name');
      }
      
      // Show success message
      showToast({
        message: 'Display name updated successfully',
        type: TOAST_TYPES.SUCCESS
      });
      
      // Set success state
      setStatus({ isSubmitting: false, error: '', success: true });
      
    } catch (error) {
      console.error('Error updating display name:', error);
      
      // Show error toast
      showToast({
        message: error.message || 'Failed to update display name',
        type: TOAST_TYPES.ERROR
      });
      
      // Set error state
      setStatus({ 
        isSubmitting: false, 
        error: error.message || 'An error occurred', 
        success: false 
      });
    }
  }
  
  return (
    <form onSubmit={handleSubmit} id="displayNameForm">
      <div className="mb-4">
        <label htmlFor="displayNameInput" className="block text-gray-300 mb-2">
          Display Name
        </label>
        <input
          id="displayNameInput"
          name="displayName"
          type="text"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Your display name"
          disabled={status.isSubmitting}
          maxLength={50}
        />
        
        {status.error && (
          <p className="text-red-400 text-sm mt-1" role="alert">{status.error}</p>
        )}
        
        {status.success && (
          <p className="text-green-400 text-sm mt-1" role="alert">
            Display name updated successfully.
          </p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={status.isSubmitting}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {status.isSubmitting ? 'Saving...' : 'Save Display Name'}
      </button>
    </form>
  );
} 