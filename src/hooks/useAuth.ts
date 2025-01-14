import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userService } from '../services/user';
import { User as AppUser } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      try {
        if (firebaseUser) {
          const profile = await userService.getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
          setError(null);
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Unable to load user profile');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, userProfile, loading, error };
}