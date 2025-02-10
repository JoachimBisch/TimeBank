import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Search, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth/authService';

export const Header: React.FC = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Show error in UI if needed
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center group">
            <Clock className="w-8 h-8 text-black group-hover:text-gray-700" />
            <span className="ml-2 text-xl font-bold">TimeBank</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  {userProfile?.firstName} {userProfile?.lastName}
                </Link>
                <Link 
                  to="/availability" 
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  {/* <Calendar className="w-5 h-5" /> */}
                </Link>
                <Link 
                  to="/experiences" 
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <Search className="w-5 h-5" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-900 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-900 transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};