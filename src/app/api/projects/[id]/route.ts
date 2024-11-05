import { NextResponse, NextRequest } from "next/server";

import { connectDB } from "@/lib/db";

import { Project } from "@/lib/models/project.model";

import { auth } from "@/lib/auth";

// GET /api/projects/[id] - Fetch a project by ID
export async function GET(req: NextRequest) {
  try {
    const user = await auth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const projects = await Project.find({ creator: user._id });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
