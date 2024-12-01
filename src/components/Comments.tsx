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

interface ProjectData {
    _id: string;
    firstName: string;
    lastName: string;
    title: string;
    objective: string;
    category: string;
    duration: {
        startDate: string;
        endDate: string;
    };
    description: string;
    supportItems: Array<{
        item: string;
        quantity: string;
        byWhen: string;
        dropLocation: string;
    }>;
    otherSupport: string;
    pictureOfSuccess?: {
        url: string;
    };
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
}: {
    onSubmit: () => void;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    submitting: boolean;
    projectInitials: string;
    onCancel?: () => void;
    inputRef?: React.RefObject<HTMLTextAreaElement>;
}) => (
    <div className="flex flex-col space-y-2">
        <Textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[40px] resize-none focus:min-h-[80px] w-full"
        />
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
    const [username, setUsername] = useState<string>("")
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');
    const replyInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const storedUserName = localStorage.getItem('username');
        if (storedUserName) {
            setUsername(storedUserName);
            console.log(storedUserName);

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
            <div className="flex flex-col sm:flex-row sm:space-x-4">
                <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-md font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                        {username[1]}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{comment.author}</span>
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
                                projectInitials={projectInitials}
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
                            projectInitials={projectInitials}
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
    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const mainCommentInputRef = useRef<HTMLTextAreaElement>(null);

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
        const fetchProjectData = async () => {
            try {
                const response = await fetch(`/api/projects/${slug}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch project data");
                }
                const data = await response.json();
                setProjectData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            }
        };

        fetchProjectData();
        fetchComments();
    }, [slug, fetchComments]);

    const handleAddComment = async (text: string, parentId?: string) => {
        if (text?.trim()) {
            setSubmitting(true);
            try {
                await axios.post(`/api/comments/${slug}`, {
                    text,
                    author: 'Anonymous',
                    postId: slug,
                    parentId,
                });
                setNewComment('');
                fetchComments();
            } catch (err) {
                setError('Failed to add comment');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleLike = async (commentId: string, action: 'like' | 'dislike') => {
        try {
            await axios.post(`/api/comments/${slug}/${action}`, { commentId });
            fetchComments();
        } catch (err) {
            setError(`Failed to ${action} comment`);
        }
    };

    const projectInitials = `${projectData?.firstName?.[0] ?? ""}${projectData?.lastName?.[0] ?? ""}`;

    return (
        <div className="w-full px-4 py-8">
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments ({comments.length})
                </h2>
                <CommentInput
                    value={newComment}
                    onChange={setNewComment}
                    onSubmit={() => handleAddComment(newComment)}
                    placeholder="Add a comment..."
                    submitting={submitting}
                    projectInitials={projectInitials}
                    inputRef={mainCommentInputRef}
                />
            </div>

            {loading && (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
            {error && (
                <div className="text-red-500 text-center py-4">
                    <span>{error}</span>
                </div>
            )}
            {comments.map((comment) => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    projectInitials={projectInitials}
                    onLike={handleLike}
                    onReply={(commentId, text) => handleAddComment(text, commentId)}
                    submitting={submitting}
                />
            ))}
        </div>
    );
};

export default CommentSection;