export interface Prediction {
  id: string;
  text: string;
  stakeAmount: number;
  stakeToken: TokenSymbol;
  confidence: 'low' | 'medium' | 'high';
  category: 'bitcoin' | 'crypto' | 'tech' | 'world';
  expiryDate: string;
  author: {
    name: string;
    wallet: string;
    avatar: string;
    reputation: number;
  };
  createdAt: string;
  likes: number;
  stakes: number;
  tips: number;
  comments: number;
  isResolved: boolean;
  result?: 'correct' | 'wrong';
}

export interface User {
  name: string;
  wallet: string;
  avatar: string;
  bio?: string;
  balance: number;
  tokenBalances?: Record<TokenSymbol, number>;
  reputation: number;
  badges: Badge[];
  predictions: number;
  accuracy: number;
  totalStaked: number;
  followers: string[];
  following: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  border: 'gold' | 'silver';
}

export type TokenSymbol = 'BTC' | 'MOTO' | 'PILL';
export type Category = 'all' | 'bitcoin' | 'crypto' | 'tech' | 'world';
export type SortBy = 'trending' | 'newest' | 'highest-stake';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
