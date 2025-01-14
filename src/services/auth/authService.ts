import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  Auth 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { userService } from '../user';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

interface RegisterData {
  firstName: string;
  lastName: string;
}

class AuthService {
  private auth: Auth;

  constructor() {
    this.auth = auth;
  }

  async register(email: string, password: string, data: RegisterData): Promise<UserCredential> {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Create user profile in Firestore
      await userService.createInitialUserProfile(userCredential.user.uid, {
        email,
        firstName: data.firstName,
        lastName: data.lastName
      });
      
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  async login(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // Clear any cached user data
      userService.clearCache();
    } catch (error) {
      console.error('Logout error:', error);
      throw this.handleAuthError(error);
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  private handleAuthError(error: any): Error {
    const errorCode = error?.code;
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
      'auth/invalid-email': 'Adresse email invalide',
      'auth/operation-not-allowed': 'Opération non autorisée',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/user-not-found': 'Aucun compte ne correspond à cette adresse email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard',
      'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre connexion internet'
    };

    const message = errorMessages[errorCode] || 'Une erreur est survenue lors de l\'authentification';
    return new AuthError(message);
  }
}

// Create a singleton instance
export const authService = new AuthService();