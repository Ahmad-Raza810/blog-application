import React, { useEffect, useState } from 'react';
import { Button, Textarea, Avatar, Spinner } from '@nextui-org/react';
import { Send, Trash2, MessageCircle } from 'lucide-react';
import { apiService, Comment, extractErrorMessage } from '../services/apiService';
import { useAuth } from './AuthContext';

interface CommentsSectionProps {
    postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await apiService.getPostComments(postId);
            console.log('Fetched comments data:', data);
            if (data.length > 0) {
                console.log('First comment keys:', Object.keys(data[0]).join(', '));
                console.log('First comment object:', JSON.stringify(data[0], null, 2));
            }
            // Ensure data is array
            setComments(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch comments', err);
            setError(extractErrorMessage(err, 'Failed to load comments'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;

        try {
            setSubmitting(true);
            const newComment = await apiService.createComment(postId, commentText);
            setComments(prev => [newComment, ...prev]);
            setCommentText('');
        } catch (err) {
            console.error('Failed to post comment', err);
            alert(extractErrorMessage(err, 'Failed to post comment'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await apiService.deleteComment(commentId);
            setComments(prev => prev.filter(c => c.commentId !== commentId));
        } catch (err: any) {
            console.error('Failed to delete comment. Error details:', err);
            const errorMessage = extractErrorMessage(err, 'Failed to delete comment');
            alert(`Error deleting comment: ${errorMessage}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="mt-16 pt-10 border-t border-secondary-200 dark:border-secondary-800">
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 flex items-center gap-2">
                <MessageCircle size={24} />
                Comments ({comments.length})
            </h3>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Add Comment Form */}
            {user ? (
                <div className="flex gap-4 mb-10">
                    <Avatar
                        src={user.avatar}
                        name={user.name?.charAt(0)}
                        className="flex-shrink-0"
                        color="primary"
                        isBordered
                    />
                    <div className="flex-grow">
                        <Textarea
                            placeholder="What are your thoughts?"
                            minRows={3}
                            value={commentText}
                            onValueChange={setCommentText}
                            className="mb-3"
                            variant="faded"
                        />
                        <div className="flex justify-end">
                            <Button
                                color="primary"
                                isLoading={submitting}
                                endContent={!submitting && <Send size={16} />}
                                onPress={handleSubmitComment}
                                isDisabled={!commentText.trim()}
                            >
                                Post Comment
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-secondary-50 dark:bg-secondary-900/50 p-6 rounded-xl text-center mb-10">
                    <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                        Log in to join the conversation and leave a comment.
                    </p>
                    <Button
                        as="a"
                        href="/login"
                        color="primary"
                        variant="flat"
                    >
                        Log In
                    </Button>
                </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
                <div className="text-center py-10 text-secondary-500">
                    No comments yet. Be the first to share your thoughts!
                </div>
            ) : (
                <div className="space-y-8">
                    {comments.map((comment) => {
                        const isOwner = user && (user.id === comment.author?.id);
                        const isAdmin = user?.userRole === 'ADMIN';
                        const canDelete = isOwner || isAdmin;

                        return (
                            <div key={comment.commentId} className="flex gap-4 group">
                                <Avatar
                                    src={comment.author?.avatar}
                                    name={comment.author?.name?.charAt(0) || '?'}
                                    className="flex-shrink-0"
                                />
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-secondary-900 dark:text-white">
                                                {comment.author?.name || 'Unknown User'}
                                            </span>
                                            {comment.createdAt && (
                                                <span className="text-xs text-secondary-500">
                                                    • {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        {canDelete && (
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="danger"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                onPress={() => handleDeleteComment(comment.commentId)}
                                                aria-label="Delete comment"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-secondary-600 dark:text-secondary-300 whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CommentsSection;
