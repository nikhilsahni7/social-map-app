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
    const { commentId, action } = body;

    if (!commentId || !action) {
      return NextResponse.json(
        { success: false, message: 'Comment ID and action are required' },
        { status: 400 }
      );
    }

    if (action !== 'like' && action !== 'dislike') {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
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

    // Initialize counts if they don't exist
    if (!comment.likes) comment.likes = 0;
    if (!comment.dislikes) comment.dislikes = 0;

    // Update the appropriate counter
    if (action === 'like') {
      comment.likes += 1;
    } else {
      comment.dislikes += 1;
    }

    await comment.save();

    return NextResponse.json({ 
      success: true, 
      likes: comment.likes,
      dislikes: comment.dislikes
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}