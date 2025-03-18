import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TalentProfileForm() {
  const { user, hasRole } = useAuth();
  const [profile, setProfile] = useState({
    title: '',
    skills: [],
    hourlyRate: '',
    location: '',
    xaccount: user?.xaccount || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load existing profile if available
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/talent/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile({
            ...data.profile,
            skills: data.profile.skills || [],
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/talent/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save profile');
      }
      
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addSkill = () => {
    if (skillInput && !profile.skills.includes(skillInput)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skillInput],
      });
      setSkillInput('');
    }
  };
  
  const removeSkill = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skill),
    });
  };
  
  if (!hasRole('APPLICANT')) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <p className="text-white">You need to activate your work profile first to access this form.</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-3">My Talent Profile</h2>
      <p className="text-gray-400 mb-6">Complete your profile to appear in the talent directory</p>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Professional Title</label>
          <input
            type="text"
            value={profile.title}
            onChange={(e) => setProfile({...profile, title: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Senior WebGL Developer"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Skills</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="flex-grow px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add a skill"
            />
            <button
              type="button"
              onClick={addSkill}
              className="ml-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.skills.map(skill => (
              <span key={skill} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-md flex items-center">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
            {profile.skills.length === 0 && (
              <p className="text-gray-500 text-sm">Add at least one skill</p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Hourly Rate</label>
          <input
            type="text"
            value={profile.hourlyRate}
            onChange={(e) => setProfile({...profile, hourlyRate: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., $65-85/hr"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({...profile, location: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., San Francisco, CA"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">X Account (Twitter)</label>
          <div className="flex items-center">
            <span className="text-gray-400 pr-2">@</span>
            <input
              type="text"
              value={profile.xaccount?.replace(/^@/, '')}
              onChange={(e) => setProfile({...profile, xaccount: e.target.value})}
              className="flex-grow px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="username"
            />
          </div>
          <p className="text-gray-400 text-sm mt-1">
            This will be used for communication between you and potential employers
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
} 