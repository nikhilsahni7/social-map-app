import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/comment.model";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const comments = await Comment.find({ 
      postId: params.slug,
      parentId: null 
    })
    .populate({
      path: 'replies',
      populate: {
        path: 'replies',
        options: { sort: { createdAt: -1 } }
      },
      options: { sort: { createdAt: -1 } }
    })
    .sort({ createdAt: -1 });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { text, author, parentId } = await request.json();

    // Clean the author name before saving
    const cleanAuthor = author.replace(/^["']|["']$/g, '').trim();

    const comment = await Comment.create({
      text,
      author: cleanAuthor,
      postId: params.slug,
      parentId,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: []
    });

    if (parentId) {
      await Comment.findByIdAndUpdate(
        parentId,
        { $push: { replies: comment._id } },
        { new: true }
      ).populate('replies');
    }

    // Return populated comment
    const populatedComment = await Comment.findById(comment._id).populate('replies');
    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}