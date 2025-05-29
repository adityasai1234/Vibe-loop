import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthContext, UserProfile } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig'; // Ensure db is exported from firebaseConfig
import toast from 'react-hot-toast';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50, 'Display name too long'),
  bio: z.string().max(160, 'Bio cannot exceed 160 characters').optional(),
  themeColor: z.enum(['slate', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']).optional(),
  // username is read-only, so not in schema for editing
});

type ProfileFormData = z.infer<typeof profileSchema>;

const themeColorOptions = [
  { value: 'slate', label: 'Slate Gray', color: '#64748b' },
  { value: 'red', label: 'Crimson Red', color: '#ef4444' },
  { value: 'orange', label: 'Sunset Orange', color: '#f97316' },
  { value: 'yellow', label: 'Golden Yellow', color: '#eab308' },
  { value: 'green', label: 'Forest Green', color: '#22c55e' },
  { value: 'blue', label: 'Ocean Blue', color: '#3b82f6' },
  { value: 'purple', label: 'Royal Purple', color: '#8b5cf6' },
  { value: 'pink', label: 'Hot Pink', color: '#ec4899' },
];

const ProfilePage: React.FC = () => {
  const { currentUser, userProfile, setUserProfileData, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(userProfile?.photoURL || null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      themeColor: 'slate',
    },
  });

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, authLoading, navigate]);

  useEffect(() => {
    if (userProfile) {
      reset({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        themeColor: (userProfile.themeColor as ProfileFormData['themeColor']) || 'slate',
      });
      setAvatarPreview(userProfile.photoURL || null);
    }
  }, [userProfile, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation (can be enhanced)
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File is too large. Max 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please select an image.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !currentUser) return null;

    setIsUploading(true);
    setUploadProgress(0);
    const storage = getStorage();
    // Standardize to jpg, or handle multiple extensions in storage rules and here
    const storageRef = ref(storage, `avatars/${currentUser.uid}.jpg`); 
    const uploadTask = uploadBytesResumable(storageRef, avatarFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          toast.error('Avatar upload failed. Please try again.');
          setIsUploading(false);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            toast.success('Avatar uploaded successfully!');
            setIsUploading(false);
            resolve(downloadURL);
          } catch (error) {
            console.error('Failed to get download URL:', error);
            toast.error('Failed to finalize avatar upload.');
            setIsUploading(false);
            reject(error);
          }
        }
      );
    });
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!currentUser) return;

    let newPhotoURL = userProfile?.photoURL || null;
    if (avatarFile) {
      const uploadedUrl = await uploadAvatar();
      if (uploadedUrl) {
        newPhotoURL = uploadedUrl;
      }
    }

    const updatedProfile: Partial<UserProfile> = {
      displayName: data.displayName,
      bio: data.bio,
      themeColor: data.themeColor,
      photoURL: newPhotoURL,
    };

    try {
      await setUserProfileData(updatedProfile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };
  
  if (authLoading || !currentUser || !userProfile) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 pt-10">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-purple-400">Edit Profile</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={avatarPreview || `https://ui-avatars.com/api/?name=${userProfile.displayName || userProfile.email}&background=random&size=128`}
              alt="Avatar preview" 
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
            />
            <input 
              type="file" 
              id="avatarUpload" 
              accept="image/*" 
              onChange={handleAvatarChange} 
              className="hidden" 
            />
            <label 
              htmlFor="avatarUpload" 
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Change Avatar
            </label>
            {isUploading && (
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-purple-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Username (Read-only) */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
            <input
              id="username"
              type="text"
              value={userProfile.username || 'Not set'}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">Display Name</label>
            <input
              id="displayName"
              type="text"
              {...register('displayName')}
              className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${errors.displayName ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
            />
            {errors.displayName && <p className="mt-2 text-sm text-red-400">{errors.displayName.message}</p>}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio</label>
            <textarea
              id="bio"
              {...register('bio')}
              rows={3}
              className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${errors.bio ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              placeholder="Tell us a little about yourself..."
            />
            {errors.bio && <p className="mt-2 text-sm text-red-400">{errors.bio.message}</p>}
          </div>

          {/* Theme Color */}
          <div>
            <label htmlFor="themeColor" className="block text-sm font-medium text-gray-300">Theme Color</label>
            <select
              id="themeColor"
              {...register('themeColor')}
              className={`mt-1 block w-full pl-3 pr-10 py-2 bg-gray-700 border ${errors.themeColor ? 'border-red-500' : 'border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
            >
              {themeColorOptions.map(option => (
                <option key={option.value} value={option.value} style={{ backgroundColor: option.color, color: '#fff' }}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.themeColor && <p className="mt-2 text-sm text-red-400">{errors.themeColor.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUploading || authLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isUploading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
