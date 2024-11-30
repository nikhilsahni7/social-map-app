import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Loader2, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface CommentSectionProps {
    slug: string;
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
export const CommentSection: React.FC<CommentSectionProps> = ({ slug }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyText, setReplyText] = useState<Record<string, string>>({});
    const [showReplyBox, setShowReplyBox] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const [projectData, setProjectData] = useState<ProjectData | null>(null);

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
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [slug]);

    const handleAddComment = async (parentId?: string) => {
        const text = parentId ? replyText[parentId] : newComment;
        if (text?.trim()) {
            setSubmitting(true);
            try {
                await axios.post(`/api/comments/${slug}`, {
                    text,
                    author: 'Anonymous',
                    postId: slug,
                    parentId,
                });
                if (parentId) {
                    setReplyText(prev => ({ ...prev, [parentId]: '' }));
                    setShowReplyBox(prev => ({ ...prev, [parentId]: false }));
                } else {
                    setNewComment('');
                }
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

    const CommentInput = ({
        onSubmit,
        value,
        onChange,
        placeholder,
        autoFocus = false,
    }: {
        onSubmit: () => void;
        value: string;
        onChange: (value: string) => void;
        placeholder: string;
        autoFocus?: boolean;
    }) => (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-x-4 sm:space-y-0">
            <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="text-md font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    {projectData?.firstName?.[0] ?? ""}
                    {projectData?.lastName?.[0] ?? ""}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[40px] resize-none focus:min-h-[80px] transition-all duration-200 w-full"
                    autoFocus={autoFocus}
                />
                <div className="flex justify-end mt-2 space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onChange('')}
                        disabled={!value.trim() || submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={onSubmit}
                        disabled={!value.trim() || submitting}
                        className="min-w-[80px]"
                    >
                        {submitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Comment
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );

    const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
        <div className={cn("group py-4", depth > 0 && "ml-6 sm:ml-12")}>
            <div className="flex flex-col sm:flex-row sm:space-x-4">
                <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-md font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                        {projectData?.firstName?.[0] ?? ""}
                        {projectData?.lastName?.[0] ?? ""}
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
                            onClick={() => handleLike(comment._id, 'like')}
                        >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span className="text-xs">{comment.likes}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => handleLike(comment._id, 'dislike')}
                        >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            <span className="text-xs">{comment.dislikes}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                setShowReplyBox(prev => ({
                                    ...prev,
                                    [comment._id]: !prev[comment._id],
                                }));
                            }}
                        >
                            Reply
                        </Button>
                    </div>
                    {showReplyBox[comment._id] && (
                        <div className="mt-4">
                            <CommentInput
                                value={replyText[comment._id] || ''}
                                onChange={(value) => setReplyText(prev => ({ ...prev, [comment._id]: value }))}
                                onSubmit={() => handleAddComment(comment._id)}
                                placeholder="Add a reply..."
                                autoFocus
                            />
                        </div>
                    )}
                </div>
            </div>
            {comment.replies?.length > 0 && (
                <div className="mt-4 pl-2 sm:pl-12">
                    {comment.replies.map((reply) => (
                        <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

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
                    onSubmit={() => handleAddComment()}
                    placeholder="Add a comment..."
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
                <CommentComponent key={comment._id} comment={comment} />
            ))}
        </div>
    );
};

export default CommentSection;