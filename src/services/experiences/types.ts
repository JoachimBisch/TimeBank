import { TimeExperience } from '../../types';

export interface CreateExperienceInput {
  title: string;
  description: string;
  duration: number;
  category: string;
  minParticipants: number;
  maxParticipants: number;
  location: string;
  imageUrl: string;
}

export interface CreateExperienceData extends CreateExperienceInput {
  userId: string;
  status: 'active' | 'deleted';
  createdAt: Date;
}

export type ExperienceWithAvailability = TimeExperience & {
  availability: Array<{
    date: Date;
    startTime: string;
    endTime: string;
  }>;
};