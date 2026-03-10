import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, TrendingUp, Clock, Coins, Gift } from 'lucide-react';
import type { Prediction, TokenSymbol } from '../types';
import { useApp } from '../context/AppContext';
import { getTokenIcon } from '../utils/tokenIcons';
import FollowButton from './FollowButton';
import CommentsSection from './CommentsSection';

const confidenceConfig = {
  high: { label: 'High', color: '#4CAF50', bg: 'rgba(76,175,80,0.08)', border: 'rgba(76,175,80,0.25)' },
  medium: { label: 'Medium', color: '#E6A817', bg: 'rgba(230,168,23,0.08)', border: 'rgba(230,168,23,0.25)' },
  low: { label: 'Low', color: '#D44638', bg: 'rgba(212,70,56,0.08)', border: 'rgba(212,70,56,0.25)' },
};

const categoryConfig: Record<string, { color: string; border: 'gold' | 'silver' }> = {
  bitcoin: { color: '#C9A84C', border: 'gold' },
  crypto: { color: '#8B6914', border: 'gold' },
  tech: { color: '#A8A8A8', border: 'silver' },
  world: { color: '#5B8DEF', border: 'silver' },
};

const tokenConfig: Record<TokenSymbol, { color: string; bgColor: string; activeBgColor: string }> = {
  BTC: { color: '#C9A84C', bgColor: 'rgba(201,168,76,0.08)', activeBgColor: 'rgba(201,168,76,0.25)' },
  MOTO: { color: '#8A2BE2', bgColor: 'rgba(138,43,226,0.08)', activeBgColor: 'rgba(138,43,226,0.25)' },
  PILL: { color: '#FFA500', bgColor: 'rgba(255,165,0,0.08)', activeBgColor: 'rgba(255,165,0,0.25)' },
};

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PredictionCard({ prediction, index }: { prediction: Prediction; index: number }) {
  const { likePrediction, stakePrediction, tipPrediction, addComment, updateReputation, user } = useApp();
  const [liked, setLiked] = useState(false);
  const [showStakePopup, setShowStakePopup] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(0.01);
  const [tipAmount, setTipAmount] = useState(0.005);
  const [stakeToken, setStakeToken] = useState<TokenSymbol>(prediction.stakeToken);
  const [tipToken, setTipToken] = useState<TokenSymbol>('BTC');
  const conf = confidenceConfig[prediction.confidence];
  const cat = categoryConfig[prediction.category];
  const borderColor = cat.border === 'gold' ? 'rgba(201,168,76,0.35)' : 'rgba(168,168,168,0.35)';
  const glowColor = cat.border === 'gold' ? 'rgba(201,168,76,0.08)' : 'rgba(168,168,168,0.08)';
  const tokenChoices: TokenSymbol[] = ['BTC', 'MOTO', 'PILL'];

  const handleLike = async () => {
    if (!liked) { 
      await likePrediction(prediction.id); 
      setLiked(true);
      // TODO: Fix reputation contract first
      // await updateReputation(prediction.author.wallet, 'positive');
    }
  };
  const handleStake = () => {
    setShowStakeModal(true);
  };
  const handleStakeSubmit = async () => {
    await stakePrediction(prediction.id, stakeAmount, stakeToken);
    setShowStakeModal(false);
    setShowStakePopup(true);
    setTimeout(() => setShowStakePopup(false), 1500);
    // TODO: Fix reputation contract first
    // await updateReputation(prediction.author.wallet, 'positive');
  };
  const handleTip = () => { 
    setShowTipModal(true);
  };
  const handleComments = () => {
    setShowCommentsModal(!showCommentsModal);
  };
  const handleTipSubmit = async () => {
    await tipPrediction(prediction.id, tipAmount, tipToken);
    setShowTipModal(false);
    // TODO: Fix reputation contract first
    // await updateReputation(prediction.author.wallet, 'positive');
  };
  const handleAddComment = async (commentText: string) => {
    await addComment(prediction.id, commentText);
    // Оновлюємо репутація автора за коментар
    await updateReputation(prediction.author.wallet, 'positive');
  };

  /* Slight rotation for floating effect */
  const rotation = index % 3 === 0 ? -0.8 : index % 3 === 1 ? 0.6 : -0.4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, type: 'spring', stiffness: 90 }}
      whileHover={{ y: -6, scale: 1.015, boxShadow: `0 16px 48px ${glowColor}, 0 0 0 1px ${borderColor}` }}
      className="relative rounded-xl p-8 cursor-pointer transition-all duration-300 w-full"
      style={{
        background: 'linear-gradient(135deg, rgba(235, 225, 210, 0.98), rgba(245, 240, 230, 0.95))',
        border: `1px solid ${borderColor}`,
        boxShadow: `0 8px 32px rgba(44,36,24,0.12), 0 0 0 1px ${borderColor}, inset 0 1px 0 rgba(255,255,255,0.2)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer effect overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
      `}</style>
      {/* Stake popup */}
      {showStakePopup && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-2 right-2 font-bold text-lg z-10"
          style={{ color: tokenConfig[stakeToken].color }}
        >
          +0.01 {stakeToken}
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl overflow-hidden"
            style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}25` }}>
            {prediction.author.avatar.startsWith('/') || prediction.author.avatar.startsWith('http') ? (
              <img 
                src={prediction.author.avatar} 
                alt="Author avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              prediction.author.avatar
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">{prediction.author.name}</div>
            <div className="text-xs text-text-muted font-mono">{prediction.author.wallet}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {prediction.author.wallet !== user.wallet && (
            <FollowButton userId={prediction.author.wallet} userName={prediction.author.name} />
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg"
            style={{ color: cat.color, background: `${cat.color}10`, border: `1px solid ${cat.color}25` }}>
            {prediction.category}
          </span>
          <span className="text-xs text-text-muted">{timeAgo(prediction.createdAt)}</span>
        </div>
      </div>

      {/* Text */}
      <p className="text-base font-medium text-text-primary leading-relaxed mb-6">{prediction.text}</p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(44,36,24,0.03)', border: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
          style={{ color: conf.color, background: conf.bg, border: `1px solid ${conf.border}` }}>
          <TrendingUp className="w-3 h-3" />
          {conf.label} Confidence
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
          style={{ color: tokenConfig[prediction.stakeToken].color, background: tokenConfig[prediction.stakeToken].bgColor, border: `1px solid ${tokenConfig[prediction.stakeToken].color}40` }}>
          <Coins className="w-3 h-3" />
          {prediction.stakeAmount.toFixed(4)} {prediction.stakeToken}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted px-2.5 py-1 rounded-lg"
          style={{ background: 'rgba(166,157,142,0.08)' }}>
          <Clock className="w-3 h-3" />
          Expires {new Date(prediction.expiryDate).toLocaleDateString('en-US')}
        </div>
      </div>

      {/* Gold divider line */}
      <div className="h-px mx-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }}></div>

      <div className="flex flex-wrap items-center gap-3 mt-3 mb-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(44,36,24,0.03)', border: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[12px] uppercase tracking-wider text-text-muted font-semibold">Stake token</span>
          <div className="flex gap-1.5">
            {tokenChoices.map(token => (
              <button
                key={`stake-${token}`}
                onClick={() => setStakeToken(token)}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold cursor-pointer border-0 flex items-center gap-1.5"
                style={{
                  color: stakeToken === token ? '#FFFDF8' : tokenConfig[token].color,
                  background: stakeToken === token ? tokenConfig[token].activeBgColor : tokenConfig[token].bgColor,
                }}
              >
                <img 
                  src={getTokenIcon(token)} 
                  alt={token}
                  className="w-5 h-5"
                  onError={(e) => {
                    // Fallback to text if icon fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {token}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] uppercase tracking-wider text-text-muted font-semibold">Gift token</span>
          <div className="flex gap-1.5">
            {tokenChoices.map(token => (
              <button
                key={`tip-${token}`}
                onClick={() => setTipToken(token)}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold cursor-pointer border-0 flex items-center gap-1.5"
                style={{
                  color: tipToken === token ? '#FFFDF8' : tokenConfig[token].color,
                  background: tipToken === token ? tokenConfig[token].activeBgColor : tokenConfig[token].bgColor,
                }}
              >
                <img 
                  src={getTokenIcon(token)} 
                  alt={token}
                  className="w-5 h-5"
                  onError={(e) => {
                    // Fallback to text if icon fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {token}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gold divider line */}
      <div className="h-px mx-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }}></div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-6 pb-4 mt-3 border-t border-border rounded-b-xl" style={{ background: 'rgba(44,36,24,0.06)' }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleLike}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border-0 bg-transparent ${liked ? '' : 'text-text-secondary hover:text-confidence-low'}`}
          style={liked ? { color: '#D44638', background: 'rgba(212,70,56,0.08)' } : {}}>
          <Heart className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} />
          {prediction.likes}
        </motion.button>

        <motion.button whileTap={{ scale: 0.9 }} onClick={handleStake}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-medium text-text-secondary hover:text-gold-dark transition-colors cursor-pointer border-0 bg-transparent">
          <Coins className="w-3.5 h-3.5" />
          Stake {stakeToken} · {prediction.stakes}
        </motion.button>

        <motion.button whileTap={{ scale: 0.9 }} onClick={handleTip}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-medium text-text-secondary hover:text-confidence-high transition-colors cursor-pointer border-0 bg-transparent">
          <Gift className="w-3.5 h-3.5" />
          Gift {tipToken} · {prediction.tips}
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={handleComments}
          className="flex items-center gap-1.5 px-5 py-2.5 text-xs text-text-muted ml-auto cursor-pointer border-0 bg-transparent hover:text-text-primary transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {prediction.comments}
        </motion.button>
      </div>

      {/* Stake Modal */}
      {showStakeModal && (
        <div 
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          style={{
            background: stakeToken === 'BTC' 
              ? 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05), rgba(255,255,255,0.9))'
              : stakeToken === 'MOTO'
              ? 'linear-gradient(135deg, rgba(138,43,226,0.15), rgba(138,43,226,0.05), rgba(255,255,255,0.9))'
              : 'linear-gradient(135deg, rgba(255,165,0,0.15), rgba(255,165,0,0.05), rgba(255,255,255,0.9))'
          }}
        >
          <div 
            className="bg-white/80 backdrop-blur-xl border-2 rounded-2xl p-6 w-96 max-w-[90vw] shadow-2xl"
            style={{
              borderColor: tokenConfig[stakeToken].color,
              boxShadow: `0 25px 50px -12px ${tokenConfig[stakeToken].color}40`
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: tokenConfig[stakeToken].color }}>
              Stake {stakeToken}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ({stakeToken})
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                max={user.tokenBalances?.[stakeToken] ?? (stakeToken === 'BTC' ? user.balance : 0)}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 bg-white/70 backdrop-blur-sm transition-all"
                style={{ 
                  border: `3px solid ${tokenConfig[stakeToken].color}`,
                  '--tw-ring-color': tokenConfig[stakeToken].color,
                  boxShadow: `0 0 0 2px ${tokenConfig[stakeToken].color}30`
                } as React.CSSProperties}
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: {(user.tokenBalances?.[stakeToken] ?? (stakeToken === 'BTC' ? user.balance : 0)).toFixed(4)} {stakeToken}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleStakeSubmit}
                className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg transform transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${tokenConfig[stakeToken].color}, ${tokenConfig[stakeToken].color}dd)` }}
              >
                Stake {stakeAmount.toFixed(4)} {stakeToken}
              </button>
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-md transform transition-all hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tip Modal */}
      {showTipModal && (
        <div 
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          style={{
            background: tipToken === 'BTC' 
              ? 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05), rgba(255,255,255,0.9))'
              : tipToken === 'MOTO'
              ? 'linear-gradient(135deg, rgba(138,43,226,0.15), rgba(138,43,226,0.05), rgba(255,255,255,0.9))'
              : 'linear-gradient(135deg, rgba(255,165,0,0.15), rgba(255,165,0,0.05), rgba(255,255,255,0.9))'
          }}
        >
          <div 
            className="bg-white/80 backdrop-blur-xl border-2 rounded-2xl p-6 w-96 max-w-[90vw] shadow-2xl"
            style={{
              borderColor: tokenConfig[tipToken].color,
              boxShadow: `0 25px 50px -12px ${tokenConfig[tipToken].color}40`
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: tokenConfig[tipToken].color }}>
              Gift {tipToken}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ({tipToken})
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                max={user.tokenBalances?.[tipToken] ?? (tipToken === 'BTC' ? user.balance : 0)}
                value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 bg-white/70 backdrop-blur-sm transition-all"
                style={{ 
                  border: `3px solid ${tokenConfig[tipToken].color}`,
                  '--tw-ring-color': tokenConfig[tipToken].color,
                  boxShadow: `0 0 0 2px ${tokenConfig[tipToken].color}30`
                } as React.CSSProperties}
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: {(user.tokenBalances?.[tipToken] ?? (tipToken === 'BTC' ? user.balance : 0)).toFixed(4)} {tipToken}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleTipSubmit}
                className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg transform transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${tokenConfig[tipToken].color}, ${tokenConfig[tipToken].color}dd)` }}
              >
                Gift {tipAmount.toFixed(4)} {tipToken}
              </button>
              <button
                onClick={() => setShowTipModal(false)}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-md transform transition-all hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <CommentsSection
        predictionId={prediction.id}
        predictionText={prediction.text}
        isOpen={showCommentsModal}
        onToggle={handleComments}
      />

    </motion.div>
  );
}
