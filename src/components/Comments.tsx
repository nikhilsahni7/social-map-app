"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, ThumbsUp, CornerDownRight, Loader2, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
    _id: string;
    text: string;
    author: string;
    createdAt: string;
    replies: Comment[];
    likes: number;
}

interface CommentSectionProps {
    slug: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ slug }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

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

    const handleAddComment = async () => {
        if (newComment.trim()) {
            setSubmitting(true);
            try {
                await axios.post(`/api/comments/${slug}`, {
                    text: newComment,
                    author: 'Anonymous',
                    postId: slug,
                    parentId: replyingTo,
                });
                setNewComment('');
                setReplyingTo(null);
                fetchComments();
            } catch (err) {
                setError('Failed to add comment');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleLike = async (commentId: string) => {
        try {
            await axios.post(`/api/comments/${slug}/like`, { commentId });
            fetchComments();
        } catch (err) {
            setError('Failed to like comment');
        }
    };

    const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
        <Card className={`mb-4 ${depth > 0 ? 'ml-8' : ''}`}>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center">
                            {comment.author[0].toUpperCase()}
                        </div>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">{comment.author}</span>
                            <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="mt-2 text-sm">{comment.text}</p>
                        <div className="flex items-center gap-4 mt-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => handleLike(comment._id)}
                            >
                                <ThumbsUp className="h-4 w-4" />
                                <span>{comment.likes}</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => setReplyingTo(comment._id)}
                            >
                                <CornerDownRight className="h-4 w-4" />
                                <span>Reply</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {comment.replies?.map((reply) => (
                <CommentComponent key={reply._id} comment={reply} depth={depth + 1} />
            ))}
        </Card>
    );

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments
                </h2>
                <Card>
                    <div className="p-4">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
                            className="min-h-[100px] mb-3"
                        />
                        <div className="flex items-center justify-between">
                            {replyingTo && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setReplyingTo(null)}
                                >
                                    Cancel Reply
                                </Button>
                            )}
                            <Button
                                className="ml-auto"
                                onClick={handleAddComment}
                                disabled={submitting || !newComment.trim()}
                            >
                                {submitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Send className="h-4 w-4 mr-2" />
                                )}
                                {replyingTo ? 'Reply' : 'Comment'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-destructive text-center py-4">{error}</div>
            ) : comments.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    No comments yet. Be the first to comment!
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentComponent key={comment._id} comment={comment} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;