import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { formatRelativeDate } from "@/utils/formatters";
import { commentService } from "@/services/api/commentService";

const CommentItem = ({ comment, onReply, onLike, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Failed to reply:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = () => {
    onLike(comment.id, !comment.isLiked);
  };

  return (
    <div className={`${level > 0 ? "ml-8 border-l border-gray-200 dark:border-slate-700 pl-4" : ""}`}>
      <div className="flex gap-3 mb-4">
        <Avatar
          src={comment.author.profilePicture}
          alt={comment.author.name}
          fallback={comment.author.name}
          size="sm"
        />
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-500">
                {formatRelativeDate(comment.createdAt)}
              </span>
            </div>
            
            <p className="text-gray-800 dark:text-slate-200 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                comment.isLiked ? "text-red-500" : "text-gray-500 dark:text-slate-500"
              }`}
            >
              <ApperIcon 
                name="Heart" 
                className={`w-3 h-3 ${comment.isLiked ? "fill-current" : ""}`} 
              />
              {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
            </button>
            
            {level < 2 && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 transition-colors"
              >
                Reply
              </button>
            )}
          </div>

          <AnimatePresence>
            {showReplyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <div className="flex gap-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    loading={submitting}
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                  >
                    Reply
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          onLike={onLike}
          level={level + 1}
        />
      ))}
    </div>
  );
};

const CommentSection = ({ storyId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Mock current user
  const currentUser = {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    profilePicture: null
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await commentService.getByStoryId(storyId);
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [storyId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const commentData = {
        storyId,
        content: newComment.trim(),
        userId: currentUser.id
      };
      
      const createdComment = await commentService.create(commentData);
      setComments(prev => [createdComment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId, content) => {
    try {
      const replyData = {
        storyId,
        content,
        userId: currentUser.id,
        parentCommentId: parentId
      };
      
      const createdReply = await commentService.create(replyData);
      
      // Add reply to the correct parent comment
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [createdReply, ...(comment.replies || [])]
            };
          }
          return comment;
        })
      );
    } catch (error) {
      throw error;
    }
  };

  const handleLikeComment = async (commentId, liked) => {
    try {
      // Update comment like status
      setComments(prev =>
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: liked,
              likeCount: comment.likeCount + (liked ? 1 : -1)
            };
          }
          // Check replies too
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? {
                      ...reply,
                      isLiked: liked,
                      likeCount: reply.likeCount + (liked ? 1 : -1)
                    }
                  : reply
              )
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  const handleRetry = () => {
    loadComments();
  };

  return (
    <div className="space-y-6">
      <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
        <h3 className="text-xl font-serif font-semibold text-gray-900 dark:text-slate-100 mb-6">
          Comments ({comments.length})
        </h3>

        {/* New Comment Form */}
        <div className="mb-8">
          <div className="flex gap-3">
            <Avatar
              src={currentUser.profilePicture}
              alt={currentUser.name}
              fallback={currentUser.name}
              size="sm"
            />
            
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
              />
              
              <div className="flex justify-end mt-3">
                <Button
                  variant="primary"
                  onClick={handleSubmitComment}
                  loading={submitting}
                  disabled={!newComment.trim()}
                  icon="Send"
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        {loading ? (
          <Loading className="py-8" />
        ) : error ? (
          <Error
            title="Failed to load comments"
            message={error}
            onRetry={handleRetry}
          />
        ) : comments.length === 0 ? (
          <Empty
            title="No comments yet"
            message="Be the first to share your thoughts on this story."
            icon="MessageCircle"
          />
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onLike={handleLikeComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;