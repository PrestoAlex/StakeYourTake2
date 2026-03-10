import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, User, Mail, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCustomIcons } from '../utils/iconLoader';

export default function EditProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, updateUser } = useApp();
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio || '');
  const [submitted, setSubmitted] = useState(false);
  const [customIcons, setCustomIcons] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCustomIcons(getCustomIcons());
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    updateUser({
      ...user,
      name: name.trim(),
      avatar,
      bio: bio.trim()
    });
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const avatarOptions = ['🚀', '💎', '🌊', '🔥', '⚡', '🎯', '🌟', '💰', '🎪', '🎭'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(44,36,24,0.4)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="w-full max-w-lg rounded-xl p-8 relative"
            style={{
              background: '#FFFDF8',
              border: '1px solid rgba(201,168,76,0.3)',
              boxShadow: '0 24px 64px rgba(44,36,24,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success overlay */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
                  style={{ background: '#FFFDF8' }}
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }} className="text-6xl mb-4">
                    ✨
                  </motion.div>
                  <p className="text-xl font-bold text-gold-dark">Profile Updated!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-bold text-text-primary">Edit Profile</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors cursor-pointer border-0 bg-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar Selection */}
            <div className="mb-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" /> Avatar
              </label>
              
              {/* Custom Icons */}
              {customIcons.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-text-muted mb-2">Custom Icons ({customIcons.length})</p>
                  <div className="grid grid-cols-8 gap-3 max-h-64 overflow-y-auto">
                    {customIcons.map(iconUrl => (
                      <button
                        key={iconUrl}
                        onClick={() => setAvatar(iconUrl)}
                        className="w-14 h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer border-0 overflow-hidden"
                        style={{
                          background: avatar === iconUrl ? 'rgba(201,168,76,0.2)' : '#F5F0E8',
                          border: avatar === iconUrl ? '2px solid #C9A84C' : '1px solid #DDD5C4',
                          transform: avatar === iconUrl ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        <img 
                          src={iconUrl} 
                          alt="Custom avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Hide broken images
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Emojis */}
              <div>
                <p className="text-xs text-text-muted mb-2">Standard Avatars</p>
                <div className="grid grid-cols-6 gap-3">
                  {avatarOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setAvatar(option)}
                      className="w-14 h-14 rounded-xl text-2xl flex items-center justify-center transition-all cursor-pointer border-0"
                      style={{
                        background: avatar === option ? 'rgba(201,168,76,0.2)' : '#F5F0E8',
                        border: avatar === option ? '2px solid #C9A84C' : '1px solid #DDD5C4',
                        transform: avatar === option ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5" /> Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className="w-full rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none transition-colors"
                style={{ background: '#F5F0E8', border: '1px solid #DDD5C4' }}
              />
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5" /> Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full h-20 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/60 resize-none focus:outline-none transition-colors"
                style={{ background: '#F5F0E8', border: '1px solid #DDD5C4' }}
              />
            </div>

            {/* Submit */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer border-0 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #A68A3E)',
                color: '#FFFDF8',
                boxShadow: '0 4px 16px rgba(201,168,76,0.25)',
              }}
            >
              Save Changes
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
