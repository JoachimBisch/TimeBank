import { FirebaseError } from 'firebase/app';

export class AuthError extends Error {
  constructor(error: FirebaseError) {
    const message = getAuthErrorMessage(error.code);
    super(message);
    this.name = 'AuthError';
  }
}

function getAuthErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Cette adresse email est déjà utilisée',
    'auth/invalid-email': 'Adresse email invalide',
    'auth/operation-not-allowed': 'Opération non autorisée',
    'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
    'auth/user-disabled': 'Ce compte a été désactivé',
    'auth/user-not-found': 'Aucun compte ne correspond à cette adresse email',
    'auth/wrong-password': 'Mot de passe incorrect',
    'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard',
    'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre connexion internet',
    'auth/invalid-api-key': 'Erreur de configuration. Veuillez réessayer.',
    'auth/app-deleted': 'L\'application a été supprimée',
    'auth/invalid-credential': 'Les informations d\'identification sont invalides',
    'auth/invalid-verification-code': 'Le code de vérification est invalide',
    'auth/invalid-verification-id': 'L\'ID de vérification est invalide',
    'auth/missing-verification-code': 'Le code de vérification est manquant',
    'auth/missing-verification-id': 'L\'ID de vérification est manquant',
    'auth/api-key-not-valid': 'La clé API Firebase n\'est pas valide',
    'default': 'Une erreur est survenue. Veuillez réessayer.'
  };

  return errorMessages[code] || errorMessages.default;
}