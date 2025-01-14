import React from 'react';
import { Star } from 'lucide-react';

const celebrities = [
  {
    name: 'Michelle Obama',
    role: 'Leadership Coach',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=400&fit=crop',
    quote: 'Sharing knowledge is the greatest form of empowerment'
  },
  {
    name: 'Elon Musk',
    role: 'Tech Mentor',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop',
    quote: 'Innovation happens when minds connect'
  },
  {
    name: 'Emma Watson',
    role: 'Literature Expert',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop',
    quote: 'Books are just the beginning of learning'
  },
  {
    name: 'Gordon Ramsay',
    role: 'Culinary Master',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop',
    quote: 'Cooking is about passion, not just recipes'
  }
];

export const CelebrityTimebankers: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Community of Exceptional Timebankers
          </h2>
          <p className="text-xl text-gray-600">
            Learn from and exchange with remarkable individuals who share their expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {celebrities.map((celebrity) => (
            <div 
              key={celebrity.name}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square">
                <img
                  src={celebrity.image}
                  alt={celebrity.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{celebrity.name}</h3>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">{celebrity.role}</p>
                <p className="text-gray-600 italic">"{celebrity.quote}"</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            * Celebrity profiles are for illustration purposes only
          </p>
        </div>
      </div>
    </section>
  );
};