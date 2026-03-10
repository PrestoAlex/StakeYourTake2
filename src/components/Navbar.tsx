import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, Trophy, User, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import WalletConnect from './WalletConnect';

const navItems = [
  // Empty - all nav items moved to right side
];

export default function Navbar({ onCreateOpen }: { onCreateOpen: () => void }) {
  const location = useLocation();
  const { user, isWalletConnected, connectWallet, disconnectWallet } = useApp();

  
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="sticky top-0 z-50 border-b border-border"
      style={{
        background: 'rgba(210, 200, 190, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-1 overflow-hidden" style={{ transform: 'translateX(25px) translateY(2px) scale(1.54375)', height: '64px' }}>
            <Link 
              to="/" 
              className="flex items-center gap-2 no-underline logo-pulse"
              onClick={(e) => {
                // Force page reload when clicking logo
                e.preventDefault();
                window.location.reload();
              }}
            >
              <img 
                src="/logo.png" 
                alt="StakeYourTake Logo" 
                className="w-40 h-40 object-contain cursor-pointer max-h-16 overflow-hidden"
                style={{ maxHeight: '64px' }}
                onError={(e) => {
                  // Fallback to Sparkles if logo doesn't load
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Sparkles className="w-6 h-6 text-gold hidden cursor-pointer" />
            </Link>
          </div>

          {/* Nav links - centered */}
          <div className="hidden sm:flex items-center gap-4 justify-center flex-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-10 py-5 rounded-lg text-sm font-medium transition-all no-underline cursor-pointer ${
                    isActive ? '' : 'text-text-secondary hover:text-text-primary'
                  }`}
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, #C9A84C, #A68A3E)' 
                      : 'transparent',
                    color: isActive ? '#FFFDF8' : undefined,
                    border: isActive ? 'none' : '1px solid transparent',
                    ...(isActive && {
                      boxShadow: '0 0 0 4px rgba(201, 168, 76, 0.2), 0 0 0 8px rgba(201, 168, 76, 0.1)',
                    })
                  }}
                >
                  <item.icon 
                    className="w-5 h-5 transition-all duration-300" 
                    style={{
                      filter: isActive 
                        ? 'drop-shadow(0 0 8px rgba(201, 168, 76, 0.6))' 
                        : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }}
                  />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl"
                      style={{ 
                        background: 'linear-gradient(135deg, #C9A84C, #A68A3E)',
                        zIndex: -1,
                        borderRadius: '0.5rem',
                        boxShadow: '0 8px 32px rgba(201, 168, 76, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex-1 flex items-center" style={{ position: 'relative' }}>
            {/* Feed Button - positioned with transform */}
            <Link
              to="/"
              className="nav-feed flex items-center gap-2 px-4 py-2 text-sm font-semibold cursor-pointer border border-gold/40 no-underline"
              style={{
                background: location.pathname === '/' 
                  ? 'linear-gradient(135deg, #C9A84C, #A68A3E)' 
                  : 'rgba(201, 168, 76, 0.1)',
                color: location.pathname === '/' ? '#FFFDF8' : '#C9A84C',
                borderColor: 'rgba(201, 168, 76, 0.4)',
                borderRadius: '0.25rem',
                transform: 'translateX(-293px) scale(1.15)',
              }}
            >
              <div className="w-5 h-5 flex items-center justify-center transition-all duration-300">
                <TrendingUp 
                  className="w-5 h-5" 
                  style={{
                    filter: location.pathname === '/' 
                      ? 'drop-shadow(0 0 8px rgba(201, 168, 76, 0.8))' 
                      : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    transform: location.pathname === '/' ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              </div>
              <span className="hidden sm:inline">Feed</span>
            </Link>
            
            {/* Other buttons */}
            <div className="flex items-center gap-1.25" style={{ marginLeft: 'auto' }}>
            
            {/* Leaderboard Button - positioned with transform */}
            <Link
              to="/leaderboard"
              className="nav-leaderboard flex items-center gap-2 px-4 py-2 text-sm font-semibold cursor-pointer border border-gold/40 no-underline"
              style={{
                background: location.pathname === '/leaderboard' 
                  ? 'linear-gradient(135deg, #C9A84C, #A68A3E)' 
                  : 'rgba(201, 168, 76, 0.1)',
                color: location.pathname === '/leaderboard' ? '#FFFDF8' : '#C9A84C',
                borderColor: 'rgba(201, 168, 76, 0.4)',
                borderRadius: '0.25rem',
                transform: 'translateX(-275px) scale(1.15)',
              }}
            >
              <div className="w-5 h-5 flex items-center justify-center transition-all duration-300">
                <Trophy 
                  className="w-5 h-5" 
                  style={{
                    filter: location.pathname === '/leaderboard' 
                      ? 'drop-shadow(0 0 8px rgba(201, 168, 76, 0.8))' 
                      : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    transform: location.pathname === '/leaderboard' ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              </div>
              <span className="hidden sm:inline">Leaderboard</span>
            </Link>

            {/* Profile Button */}
            <Link
              to="/profile"
              className="nav-profile flex items-center gap-2 px-4 py-2 text-sm font-semibold cursor-pointer border border-gold/40 no-underline"
              style={{
                background: location.pathname === '/profile' 
                  ? 'linear-gradient(135deg, #C9A84C, #A68A3E)' 
                  : 'rgba(201, 168, 76, 0.1)',
                color: location.pathname === '/profile' ? '#FFFDF8' : '#C9A84C',
                borderColor: 'rgba(201, 168, 76, 0.4)',
                borderRadius: '0.25rem',
                transform: 'translateX(-260px) scale(1.15)',
              }}
            >
              <div className="w-5 h-5 flex items-center justify-center transition-all duration-300">
                <User 
                  className="w-5 h-5" 
                  style={{
                    filter: location.pathname === '/profile' 
                      ? 'drop-shadow(0 0 8px rgba(201, 168, 76, 0.8))' 
                      : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    transform: location.pathname === '/profile' ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              </div>
              <span className="hidden sm:inline">Profile</span>
            </Link>

            {/* Guide Button */}
            <Link
              to="/guide"
              className="nav-guide flex items-center gap-2 px-4 py-2 text-sm font-semibold cursor-pointer border border-gold/40 no-underline"
              style={{
                background: location.pathname === '/guide' 
                  ? 'linear-gradient(135deg, #C9A84C, #A68A3E)' 
                  : 'rgba(201, 168, 76, 0.1)',
                color: location.pathname === '/guide' ? '#FFFDF8' : '#C9A84C',
                borderColor: 'rgba(201, 168, 76, 0.4)',
                borderRadius: '0.25rem',
                transform: 'translateX(-245px) scale(1.15)',
              }}
            >
              <div className="w-5 h-5 flex items-center justify-center transition-all duration-300">
                <BookOpen 
                  className="w-5 h-5" 
                  style={{
                    filter: location.pathname === '/guide' 
                      ? 'drop-shadow(0 0 8px rgba(201, 168, 76, 0.8))' 
                      : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    transform: location.pathname === '/guide' ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              </div>
              <span className="hidden sm:inline">Guide</span>
            </Link>

            {/* New Take Button */}
            <button
              onClick={onCreateOpen}
              className="nav-newtake flex items-center gap-2 px-4 py-2 text-sm font-semibold cursor-pointer border border-gold/40 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #A68A3E)',
                color: '#FFFDF8',
                borderRadius: '0.25rem',
                transform: 'translateX(-230px) scale(1.15)',
              }}
            >
              <div className="w-5 h-5 flex items-center justify-center transition-all duration-300">
                <Plus 
                  className="w-5 h-5" 
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(201, 168, 76, 0.8))',
                    transform: 'scale(1.1)',
                  }}
                />
              </div>
              <span>New Take</span>
            </button>

            {/* Wallet Connect Component */}
            <div style={{ transform: 'translateX(-213px) scale(1.15)' }}>
              <WalletConnect />
            </div>
            </div>

            {/* Mobile nav */}
            <div className="flex sm:hidden items-center gap-3">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`p-8 rounded-md no-underline transition-all ${
                      isActive ? '' : 'text-text-secondary'
                    }`}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, #C9A84C, #A68A3E)' 
                        : 'transparent',
                      color: isActive ? '#FFFDF8' : undefined,
                      ...(isActive && {
                        boxShadow: '0 0 0 3px rgba(201, 168, 76, 0.2), 0 0 0 6px rgba(201, 168, 76, 0.1)',
                      })
                    }}
                  >
                    <item.icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
