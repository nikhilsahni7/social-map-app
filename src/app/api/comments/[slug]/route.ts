import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/comment.model";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Invalid slug' },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ postId: slug, parentId: null })
      .populate({
        path: 'replies',
        populate: { path: 'replies' },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
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
    const { slug } = params;
    const body = await request.json();
    const { text, author, parentId } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Invalid slug' },
        { status: 400 }
      );
    }

    const newComment = new Comment({
      text,
      author,
      postId: slug,
      parentId,
    });

    await newComment.save();

    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: newComment._id },
      });
    }

    return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}