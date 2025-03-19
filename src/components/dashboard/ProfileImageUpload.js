import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileImageUpload({ minimal = false, onUploadSuccess }) {
  const { user, refreshUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // If in minimal mode, trigger upload immediately
    if (minimal) {
      handleUpload(null, file);
    }
  };
  
  const handleUpload = async (e, fileOverride = null) => {
    if (e) e.preventDefault();
    
    const file = fileOverride || fileInputRef.current.files[0];
    if (!file) {
      setMessage({ type: 'error', text: 'Please select an image to upload' });
      return;
    }
    
    setIsUploading(true);
    setMessage(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/users/profile-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const data = await response.json();
      
      // Update the UI with success message
      setMessage({ type: 'success', text: 'Profile image uploaded successfully!' });
      
      // Clear the file input
      fileInputRef.current.value = '';
      
      // Refresh user data to get the updated profile image URL
      await refreshUser();
      
      // Call onUploadSuccess callback if provided
      if (typeof onUploadSuccess === 'function') {
        onUploadSuccess(data.imageUrl);
      }
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsUploading(false);
    }
  };
  
  // If in minimal mode, only render the hidden input
  if (minimal) {
    return (
      <>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="profile-image-upload"
        />
        {message && (
          <div className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg z-50 ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`} style={{maxWidth: '300px'}}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {message.text}
            </div>
          </div>
        )}
        {isUploading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white">Uploading your profile image...</p>
            </div>
          </div>
        )}
      </>
    );
  }
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-3">Profile Image</h2>
      <p className="text-gray-400 mb-4">Upload a professional photo for your talent profile</p>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
          {message.text}
        </div>
      )}
      
      <div className="flex flex-col items-center mb-4">
        <div 
          className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 mb-4 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity hover:ring-2 hover:ring-purple-400 relative group"
          onClick={triggerFileSelect}
          title="Click to change profile photo"
        >
          {preview ? (
            <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
          ) : user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Current profile" className="w-full h-full object-cover" />
          ) : (
            <div className="text-white text-5xl font-bold">
              {user?.displayName?.charAt(0) || user?.username?.charAt(0) || '?'}
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        
        <div className="text-center text-sm text-purple-400 mb-4">
          Click the image above to upload a new photo
        </div>
        
        <form onSubmit={handleUpload} className="w-full">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Select Image</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500"
            />
            <p className="mt-1 text-sm text-gray-400">
              Max size: 5MB. Recommended: Square image.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isUploading}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Export the component and provide a way to trigger file selection from outside
export { ProfileImageUpload }; 