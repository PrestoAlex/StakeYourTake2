import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send, User } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionId: string;
  predictionText: string;
}

export default function CommentsModal({ isOpen, onClose, predictionId, predictionText }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'CryptoWhale',
      avatar: '🐋',
      text: 'Interesting prediction! I think this has a good chance of happening.',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: '2', 
      author: 'TokenMaster',
      avatar: '🎯',
      text: 'Not sure about this one. The timeline seems too aggressive.',
      timestamp: '1 hour ago',
      likes: 8
    },
    {
      id: '3',
      author: 'StakeKing',
      avatar: '👑',
      text: 'Bullish on this! Already staked 0.5 BTC',
      timestamp: '30 minutes ago',
      likes: 24
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'You',
        avatar: '🦄',
        text: newComment,
        timestamp: 'Just now',
        likes: 0
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleLike = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
            style={{ background: '#F7F4ED' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" style={{ color: '#FF7A3D' }} />
                <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>
                  Comments
                </h2>
                <span className="px-2 py-1 rounded-full text-xs font-medium" 
                  style={{ backgroundColor: '#7A8CFF20', color: '#7A8CFF' }}>
                  {comments.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: '#6B6B6B' }} />
              </button>
            </div>

            {/* Prediction Preview */}
            <div className="p-4 border-b border-gray-200" style={{ backgroundColor: '#FAF9F6' }}>
              <p className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                Prediction:
              </p>
              <p className="text-sm mt-1" style={{ color: '#1A1A1A' }}>
                {predictionText}
              </p>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: '400px' }}>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm" style={{ color: '#1A1A1A' }}>
                          {comment.author}
                        </span>
                        <span className="text-xs" style={{ color: '#6B6B6B' }}>
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: '#1A1A1A' }}>
                        {comment.text}
                      </p>
                      <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
                        style={{ color: '#FF7A3D' }}
                      >
                        <span>❤️</span>
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  🦄
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5E7EB',
                      color: '#1A1A1A'
                    }}
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: newComment.trim() && !isSubmitting ? '#FF7A3D' : '#E5E7EB',
                    color: newComment.trim() && !isSubmitting ? '#FFFFFF' : '#6B6B6B'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
