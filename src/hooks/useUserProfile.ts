
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  full_name: string;
  username: string;
  avatar_url?: string;
}

export const useUserProfile = () => {
  // Get user profile data
  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  };

  return {
    getUserProfile,
  };
};
