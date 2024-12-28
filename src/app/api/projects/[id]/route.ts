import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/project.model";
import { uploadImage } from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import mongoose from "mongoose";

interface UpdateData {
  firstName?: string;
  lastName?: string;
  title?: string;
  objective?: string;
  description?: string;
  category?: string;
  duration?: {
    startDate: string;
    endDate: string;
  };
  otherSupport?: string;
  location?: {
    type: string;
    address: string;
    coordinates?: number[];
  };
  supportItems?: Array<{
    item: string;
    quantity: number;
    byWhen: string;
    dropLocation: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );
    }

    const project = await Project.findById(params.id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const user = (await auth(new NextRequest(request.url, request))) as { _id: string };
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // Since we're using FormData, we need to parse it differently
    const formData = await request.formData();
    
    // Log the received data for debugging
    console.log("Received form data:", Object.fromEntries(formData.entries()));

    // Get all the form fields
    const updateData: UpdateData = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      title: formData.get("title")?.toString() || "",
      objective: formData.get("objective")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      category: formData.get("category")?.toString() || "",
      duration: {
        startDate: formData.get("startDate")?.toString() || "",
        endDate: formData.get("endDate")?.toString() || ""
      },
      otherSupport: formData.get("otherSupport")?.toString() || "",
    };

    // Handle location data
    const address = formData.get("address")?.toString() || "";
    const coordinatesStr = formData.get("coordinates")?.toString();
    if (address || coordinatesStr) {
      updateData.location = {
        type: "Point",
        address: address,
        coordinates: coordinatesStr ? JSON.parse(coordinatesStr) : undefined
      };
    }

    // Handle support items
    const supportItemsStr = formData.get("supportItems");
    if (supportItemsStr) {
      updateData.supportItems = JSON.parse(supportItemsStr as string);
    }

    // Verify project exists and user is creator
    const existingProject = await Project.findOne({
      _id: params.id,
      creator: user._id // Changed from "creator._id" to "creator"
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    console.log("Update data being applied:", updateData);

    // Update project using mongoose Model
    const result = await Project.findByIdAndUpdate(
      params.id,
      {
        $set: updateData
      },
      { new: true, runValidators: true }
    );

    if (!result) {
      throw new Error("Project update failed");
    }

    return NextResponse.json({ success: true, project: result });
  } catch (error) {
    console.error("Failed to update project:", error);
    // Send more detailed error information
    return NextResponse.json(
      { 
        error: "Failed to update project", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const user = (await auth(new NextRequest(request.url, request))) as { _id: string };
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const project = await Project.findOneAndDelete({
      _id: params.id,
      creator: user._id
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
