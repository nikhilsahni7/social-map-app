import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/project.model";
import { uploadImage } from "@/lib/cloudinary";
import { auth } from "@/lib/auth";

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  try {
    const user = (await auth(req)) as { _id: string };
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const formData = await req.formData();

    // Handle image upload
    const image = formData.get("pictureOfSuccess") as File;
    let imageData = null;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${image.type};base64,${buffer.toString(
        "base64"
      )}`;
      imageData = await uploadImage(base64Image);
    }

    const projectData = {
      creator: user._id,
      title: formData.get("title"),
      objective: formData.get("objective"),
      description: formData.get("description"),
      category: formData.get("category"),
      duration: {
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
      },
      location: {
        type: "Point",
        coordinates: [
          parseFloat(formData.get("longitude") as string),
          parseFloat(formData.get("latitude") as string),
        ],
        address: formData.get("address"),
      },
      pictureOfSuccess: imageData,
      supportItems: JSON.parse(formData.get("supportItems") as string),
      otherSupport: formData.get("otherSupport"),
    };

    const project = await Project.create(projectData);

    return NextResponse.json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/projects - Fetch all projects
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const projects = await Project.find().populate("creator", "name email");

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
