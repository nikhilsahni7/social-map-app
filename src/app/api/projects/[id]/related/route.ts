// src/app/api/projects/[id]/related/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/project.model";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );
    }

    // Find the current project
    const currentProject = await Project.findById(params.id);

    if (!currentProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Find other projects by the same creator, excluding the current project
    const relatedProjects = await Project.find({
      creator: currentProject.creator,
      _id: { $ne: currentProject._id },
    }).limit(5);
    return NextResponse.json(relatedProjects);
  } catch (error) {
    console.error("Failed to fetch related projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch related projects" },
      { status: 500 }
    );
  }
}
