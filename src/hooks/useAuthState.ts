import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User } from '../types';
import { userService } from '../services/user';

export function useAuthState() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const unsubscribe = auth.onAuthStateChanged(
      async (firebaseUser) => {
        console.log('Auth state changed:', firebaseUser?.email);
        setUser(firebaseUser);
        
        if (firebaseUser) {
          try {
            const profile = await userService.getUserProfile(firebaseUser.uid);
            setUserProfile(profile);
            setError(null);
          } catch (err) {
            console.error('Profile loading error:', err);
            setError('Erreur lors du chargement du profil');
          }
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      },
      (error) => {
        console.error('Auth state error:', error);
        setError('Erreur d\'authentification');
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  return { user, userProfile, loading, error };
}