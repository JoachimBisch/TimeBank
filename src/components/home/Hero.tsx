import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Features } from './Features';
import { CelebrityTimebankers } from './CelebrityTimebankers';

export const Hero: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] -top-48 -left-48 bg-gray-200/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute w-[500px] h-[500px] -bottom-48 -right-48 bg-gray-300/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute w-[500px] h-[500px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Floating badge */}
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 floating">
              <Sparkles className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Redéfinissez la valeur de votre temps
              </span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight">
              <span className="block mb-2">Le Temps est</span>
              <span className="block bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Votre Nouvelle Monnaie test
              </span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Échangez vos compétences et services dans une économie collaborative basée sur le temps.
              Découvrez un nouveau mode d'échange où chaque minute compte.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-gray-700 to-gray-900 rounded-full hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {user ? "Accéder au tableau de bord" : "Commencer maintenant"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/experiences"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-gray-900 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Découvrir les expériences
              </Link>
            </div>
          </div>

          {/* Statistics with glass effect */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { value: '10K+', label: 'Utilisateurs actifs' },
              { value: '50K+', label: 'Heures échangées' },
              { value: '1000+', label: 'Compétences partagées' }
            ].map(({ value, label }) => (
              <div key={label} className="glass-card p-8 hover:scale-105 transition-transform duration-300">
                <p className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  {value}
                </p>
                <p className="mt-2 text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CelebrityTimebankers />
      <Features />
    </>
  );
};