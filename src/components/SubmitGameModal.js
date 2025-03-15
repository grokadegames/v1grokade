'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function SubmitGameModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    creatorName: '',
    handle: '',
    email: '',
    description: '',
    thumbnail: null,
    galleryImages: [],
    tags: [],
    officialPageUrl: ''
  });
  
  const [characterCount, setCharacterCount] = useState(0);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'description') {
      setCharacterCount(value.length);
    }
  };
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'thumbnail') {
      setFormData(prev => ({ ...prev, thumbnail: files[0] }));
    } else if (name === 'galleryImages') {
      setFormData(prev => ({ ...prev, galleryImages: Array.from(files) }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // This will be implemented later as per requirements
    console.log('Form submitted:', formData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="relative p-6">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-white hover:text-gray-300"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <h2 className="text-2xl font-bold text-white mb-2">Submit New Game</h2>
          <p className="text-gray-400 mb-6">Fill in the details below to submit your game. It will be reviewed before being published.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-white mb-2">
                  Game Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Enter game title"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onChange={handleChange}
                  value={formData.title}
                />
              </div>
              
              <div>
                <label htmlFor="creatorName" className="block text-white mb-2">
                  Creator Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="creatorName"
                  name="creatorName"
                  type="text"
                  required
                  placeholder="Your name or studio name"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onChange={handleChange}
                  value={formData.creatorName}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="handle" className="block text-white mb-2">
                  X Handle <span className="text-red-500">*</span>
                </label>
                <input
                  id="handle"
                  name="handle"
                  type="text"
                  required
                  placeholder="@yourgame"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onChange={handleChange}
                  value={formData.handle}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="youremail@example.com"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-white mb-2">
                Game Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                placeholder="Describe your game..."
                rows="5"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                onChange={handleChange}
                value={formData.description}
                maxLength="1000"
              ></textarea>
              <div className="text-gray-400 text-sm mt-1">
                {characterCount}/1000 characters
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="thumbnail" className="block text-white mb-2">
                Thumbnail Image <span className="text-red-500">*</span>
              </label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                required
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="thumbnail"
                className="cursor-pointer block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition"
              >
                {formData.thumbnail ? formData.thumbnail.name : 'Choose File'}
              </label>
              <p className="text-gray-400 text-sm mt-1">
                Recommended size: 600x400 pixels (Max 5MB)
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="galleryImages" className="block text-white mb-2">
                Gallery Images (up to 4)
              </label>
              <input
                id="galleryImages"
                name="galleryImages"
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              <label
                htmlFor="galleryImages"
                className="cursor-pointer block w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg hover:bg-gray-600 transition"
              >
                {formData.galleryImages.length > 0 
                  ? `${formData.galleryImages.length} file(s) selected` 
                  : 'Choose Files'}
              </label>
              <p className="text-gray-400 text-sm mt-1">
                Only PNG or JPG formats accepted. Max 5MB each, limit of 4 images.
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="gameTags" className="block text-white mb-2">
                Game Tags
              </label>
              <select
                id="gameTags"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select game type...</option>
                <option value="action">Action</option>
                <option value="adventure">Adventure</option>
                <option value="puzzle">Puzzle</option>
                <option value="strategy">Strategy</option>
                <option value="simulation">Simulation</option>
                <option value="sports">Sports</option>
                <option value="rpg">RPG</option>
                <option value="shooter">Shooter</option>
              </select>
            </div>
            
            <div className="mb-8">
              <label htmlFor="officialPageUrl" className="block text-white mb-2">
                Official Game Page (optional)
              </label>
              <input
                id="officialPageUrl"
                name="officialPageUrl"
                type="url"
                placeholder="https://yourgame.com"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={handleChange}
                value={formData.officialPageUrl}
              />
              <p className="text-gray-400 text-sm mt-1">
                This is where users will play your game
              </p>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                Submit Game
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 