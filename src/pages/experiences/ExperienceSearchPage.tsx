import React, { useState, useEffect } from 'react';
import { ExperienceList } from '../../components/experiences/ExperienceList';
import { ExperienceFilters } from '../../components/experiences/ExperienceFilters';
import { experienceService } from '../../services/experiences/experienceService';
import { TimeExperience } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';

export const ExperienceSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [experiences, setExperiences] = useState<TimeExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const allExperiences = await experienceService.getAllExperiences();
      setExperiences(allExperiences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const categories = Array.from(new Set(experiences.map(exp => exp.category)));

  const filteredExperiences = experiences.filter(experience => {
    const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experience.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || experience.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Découvrir les expériences</h1>
        
        <ExperienceFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        <ExperienceList experiences={filteredExperiences} />
      </div>
    </div>
  );
};