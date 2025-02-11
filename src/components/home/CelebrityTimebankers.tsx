import React from 'react';
import { Star } from 'lucide-react';

const celebrities = [
  {
    name: 'Vous serez les suivants !',
    role: '',
    image: 'https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824147_1280.png',
    quote: 'Le savoir est la plus grande forme de pouvoir.'
  },
  {
    name: 'Une communauté',
    role: '',
    image: 'https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824147_1280.png',
    quote: 'L’innovation naît lorsque les esprits se connectent.'
  },
  {
    name: 'La force d\'un groupe',
    role: '',
    image: 'https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824147_1280.png',
    quote: 'Les livres ne sont que le début de l’apprentissage.'
  },
  {
    name: 'Ensemble',
    role: '',
    image: 'https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824147_1280.png',
    quote: 'La cuisine, c’est de la passion, pas seulement des recettes.'
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