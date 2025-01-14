export const mockStats = {
  exchangesCount: 0,
  totalHours: 0,
  rating: 5.0
};

export const mockExperiences = [
  {
    id: '1',
    userId: 'user1',
    title: 'Cours de photographie',
    description: 'Apprenez les bases de la photographie numérique',
    duration: 2,
    category: 'Art & Créativité',
    availability: ['Lundi', 'Mercredi'],
    location: 'Paris',
    createdAt: new Date()
  },
  {
    id: '2',
    userId: 'user2',
    title: 'Coaching développement web',
    description: 'Perfectionnez vos compétences en React',
    duration: 1.5,
    category: 'Technologie',
    availability: ['Mardi', 'Jeudi'],
    location: 'En ligne',
    createdAt: new Date()
  }
];

export const mockActivities = [
  {
    id: '1',
    type: 'exchange' as const,
    title: 'Bienvenue sur TimeBank !',
    timestamp: new Date(),
    hours: 3
  }
] as const;