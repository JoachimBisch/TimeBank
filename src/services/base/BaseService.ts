import { auth } from '../../lib/firebase';
import { FirebaseError } from 'firebase/app';

export abstract class BaseService {
  protected async requireAuth(): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }
    return user.uid;
  }

  protected handleError(error: unknown): never {
    console.error('Service error:', error);
    
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'permission-denied':
          throw new Error('You do not have permission to perform this action');
        case 'not-found':
          throw new Error('The requested resource was not found');
        case 'unauthenticated':
          throw new Error('Please sign in to continue');
        case 'unavailable':
          throw new Error('Service temporarily unavailable. Please try again later');
        case 'resource-exhausted':
          throw new Error('Too many requests. Please try again later');
        default:
          throw new Error('An error occurred. Please try again');
      }
    }
    
    throw new Error('An unexpected error occurred');
  }

  protected async withAuth<T>(operation: () => Promise<T>): Promise<T> {
    try {
      await this.requireAuth();
      return await operation();
    } catch (error) {
      throw this.handleError(error);
    }
  }
}