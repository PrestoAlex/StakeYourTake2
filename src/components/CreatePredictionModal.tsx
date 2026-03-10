import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, TrendingUp, Calendar, Coins, Tag } from 'lucide-react';
import type { ConfidenceLevel, Prediction, TokenSymbol } from '../types';
import { useApp } from '../context/AppContext';
import { getTokenIcon } from '../utils/tokenIcons';

const categories: { value: Prediction['category']; label: string; color: string }[] = [
  { value: 'bitcoin', label: 'Bitcoin', color: '#C9A84C' },
  { value: 'crypto', label: 'Crypto', color: '#8B6914' },
  { value: 'tech', label: 'Tech', color: '#A8A8A8' },
  { value: 'world', label: 'World', color: '#5B8DEF' },
];

const confidenceLevels: { value: ConfidenceLevel; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#D44638' },
  { value: 'medium', label: 'Medium', color: '#E6A817' },
  { value: 'high', label: 'High', color: '#4CAF50' },
];

const tokenOptions: { value: TokenSymbol; label: string; color: string }[] = [
  { value: 'BTC', label: 'BTC', color: '#C9A84C' },
  { value: 'MOTO', label: 'MOTO', color: '#8A2BE2' },
  { value: 'PILL', label: 'PILL', color: '#FFA500' },
];

export default function CreatePredictionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addPrediction, user } = useApp();
  const [text, setText] = useState('');
  const [stake, setStake] = useState(0.01);
  const [stakeToken, setStakeToken] = useState<TokenSymbol>('BTC');
  const [confidence, setConfidence] = useState<ConfidenceLevel>('medium');
  const [category, setCategory] = useState<Prediction['category']>('bitcoin');
  const [expiryDate, setExpiryDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const currentTokenBalance = user.tokenBalances?.[stakeToken] ?? (stakeToken === 'BTC' ? user.balance : 0);

  const handleSubmit = () => {
    if (!text.trim() || !expiryDate || stake <= 0) return;
    addPrediction(text, stake, stakeToken, confidence, category, expiryDate);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setText('');
      setStake(0.01);
      setStakeToken('BTC');
      setConfidence('medium');
      setCategory('bitcoin');
      setExpiryDate('');
      onClose();
    }, 1500);
  };

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
            className="w-full max-w-lg rounded-xl p-6 relative"
            style={{
              background: '#FFFDF8',
              border: '1px solid rgba(201,168,76,0.3)',
              boxShadow: '0 24px 64px rgba(44,36,24,0.15), 0 0 0 1px rgba(201,168,76,0.15)',
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
                  <p className="text-xl font-bold text-gold-dark">Take Published!</p>
                  <p className="text-sm text-text-secondary mt-1">Your prediction is live</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-bold text-text-primary">New Prediction</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary transition-colors cursor-pointer border-0 bg-transparent">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Text */}
            <div className="mb-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                <TrendingUp className="w-3.5 h-3.5" /> Your Prediction
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Bitcoin will reach $200K by..."
                className="w-full h-24 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/60 resize-none focus:outline-none transition-colors"
                style={{ background: '#F5F0E8', border: '1px solid #DDD5C4' }}
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                <Tag className="w-3.5 h-3.5" /> Category
              </label>
              <div className="flex gap-2">
                {categories.map(cat => (
                  <button key={cat.value} onClick={() => setCategory(cat.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      color: category === cat.value ? cat.color : '#7A6F5F',
                      background: category === cat.value ? `${cat.color}10` : '#F5F0E8',
                      border: `1px solid ${category === cat.value ? `${cat.color}40` : '#DDD5C4'}`,
                    }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence */}
            <div className="mb-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Confidence Level
              </label>
              <div className="flex gap-2">
                {confidenceLevels.map(lvl => (
                  <button key={lvl.value} onClick={() => setConfidence(lvl.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    style={{
                      color: confidence === lvl.value ? lvl.color : '#7A6F5F',
                      background: confidence === lvl.value ? `${lvl.color}10` : '#F5F0E8',
                      border: `1px solid ${confidence === lvl.value ? `${lvl.color}40` : '#DDD5C4'}`,
                    }}>
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                <Coins className="w-3.5 h-3.5" /> Stake Token
              </label>
              <div className="flex gap-2">
                {tokenOptions.map(token => (
                  <button key={token.value} onClick={() => setStakeToken(token.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    style={{
                      color: stakeToken === token.value ? '#FFFDF8' : token.color,
                      background: stakeToken === token.value ? `${token.color}40` : '#F5F0E8',
                      border: `1px solid ${stakeToken === token.value ? `${token.color}60` : '#DDD5C4'}`,
                    }}>
                    <img 
                      src={getTokenIcon(token.value)} 
                      alt={token.value}
                      className="w-4 h-4"
                      onError={(e) => {
                        // Fallback to text if icon fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {token.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stake & Expiry */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  <Coins className="w-3.5 h-3.5" /> Stake ({stakeToken})
                </label>
                <input type="number" step="0.01" min="0.001" max={currentTokenBalance} value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none transition-colors"
                  style={{ background: '#F5F0E8', border: '1px solid #DDD5C4' }} />
                <p className="text-[11px] text-text-muted mt-1">Available: {currentTokenBalance.toFixed(4)} {stakeToken}</p>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5" /> Expiry Date
                </label>
                <input type="text" 
                  value={expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d/]/g, '');
                    
                    // Auto-format as MM/DD/YYYY
                    if (value.length >= 2 && !value.includes('/')) {
                      value = value.slice(0, 2) + '/' + value.slice(2);
                    }
                    if (value.length >= 5 && value.split('/').length === 2) {
                      const parts = value.split('/');
                      if (parts[1].length >= 2) {
                        value = parts[0] + '/' + parts[1].slice(0, 2) + '/' + parts[1].slice(2);
                      }
                    }
                    
                    setExpiryDate(value.slice(0, 10));
                  }}
                  placeholder="MM/DD/YYYY"
                  maxLength={10}
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none transition-colors"
                  style={{ background: '#F5F0E8', border: '1px solid #DDD5C4' }} />
              </div>
            </div>

            {/* Submit */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!text.trim() || !expiryDate || stake <= 0 || stake > currentTokenBalance}
              className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer border-0 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #A68A3E)',
                color: '#FFFDF8',
                boxShadow: '0 4px 16px rgba(201,168,76,0.25)',
              }}>
              Publish Take · Stake {stake.toFixed(4)} {stakeToken}
            </motion.button>

            <p className="text-[11px] text-text-muted text-center mt-3">
              Demo mode — no real tokens will be staked
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
