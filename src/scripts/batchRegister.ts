import { authService } from '../services/auth';
import { escpUsers } from '../data/escpUsers';

// Fonction utilitaire pour attendre entre chaque inscription
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function batchRegister() {
  console.log('Début de l\'inscription des utilisateurs ESCP...');
  let successCount = 0;
  let errorCount = 0;

  for (const user of escpUsers) {
    try {
      await authService.register(user.email, 'MSIE!');
      console.log(`✅ Succès: ${user.email}`);
      successCount++;
      
      // Attendre 1 seconde entre chaque inscription pour éviter de surcharger Firebase
      await delay(1000);
    } catch (error) {
      console.error(`❌ Erreur pour ${user.email}:`, error);
      errorCount++;
    }
  }

  console.log('\nRésumé de l\'inscription:');
  console.log(`✅ ${successCount} utilisateurs inscrits avec succès`);
  console.log(`❌ ${errorCount} erreurs`);
  console.log('Inscription terminée');
}

// Exporter la fonction pour pouvoir l'utiliser depuis la console
(window as any).batchRegister = batchRegister;