import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/project.model";
import mongoose from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    await connectDB();
    
    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Toggle like state and update count
    project.isLiked = !project.isLiked;
    project.likeCount = Math.max(0, project.likeCount + (project.isLiked ? 1 : -1));
    await project.save();

    return NextResponse.json({
      liked: project.isLiked,
      likeCount: project.likeCount
    });

  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 