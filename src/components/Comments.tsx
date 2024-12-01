import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Loader2, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Comment {
    _id: string;
    text: string;
    author: string;
    createdAt: string;
    replies: Comment[];
    likes: number;
    dislikes: number;
}

interface CommentInputProps {
    onSubmit: () => void;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    submitting: boolean;
    projectInitials: string;
    onCancel?: () => void;
    inputRef?: React.RefObject<HTMLTextAreaElement>;
}

const CommentInput = ({
    onSubmit,
    value,
    onChange,
    placeholder,
    submitting,
    projectInitials,
    onCancel,
    inputRef,
}: CommentInputProps) => (
    <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
            <Avatar className="h-16 w-16 mt-1 border-2 border-black-700">
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    {projectInitials.split(' ').length > 1 ?
                        projectInitials.split(' ')[0][1] + projectInitials.split(' ')[1][0] :
                        projectInitials.split(' ')[0][0] + projectInitials.split(' ')[0][1]}

                </AvatarFallback>
            </Avatar>
            <Textarea
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-h-[40px] resize-none focus:min-h-[80px] w-full"
            />
        </div>
        <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
            </Button>
            <Button
                size="sm"
                onClick={onSubmit}
                disabled={!value.trim() || submitting}
                className="min-w-[80px]"
            >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Comment"}
            </Button>
        </div>
    </div>
);

interface CommentItemProps {
    comment: Comment;
    depth?: number;
    projectInitials: string;
    onLike: (commentId: string, action: 'like' | 'dislike') => void;
    onReply: (commentId: string, text: string) => void;
    submitting: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    depth = 0,
    projectInitials,
    onLike,
    onReply,
    submitting
}) => {
    const [username, setUsername] = useState<string>("");
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');
    const replyInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const storedUserName = localStorage.getItem('username');
        if (storedUserName) {
            const nameParts = storedUserName.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts[nameParts.length - 1];
            setUsername(storedUserName);
        } else {
            console.log('No user name found in localStorage');
        }
    }, []);

    const handleReply = () => {
        onReply(comment._id, replyText);
        setReplyText('');
        setShowReplyBox(false);
    };

    useEffect(() => {
        if (showReplyBox && replyInputRef.current) {
            replyInputRef.current.focus();
        }
    }, [showReplyBox]);

    return (
        <div className={cn("group py-4", depth > 0 && "ml-6 sm:ml-12")}>
            <div className="flex flex-row md:flex-row space-x-4 ml-6">
                <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-md font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                        {comment.author.split(' ').length > 1 ?
                            comment.author.split(' ')[0][1] + comment.author.split(' ')[1][0] :
                            comment.author.split(' ')[0][0]}

                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{comment.author.replace(/^"|"$/g, '').trim()}</span>

                        <span className="text-xs text-muted-foreground">
                            {comment.createdAt && !isNaN(new Date(comment.createdAt).getTime())
                                ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                                : 'Invalid date'}
                        </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.text}</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => onLike(comment._id, 'like')}
                        >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span className="text-xs">{comment.likes}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => onLike(comment._id, 'dislike')}
                        >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            <span className="text-xs">{comment.dislikes}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowReplyBox(!showReplyBox)}
                        >
                            Reply
                        </Button>
                    </div>
                    {showReplyBox && (
                        <div className="mt-4">
                            <CommentInput
                                value={replyText}
                                onChange={setReplyText}
                                onSubmit={handleReply}
                                placeholder="Add a reply..."
                                submitting={submitting}
                                projectInitials={username}
                                onCancel={() => setShowReplyBox(false)}
                                inputRef={replyInputRef}
                            />
                        </div>
                    )}
                </div>
            </div>
            {comment.replies?.length > 0 && (
                <div className="mt-4 pl-2 sm:pl-12">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            depth={depth + 1}
                            projectInitials={username}
                            onLike={onLike}
                            onReply={onReply}
                            submitting={submitting}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface CommentSectionProps {
    slug: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ slug }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [showAllComments, setShowAllComments] = useState(false); // State to toggle comment display

    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/comments/${slug}`);
            setComments(response.data.comments);
        } catch (err) {
            setError('Failed to load comments');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        const storedUserName = localStorage.getItem('username');
        if (storedUserName) {
            setUsername(storedUserName);
        } else {
            console.log('No user name found in localStorage');
        }
    }, []);

    const handleAddComment = async (text: string, parentId?: string) => {
        if (text?.trim()) {
            setSubmitting(true);
            try {
                await axios.post(`/api/comments/${slug}`, {
                    text,
                    author: username,
                    postId: slug,
                    parentId,
                });
                fetchComments(); // Refresh comments after adding a new one
                setNewComment('');
            } catch (err) {
                setError('Failed to add comment');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleLike = async (commentId: string, action: 'like' | 'dislike') => {
        try {
            await axios.post(`/api/comments/like/${commentId}`, { action });
            fetchComments(); // Refresh comments after liking/disliking
        } catch (err) {
            console.error('Failed to like/dislike the comment');
        }
    };

    const handleReply = (commentId: string, text: string) => {
        handleAddComment(text, commentId);
    };

    const handleShowAllComments = () => {
        setShowAllComments(true);
    };

    return (
        <div className="space-y-4">
            {loading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
                <>
                    <CommentInput
                        value={newComment}
                        onChange={setNewComment}
                        onSubmit={() => handleAddComment(newComment)}
                        placeholder="Add a comment..."
                        submitting={submitting}
                        projectInitials={username}
                    />
                    <div className="space-y-4">
                        {comments.slice(0, showAllComments ? comments.length : 16).map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                projectInitials={username}
                                onLike={handleLike}
                                onReply={handleReply}
                                submitting={submitting}
                            />
                        ))}
                    </div>

                    {comments.length > 16 && !showAllComments && (
                        <button
                        className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300 font-semibold"
                        onClick={handleShowAllComments}
                    >
                        <span>Read More Comments</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            aria-hidden="true"
                            style={{
                                transform: showAllComments ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    
                    )}
                </>
            )}
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
};

