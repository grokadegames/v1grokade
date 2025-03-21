import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileImageUpload({ minimal = false, triggerRef = null, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setIsError(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Allow parent component to trigger file selection
  useEffect(() => {
    if (triggerRef) {
      triggerRef.current = triggerFileSelect;
    }
  }, [triggerRef]);

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setMessage('Invalid file type. Please upload a JPG, PNG, GIF, or WEBP image.');
      setIsError(true);
      return;
    }

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage('File is too large. Maximum size is 5MB.');
      setIsError(true);
      return;
    }

    setFile(selectedFile);
    if (!minimal) {
      handleUpload(selectedFile);
    } else if (minimal && selectedFile) {
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (fileToUpload) => {
    if (!fileToUpload) return;

    setIsUploading(true);
    setMessage('Uploading image...');
    setIsError(false);
    
    // Show toast notification without an ID to avoid reference errors
    toast.loading('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('image', fileToUpload);

      const response = await fetch('/api/users/profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      setMessage('Profile image updated successfully!');
      
      // Dismiss all toasts and show success
      toast.dismiss();
      toast.success('Profile image updated successfully!');
      
      // Refresh user data to get the updated image URL
      await refreshUser();
      
      // Call onUploadSuccess callback if provided
      if (typeof onUploadSuccess === 'function') {
        onUploadSuccess(data.imageUrl);
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage(`Error: ${error.message || 'Failed to upload image'}`);
      setIsError(true);
      
      // Dismiss all toasts and show error
      toast.dismiss();
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Minimal version just provides a hidden file input and triggers
  if (minimal) {
    return (
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/gif, image/webp"
        className="hidden"
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* File Upload Area */}
      <div className="flex flex-col items-center">
        {/* Current Profile Image or Placeholder */}
        <div className="relative mb-4 group">
          <div 
            className="h-28 w-28 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center border-2 border-gray-600 hover:border-purple-500 transition-all cursor-pointer"
            onClick={triggerFileSelect}
          >
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-3">Max: 5MB • Square recommended</p>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/gif, image/webp"
            className="hidden"
          />
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mt-3 text-center text-sm ${isError ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

// Export the component and provide a way to trigger file selection from outside
export { ProfileImageUpload }; 