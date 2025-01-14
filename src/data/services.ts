import { TimeExperience } from '../types';

export const services: TimeExperience[] = [
  {
    id: '1',
    userId: 'system',
    title: 'Leçon : les bases du DJing et de RecordBox',
    description: 'Apprenez les fondamentaux du DJing et la maîtrise du logiciel RecordBox',
    duration: 2,
    minParticipants: 1,
    maxParticipants: 6,
    category: 'Musique',
    availability: ['weekend'],
    location: 'Paris',
    createdAt: new Date(),
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4bb35f0a8b7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    userId: 'system',
    title: 'Réaliser un Risotto onctueux de A-Z',
    description: 'Découvrez les secrets d\'un risotto parfait et onctueux',
    duration: 3,
    minParticipants: 1,
    maxParticipants: 3,
    category: 'Cuisine',
    availability: ['soir'],
    location: 'Paris',
    createdAt: new Date(),
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    userId: 'system',
    title: 'Organiser un voyage et trouver sa propre épopée',
    description: 'Apprenez à planifier votre voyage de manière efficace et personnalisée',
    duration: 1,
    minParticipants: 1,
    maxParticipants: 8,
    category: 'Voyage',
    availability: ['flexible'],
    location: 'En ligne',
    createdAt: new Date(),
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    userId: 'system',
    title: 'Maîtriser Canva comme un pro',
    description: 'Créez des designs professionnels facilement avec Canva',
    duration: 2,
    minParticipants: 1,
    maxParticipants: 33,
    category: 'Design',
    availability: ['flexible'],
    location: 'En ligne',
    createdAt: new Date(),
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    userId: 'system',
    title: 'Notion : les bases pour comprendre l\'écosystème',
    description: 'Découvrez comment utiliser Notion pour organiser votre vie et votre travail',
    duration: 2,
    minParticipants: 1,
    maxParticipants: 33,
    category: 'Productivité',
    availability: ['flexible'],
    location: 'En ligne',
    createdAt: new Date(),
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6',
    userId: 'system',
    title: 'Courir 10Km en toute simplicité',
    description: 'Programme d\'entraînement progressif pour réussir votre premier 10km',
    duration: 2,
    minParticipants: 1,
    maxParticipants: 33,
    category: 'Sport',
    availability: ['matin'],
    location: 'Paris',
    createdAt: new Date(),
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop'
  }
];