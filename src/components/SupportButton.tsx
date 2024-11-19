"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Send, CornerDownRight, ThumbsUp } from 'lucide-react'

interface Comment {
    id: string
    author: string
    content: string
    timestamp: string
    likes: number
    replies: Comment[]
}

interface Profile {
    id: string
    name: string
    avatar: string
    supporters: number
}

const initialComments: Comment[] = [
    {
        id: '1',
        author: 'John Doe',
        content: 'Great content! Keep it up.',
        timestamp: '2 hours ago',
        likes: 15,
        replies: [
            {
                id: '1-1',
                author: 'Jane Smith',
                content: 'Totally agree!',
                timestamp: '1 hour ago',
                likes: 3,
                replies: []
            }
        ]
    },
    {
        id: '2',
        author: 'Alice Brown',
        content: 'This is really inspiring. Thanks for sharing!',
        timestamp: '1 day ago',
        likes: 24,
        replies: []
    }
]

const otherProfiles: Profile[] = [
    { id: '1', name: 'Pet Care', avatar: '/placeholder.svg?height=50&width=50', supporters: 1234 },
    { id: '2', name: 'Cancer NGO', avatar: '/placeholder.svg?height=50&width=50', supporters: 5678 },
    { id: '3', name: 'Animal NGO', avatar: '/placeholder.svg?height=50&width=50', supporters: 9012 }
]

export default function ProfileDetails() {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState<string | null>(null)

    const handleCommentSubmit = (e: React.FormEvent, parentId: string | null = null) => {
        e.preventDefault()
        if (newComment.trim()) {
            const newCommentObj: Comment = {
                id: String(Date.now()),
                author: 'Current User',
                content: newComment.trim(),
                timestamp: 'Just now',
                likes: 0,
                replies: []
            }

            if (parentId) {
                setComments(comments.map(comment =>
                    comment.id === parentId
                        ? { ...comment, replies: [...comment.replies, newCommentObj] }
                        : comment
                ))
            } else {
                setComments([newCommentObj, ...comments])
            }

            setNewComment('')
            setReplyingTo(null)
        }
    }

    const renderComment = (comment: Comment, isReply = false) => (
        <div key={comment.id} className={`${isReply ? 'ml-8' : 'border-b'} py-4`}>
            <div className="flex items-start space-x-3">
                <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={comment.author} />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold">{comment.author}</p>
                    <p>{comment.content}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-blue-600">
                        <button className="flex items-center space-x-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{comment.likes}</span>
                        </button>
                        <button onClick={() => setReplyingTo(comment.id)}>Reply</button>
                        <span>{comment.timestamp}</span>
                    </div>
                    {replyingTo === comment.id && (
                        <form onSubmit={(e) => handleCommentSubmit(e, comment.id)} className="mt-2">
                            <Input
                                placeholder="Write a reply..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="mb-2"
                            />
                            <Button type="submit" size="sm">
                                <Send className="w-4 h-4 mr-2" />
                                Reply
                            </Button>
                        </form>
                    )}
                </div>
            </div>
            {comment.replies.map(reply => renderComment(reply, true))}
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8 bg-white">
            {/* <Card className="mb-8 border-blue-200 shadow-lg">
                <CardContent className="pt-6">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                            <Heart className="w-6 h-6 mr-2" />
                            Support This Creator
                        </Button>
                    </motion.div>
                </CardContent>
            </Card> */}

            <Card className="mb-8 border-blue-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-blue-600">Comments</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleCommentSubmit(e)} className="mb-6">
                        <Textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="mb-2 border-blue-200 focus:ring-blue-500"
                        />
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Send className="w-4 h-4 mr-2" />
                            Post Comment
                        </Button>
                    </form>
                    <div className="space-y-4">
                        {comments.map(comment => renderComment(comment))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-blue-600">Other Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {otherProfiles.map((profile) => (
                            <div key={profile.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                                <Avatar>
                                    <AvatarImage src={profile.avatar} alt={profile.name} />
                                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-blue-600">{profile.name}</p>
                                    <p className="text-sm text-blue-500">{profile.supporters} supporters</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}