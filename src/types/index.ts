export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  timeBalance: number;
  rating: number;
  ratingCount: number;
  exchangedHours: number;
  exchangesCount?: number;
  skills: string[];
  avatar?: string;
  createdAt: string;
}

// Rest of the types...