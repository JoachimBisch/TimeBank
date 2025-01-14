import React from 'react';
import { Clock, Share2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez une nouvelle façon de valoriser votre temps et vos compétences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="space-y-6">
            <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-center">Gagnez du temps</h3>
            <p className="text-gray-600 leading-relaxed">
              Transformez votre temps en opportunité. Démarrez avec 3 heures de crédit offertes et proposez vos compétences uniques à la communauté. Chaque heure que vous partagez est une heure gagnée pour découvrir, apprendre ou bénéficier des talents d'autres utilisateurs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-6">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <Share2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-center">Échangez vos talents</h3>
            <p className="text-gray-600 leading-relaxed">
              Valorisez ce que vous savez faire. Réservez des expériences enrichissantes ou échangez vos compétences avec d'autres membres grâce à un système transparent et équitable. Avec TimeBank, chaque échange est une opportunité de créer du lien et d'accéder à de nouvelles passions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-6">
            <div className="bg-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold text-center">Développez votre potentiel</h3>
            <p className="text-gray-600 leading-relaxed">
              Apprenez, partagez, évoluez. Enrichissez vos connaissances, explorez vos passions et bâtissez des relations fortes au sein d'une communauté collaborative. Avec TimeBank, le savoir et l'entraide deviennent vos nouvelles monnaies.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Transformez chaque minute en apprentissage.<br />
              Transformez chaque échange en expérience.
            </h3>
            <Link
              to="/register"
              className="inline-block px-8 py-3 text-lg font-medium text-white bg-black rounded-full hover:bg-gray-900 transition-all duration-200"
            >
              Rejoignez TimeBank
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};