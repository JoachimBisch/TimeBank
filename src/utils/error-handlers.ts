import { FirebaseError } from 'firebase/app';

export const getAuthErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée';
    case 'auth/invalid-email':
      return 'Adresse email invalide';
    case 'auth/operation-not-allowed':
      return 'Opération non autorisée';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé';
    case 'auth/user-not-found':
      return 'Aucun compte ne correspond à cette adresse email';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    default:
      return 'Une erreur est survenue. Veuillez réessayer.';
  }
};