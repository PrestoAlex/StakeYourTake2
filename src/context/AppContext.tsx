import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Prediction, User, Category, SortBy, ConfidenceLevel, TokenSymbol } from '../types';
import { mockPredictions, demoUser } from '../data/mockData';
import { useOPNetWallet } from '../hooks/useOPNetWallet';
import { predictionService } from '../services/predictionService';
import { stakeService } from '../services/stakeService';
import { tipService } from '../services/tipService';
import { likeService } from '../services/likeService';
import { commentService } from '../services/commentService';
import { reputationService } from '../services/reputationService';
import { tokenService } from '../services/tokenService';
import { PredictionStorage } from '../services/predictionStorage';
import { CONTRACT_ADDRESSES } from '../config/contracts';

interface AppContextType {
  predictions: Prediction[];
  user: User;
  selectedCategory: Category;
  sortBy: SortBy;
  isWalletConnected: boolean;
  walletAddress: string | null;
  btcBalance: number;
  setSelectedCategory: (cat: Category) => void;
  setSortBy: (sort: SortBy) => void;
  addPrediction: (text: string, stake: number, token: TokenSymbol, confidence: ConfidenceLevel, category: Prediction['category'], expiryDate: string) => void;
  stakePrediction: (id: string, amount: number, token: TokenSymbol) => void;
  tipPrediction: (id: string, amount: number, token: TokenSymbol) => void;
  likePrediction: (id: string) => void;
  addComment: (id: string, text: string) => void;
  updateReputation: (userId: string, action: 'positive' | 'negative') => void;
  refreshBalances: () => Promise<void>;
  connectWallet: () => Promise<{ ok: boolean; error?: string }>;
  disconnectWallet: () => Promise<{ ok: boolean; error?: string }>;
  updateUser: (updates: Partial<User>) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Load predictions from localStorage on mount, fallback to mock data
  const [predictions, setPredictions] = useState<Prediction[]>(() => {
    const saved = PredictionStorage.getAllPredictions();
    return saved.length > 0 ? saved : mockPredictions;
  });
  const [user, setUser] = useState<User>(demoUser);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortBy>('trending');
  const { wallet, loading, connect, disconnect } = useOPNetWallet();

  const getTokenBalance = useCallback((tokenBalances: User['tokenBalances'], token: TokenSymbol) => {
    return tokenBalances?.[token] ?? 0;
  }, []);

  const refreshBalancesNow = useCallback(async () => {
    if (!wallet?.address) return;

    try {
      console.log('🔄 Refreshing token balances...');
      const balances = await tokenService.getAllBalances(wallet.address);
      const balancesObj = balances as any;

      // Use real wallet balance for BTC instead of token service
      const realBTCBalance = wallet.balance / 1e8; // Convert from satoshis to BTC

      setUser(prev => ({
        ...prev,
        balance: realBTCBalance,
        tokenBalances: {
          BTC: realBTCBalance,
          MOTO: parseFloat(balancesObj.MOTO || '0') || prev.tokenBalances?.MOTO || 12500,
          PILL: parseFloat(balancesObj.PILL || '0') || prev.tokenBalances?.PILL || 8400,
        }
      }));

      console.log('✅ Balances refreshed:', {
        ...balancesObj,
        BTC: realBTCBalance.toFixed(8)
      });
    } catch (error) {
      console.error('❌ Error refreshing balances:', error);
    }
  }, [wallet?.address, wallet.balance]);

  const addPrediction = useCallback(async (text: string, stake: number, token: TokenSymbol, confidence: ConfidenceLevel, category: Prediction['category'], expiryDate: string) => {
    if (getTokenBalance(user.tokenBalances, token) < stake) return;
    
    try {
      // Створення прогнозу в блокчейні
      console.log('🚀 Creating prediction on blockchain...');
      console.log('📍 Wallet address:', wallet?.address);
      if (wallet?.address) {
        predictionService.setSenderAddress(wallet.address);
      } else {
        console.error('❌ No wallet address found');
        return;
      }
      const predictionId = await predictionService.createPrediction();
      
      if (!predictionId) {
        console.error('❌ Failed to create prediction on blockchain');
        return;
      }

      const newPrediction: Prediction = {
        id: predictionId, // Використовуємо ID з блокчейну
        text,
        stakeAmount: stake,
        stakeToken: token,
        confidence,
        category,
        expiryDate,
        author: {
          name: user.name,
          wallet: user.wallet,
          avatar: user.avatar,
          reputation: user.reputation,
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        stakes: 1,
        tips: 0,
        comments: 0,
        isResolved: false,
      };
      
      // Save to localStorage
      PredictionStorage.addPrediction(newPrediction);
      
      // Update local state
      setPredictions(prev => [newPrediction, ...prev]);
      setUser(prev => ({
        ...prev,
        balance: token === 'BTC' ? Math.max(0, prev.balance - stake) : prev.balance,
        tokenBalances: {
          BTC: token === 'BTC' ? Math.max(0, (prev.tokenBalances?.BTC ?? prev.balance) - stake) : (prev.tokenBalances?.BTC ?? prev.balance),
          MOTO: token === 'MOTO' ? Math.max(0, (prev.tokenBalances?.MOTO ?? 12500) - stake) : (prev.tokenBalances?.MOTO ?? 12500),
          PILL: token === 'PILL' ? Math.max(0, (prev.tokenBalances?.PILL ?? 8400) - stake) : (prev.tokenBalances?.PILL ?? 8400),
        },
        predictions: prev.predictions + 1,
        totalStaked: prev.totalStaked + stake,
        reputation: prev.reputation + 10,
      }));
      
      console.log('✅ Prediction created successfully on blockchain!');
    } catch (error) {
      console.error('❌ Error creating prediction:', error);
    }
  }, [getTokenBalance, user]);

  const stakePrediction = useCallback(async (id: string, amount: number, token: TokenSymbol) => {
    if (getTokenBalance(user.tokenBalances, token) < amount) return;
    
    try {
      // Створення stake в блокчейні з реальним OP20 списанням
      console.log(`🚀 Adding ${amount} ${token} stake on blockchain...`);
      
      // Встановлюємо адресу гаманця для сервісу
      console.log('📍 Wallet address:', wallet?.address);
      if (wallet?.address) {
        stakeService.setSenderAddress(wallet.address);
      } else {
        console.error('❌ No wallet address found');
        return;
      }
      
      const stakeId = await stakeService.addStake(token, parseFloat(amount.toString()));
      
      if (!stakeId) {
        console.error('❌ Failed to add stake on blockchain');
        return;
      }
      
      console.log('✅ Stake added successfully on blockchain!');
      
      // Оновлюємо локальний стан
      setPredictions(prev =>
        prev.map(p => p.id === id ? { ...p, stakes: p.stakes + 1, stakeAmount: p.stakeAmount + amount, stakeToken: token } : p)
      );
      setUser(prev => ({
        ...prev,
        balance: token === 'BTC' ? Math.max(0, prev.balance - amount) : prev.balance,
        tokenBalances: {
          BTC: token === 'BTC' ? Math.max(0, (prev.tokenBalances?.BTC ?? prev.balance) - amount) : (prev.tokenBalances?.BTC ?? prev.balance),
          MOTO: token === 'MOTO' ? Math.max(0, (prev.tokenBalances?.MOTO ?? 12500) - amount) : (prev.tokenBalances?.MOTO ?? 12500),
          PILL: token === 'PILL' ? Math.max(0, (prev.tokenBalances?.PILL ?? 8400) - amount) : (prev.tokenBalances?.PILL ?? 8400),
        },
        totalStaked: prev.totalStaked + amount,
        reputation: prev.reputation + 5,
      }));

      await refreshBalancesNow();
    } catch (error) {
      console.error('❌ Error adding stake:', error);
    }
  }, [getTokenBalance, user.tokenBalances, wallet, refreshBalancesNow]);

  const tipPrediction = useCallback(async (id: string, amount: number, token: TokenSymbol) => {
    if (getTokenBalance(user.tokenBalances, token) < amount) return;
    
    try {
      // Створення tip в блокчейні з реальним OP20 списанням
      console.log(`🚀 Adding ${amount} ${token} tip on blockchain...`);
      
      // Встановлюємо адресу гаманця для сервісу
      console.log('📍 Wallet address:', wallet?.address);
      if (wallet?.address) {
        tipService.setSenderAddress(wallet.address);
      } else {
        console.error('❌ No wallet address found');
        return;
      }
      
      const tipId = await tipService.addTip(token, amount);
      
      if (!tipId) {
        console.error('❌ Failed to add tip on blockchain');
        return;
      }
      
      console.log('✅ Tip added successfully on blockchain!');
      
      // Оновлюємо локальний стан
      setPredictions(prev =>
        prev.map(p => p.id === id ? { ...p, tips: p.tips + 1 } : p)
      );
      setUser(prev => ({
        ...prev,
        balance: token === 'BTC' ? Math.max(0, prev.balance - amount) : prev.balance,
        tokenBalances: {
          BTC: token === 'BTC' ? Math.max(0, (prev.tokenBalances?.BTC ?? prev.balance) - amount) : (prev.tokenBalances?.BTC ?? prev.balance),
          MOTO: token === 'MOTO' ? Math.max(0, (prev.tokenBalances?.MOTO ?? 12500) - amount) : (prev.tokenBalances?.MOTO ?? 12500),
          PILL: token === 'PILL' ? Math.max(0, (prev.tokenBalances?.PILL ?? 8400) - amount) : (prev.tokenBalances?.PILL ?? 8400),
        },
        reputation: prev.reputation + 2,
      }));
      
      // Оновлюємо реальні баланси
      await refreshBalancesNow();
    } catch (error) {
      console.error('❌ Error adding tip:', error);
    }
  }, [getTokenBalance, user.tokenBalances, wallet, refreshBalancesNow]);

  const likePrediction = useCallback(async (id: string) => {
    try {
      // Створення like в блокчейні
      console.log('🚀 Adding like on blockchain...');
      
      // Встановлюємо адресу гаманця для сервісу
      if (wallet?.address) {
        likeService.setSenderAddress(wallet.address);
      } else {
        console.error('❌ No wallet address found');
        return;
      }
      
      const likeId = await likeService.addLike();
      
      if (!likeId) {
        console.error('❌ Failed to add like on blockchain');
        return;
      }
      
      console.log('✅ Like added successfully on blockchain!');
      
      // Оновлюємо локальний стан
      setPredictions(prev =>
        prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p)
      );
      setUser(prev => ({
        ...prev,
        reputation: prev.reputation + 1,
      }));

    } catch (error) {
      console.error('❌ Error adding like:', error);
    }
  }, [wallet?.address]);

  const connectWallet = useCallback(async () => {
    return await connect();
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    return await disconnect();
  }, [disconnect]);

  // Load user profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setUser(prev => ({ ...prev, ...parsedProfile }));
      } catch (error) {
        console.error('Failed to load saved profile:', error);
      }
    }
  }, []);

  // Update wallet address and balance when wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      const realBalance = wallet.balance / 1e8; // Convert from satoshis to BTC
      setUser(prev => {
        const updatedUser = { 
          ...prev, 
          wallet: wallet.address!,
          balance: realBalance,
          tokenBalances: prev.tokenBalances || { BTC: realBalance, MOTO: 12500, PILL: 8400 }
        };
        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify({
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          bio: updatedUser.bio,
          reputation: updatedUser.reputation,
          accuracy: updatedUser.accuracy,
          predictions: updatedUser.predictions,
          totalStaked: updatedUser.totalStaked,
          balance: updatedUser.balance,
          tokenBalances: updatedUser.tokenBalances,
          badges: updatedUser.badges,
          followers: updatedUser.followers,
          following: updatedUser.following,
          wallet: updatedUser.wallet
        }));
        return updatedUser;
      });
    }
  }, [wallet.connected, wallet.address, wallet.balance]);

  const followUser = useCallback((userId: string) => {
    setUser(prev => ({
      ...prev,
      following: [...prev.following, userId]
    }));
  }, []);

  const unfollowUser = useCallback((userId: string) => {
    setUser(prev => ({
      ...prev,
      following: prev.following.filter(id => id !== userId)
    }));
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...updates };
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify({
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        reputation: updatedUser.reputation,
        accuracy: updatedUser.accuracy,
        predictions: updatedUser.predictions,
        totalStaked: updatedUser.totalStaked,
        balance: updatedUser.balance,
        tokenBalances: updatedUser.tokenBalances,
        badges: updatedUser.badges,
        followers: updatedUser.followers,
        following: updatedUser.following,
        wallet: updatedUser.wallet
      }));
      return updatedUser;
    });
  }, []);

  const refreshBalances = refreshBalancesNow;

  const addComment = useCallback(async (id: string, text: string) => {
    try {
      // Створення коментаря в блокчейні
      console.log('🚀 Adding comment on blockchain...');
      
      // Встановлюємо адресу гаманця для сервісу
      if (wallet?.address) {
        commentService.setSenderAddress(wallet.address);
      }
      
      const commentId = await commentService.addComment();
      
      if (!commentId) {
        console.error('❌ Failed to add comment on blockchain');
        return;
      }
      
      console.log('✅ Comment added successfully on blockchain!');
      
      // Оновлюємо локальний стан
      setPredictions(prev =>
        prev.map(p => p.id === id ? { ...p, comments: p.comments + 1 } : p)
      );
    } catch (error) {
      console.error('❌ Error adding comment:', error);
    }
  }, [wallet]);

  const updateReputation = useCallback(async (userId: string, action: 'positive' | 'negative') => {
    try {
      // Оновлення репутації в блокчейні
      console.log('🚀 Updating reputation on blockchain...');
      
      // Встановлюємо адресу гаманця для сервісу
      if (wallet?.address) {
        reputationService.setSenderAddress(wallet.address);
      }
      
      const reputationId = await reputationService.updateReputation();
      
      if (!reputationId) {
        console.error('❌ Failed to update reputation on blockchain');
        return;
      }
      
      console.log('✅ Reputation updated successfully on blockchain!');
      
      // Оновлюємо локальний стан
      const reputationChange = action === 'positive' ? 10 : -5;
      setUser(prev => ({
        ...prev,
        reputation: Math.max(0, prev.reputation + reputationChange)
      }));
    } catch (error) {
      console.error('❌ Error updating reputation:', error);
    }
  }, [wallet]);

  return (
    <AppContext.Provider value={{
      predictions, user, selectedCategory, sortBy, isWalletConnected: wallet.connected,
      walletAddress: wallet.address, btcBalance: wallet.balance / 1e8,
      setSelectedCategory, setSortBy,
      addPrediction, stakePrediction, tipPrediction, likePrediction,
      addComment, updateReputation, refreshBalances,
      connectWallet, disconnectWallet,
      updateUser, followUser, unfollowUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
