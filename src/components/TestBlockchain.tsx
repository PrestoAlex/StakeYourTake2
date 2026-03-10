import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { predictionService } from '../services/predictionService';
import { stakeService } from '../services/stakeService';
import { tipService } from '../services/tipService';
import { likeService } from '../services/likeService';
import { commentService } from '../services/commentService';
import { reputationService } from '../services/reputationService';

export default function TestBlockchain() {
  const { isWalletConnected, walletAddress } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [tokenSymbol, setTokenSymbol] = useState<string>('MOTO');
  const [amount, setAmount] = useState<string>('1');

  const testConnection = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      if (walletAddress) {
        setResult(`✅ Wallet connected: ${walletAddress}`);
        predictionService.setSenderAddress(walletAddress);
      } else {
        setResult('❌ Wallet not connected');
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreatePrediction = async () => {
    if (!walletAddress) {
      setResult('❌ Please connect wallet first');
      return;
    }

    setIsLoading(true);
    setResult('');
    
    try {
      predictionService.setSenderAddress(walletAddress);
      const predictionId = await predictionService.createPrediction();
      if (predictionId) {
        setResult(`✅ Prediction created! ID: ${predictionId}`);
      } else {
        setResult('❌ Failed to create prediction');
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetCount = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const predictionCount = await predictionService.getPredictionCount();
      setCount(predictionCount);
      setResult(`✅ Current prediction count: ${predictionCount}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAddStake = async () => {
    if (!walletAddress) {
      setResult('❌ Please connect wallet first');
      return;
    }

    setIsLoading(true);
    setResult('');
    
    try {
      stakeService.setSenderAddress(walletAddress);
      const stakeId = await stakeService.addStake(tokenSymbol, parseFloat(amount.toString()));
      if (stakeId) {
        setResult(`✅ Stake added! ID: ${stakeId}`);
      } else {
        setResult('❌ Failed to add stake');
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetStakeCount = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const stakeCount = await stakeService.getStakeCount();
      setCount(stakeCount);
      setResult(`✅ Current stake count: ${stakeCount}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAddTip = async () => {
    if (!walletAddress) {
      setResult('❌ Please connect wallet first');
      return;
    }

    setIsLoading(true);
    setResult('');
    
    try {
      tipService.setSenderAddress(walletAddress);
      const tipId = await tipService.addTip(tokenSymbol, parseFloat(amount));
      if (tipId) {
        setResult(`✅ Tip added! ID: ${tipId}`);
      } else {
        setResult('❌ Failed to add tip');
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetTipCount = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const tipCount = await tipService.getTipCount();
      setCount(tipCount);
      setResult(`✅ Current tip count: ${tipCount}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAddLike = async () => {
    if (!walletAddress) {
      setResult('❌ Please connect wallet first');
      return;
    }

    setIsLoading(true);
    setResult('');
    
    try {
      likeService.setSenderAddress(walletAddress);
      const likeId = await likeService.addLike();
      if (likeId) {
        setResult(`✅ Like added! ID: ${likeId}`);
      } else {
        setResult('❌ Failed to add like');
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetLikeCount = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const likeCount = await likeService.getLikeCount();
      setCount(likeCount);
      setResult(`✅ Current like count: ${likeCount}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAddComment = async () => {
    if (!walletAddress) {
      setResult('❌ Please connect wallet first');
      return;
    }

    setIsLoading(true);
    setResult('');
    
    try {
      commentService.setSenderAddress(walletAddress);
      const commentId = await commentService.addComment();
      if (commentId) {
        setResult(`✅ Comment added! ID: ${commentId}`);
      } else {
        setResult('❌ Failed to add comment');
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetCommentCount = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const commentCount = await commentService.getCommentCount();
      setCount(commentCount);
      setResult(`✅ Current comment count: ${commentCount}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testUpdateReputation = async () => {
    if (!walletAddress) {
      setResult('❌ Please connect wallet first');
      return;
    }

    setIsLoading(true);
    setResult('');
    
    try {
      reputationService.setSenderAddress(walletAddress);
      const reputationId = await reputationService.updateReputation();
      if (reputationId) {
        setResult(`✅ Reputation updated! ID: ${reputationId}`);
      } else {
        setResult('❌ Failed to update reputation');
      }
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetReputationCount = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const reputationCount = await reputationService.getReputationCount();
      setCount(reputationCount);
      setResult(`✅ Current reputation count: ${reputationCount}`);
    } catch (error: any) {
      setResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50" style={{ background: '#F7F4ED' }}>
      <h3 className="font-bold mb-3 text-sm" style={{ color: '#1A1A1A' }}>
        🧪 Blockchain Test
      </h3>
      
      <div className="space-y-2">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: isWalletConnected ? '#7A8CFF' : '#FF7A3D',
            color: '#FFFFFF'
          }}
        >
          {isLoading ? '...' : isWalletConnected ? '✅ Connected' : '🔌 Connect Wallet'}
        </button>

        <div className="space-y-1">
          <select
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              color: '#1A1A1A'
            }}
          >
            <option value="MOTO">MOTO</option>
            <option value="PIIL">PIIL</option>
          </select>
          
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            min="0.001"
            step="0.001"
            className="w-full px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              color: '#1A1A1A'
            }}
          />
        </div>

        <button
          onClick={testCreatePrediction}
          disabled={!isWalletConnected || isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: !isWalletConnected ? '#E5E7EB' : '#FF7A3D',
            color: !isWalletConnected ? '#6B6B6B' : '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '🚀 Create Prediction'}
        </button>

        <button
          onClick={testGetCount}
          disabled={isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: '#7A8CFF',
            color: '#FFFFFF'
          }}
        >
          {isLoading ? '...' : `📊 Count: ${count}`}
        </button>

        <button
          onClick={testAddStake}
          disabled={!isWalletConnected || isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: !isWalletConnected ? '#E5E7EB' : '#10B981',
            color: !isWalletConnected ? '#6B6B6B' : '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '💰 Add Stake'}
        </button>

        <button
          onClick={testGetStakeCount}
          disabled={isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: '#8B5CF6',
            color: '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '🔢 Stake Count'}
        </button>

        <button
          onClick={testAddTip}
          disabled={!isWalletConnected || isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: !isWalletConnected ? '#E5E7EB' : '#F59E0B',
            color: !isWalletConnected ? '#6B6B6B' : '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '💸 Add Tip'}
        </button>

        <button
          onClick={testGetTipCount}
          disabled={isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: '#EF4444',
            color: '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '🔢 Tip Count'}
        </button>

        <button
          onClick={testAddLike}
          disabled={!isWalletConnected || isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: !isWalletConnected ? '#E5E7EB' : '#EC4899',
            color: !isWalletConnected ? '#6B6B6B' : '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '❤️ Add Like'}
        </button>

        <button
          onClick={testGetLikeCount}
          disabled={isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: '#06B6D4',
            color: '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '🔢 Like Count'}
        </button>

        <button
          onClick={testAddComment}
          disabled={!isWalletConnected || isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: !isWalletConnected ? '#E5E7EB' : '#6366F1',
            color: !isWalletConnected ? '#6B6B6B' : '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '💬 Add Comment'}
        </button>

        <button
          onClick={testGetCommentCount}
          disabled={isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: '#84CC16',
            color: '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '🔢 Comment Count'}
        </button>

        <button
          onClick={testUpdateReputation}
          disabled={!isWalletConnected || isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: !isWalletConnected ? '#E5E7EB' : '#F97316',
            color: !isWalletConnected ? '#6B6B6B' : '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '🏆 Update Rep'}
        </button>

        <button
          onClick={testGetReputationCount}
          disabled={isLoading}
          className="w-full px-3 py-2 rounded text-xs font-medium transition-colors"
          style={{
            backgroundColor: '#A855F7',
            color: '#FFFFFF'
          }}
        >
          {isLoading ? '...' : '🔢 Rep Count'}
        </button>
      </div>

      {result && (
        <div className="mt-3 p-2 rounded text-xs" style={{ 
          backgroundColor: result.includes('✅') ? '#D4EDDA' : '#F8D7DA',
          color: result.includes('✅') ? '#155724' : '#721C24'
        }}>
          {result}
        </div>
      )}
    </div>
  );
}
