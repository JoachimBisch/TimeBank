import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userService } from './user';

interface RegisterData {
  firstName: string;
  lastName: string;
}

class AuthService {
  async register(email: string, password: string, data: RegisterData): Promise<UserCredential> {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await userService.createInitialUserProfile(userCredential.user.uid, {
        email,
        firstName: data.firstName,
        lastName: data.lastName
      });
      
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Rest of the service...
}

export const authService = new AuthService();