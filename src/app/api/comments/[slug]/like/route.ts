import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/comment.model";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { commentId, action, username } = body;

    if (!commentId || !action || !username) {
      return NextResponse.json(
        { success: false, message: 'Required fields missing' },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }

    // Initialize if needed
    if (!comment.likedBy) comment.likedBy = [];
    if (!comment.dislikedBy) comment.dislikedBy = [];
    if (!comment.likes) comment.likes = 0;
    if (!comment.dislikes) comment.dislikes = 0;

    const hasLiked = comment.likedBy.includes(username);
    const hasDisliked = comment.dislikedBy.includes(username);

    if (action === 'like') {
      if (hasLiked) {
        // Toggle off like
        comment.likes = Math.max(0, comment.likes - 1);
        comment.likedBy = comment.likedBy.filter((user: string) => user !== username);
      } else {
        // Toggle on like
        comment.likes = comment.likes + 1;
        comment.likedBy.push(username);
      }
    } else if (action === 'dislike') {
      if (hasDisliked) {
        // Toggle off dislike
        comment.dislikes = Math.max(0, comment.dislikes - 1);
        comment.dislikedBy = comment.dislikedBy.filter((user: string) => user !== username);
      } else {
        // Toggle on dislike
        comment.dislikes = comment.dislikes + 1;
        comment.dislikedBy.push(username);
      }
    }

    await comment.save();

    return NextResponse.json({ 
      success: true, 
      likes: comment.likes,
      dislikes: comment.dislikes,
      hasLiked: comment.likedBy.includes(username),
      hasDisliked: comment.dislikedBy.includes(username)
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}