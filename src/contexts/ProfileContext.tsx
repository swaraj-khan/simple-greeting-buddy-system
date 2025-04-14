
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserProfile } from '@/utils/authUtils';

interface UserProfile {
  full_name: string;
  username: string;
  avatar_url?: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoadingProfile: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { user } = useAuth();

  const fetchUserProfile = async (userId: string) => {
    setIsLoadingProfile(true);
    const profileData = await getUserProfile(userId);
    setProfile(profileData as UserProfile | null);
    setIsLoadingProfile(false);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    } else {
      setProfile(null);
      setIsLoadingProfile(false);
    }
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, isLoadingProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
