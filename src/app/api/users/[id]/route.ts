// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import User from "@/lib/models/user.model";
import { Project } from "@/lib/models/project.model";
import Connection from "@/lib/models/connection";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = (await auth(req)) as { _id: string } | null;
    await connectDB();
    const { id } = params;

    // Get user data and their projects
    const [user, projects] = await Promise.all([
      User.findById(id)
        .select("-password -verificationToken -resetPasswordToken")
        .populate("connections", "name avatar"),
      Project.find({ creator: id }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get connection status if logged in user
    let connectionStatus = null;
    if (currentUser && currentUser._id.toString() !== id) {
      const connection = await Connection.findOne({
        $or: [
          { requester: currentUser._id, recipient: id },
          { requester: id, recipient: currentUser._id },
        ],
      });

      if (connection) {
        connectionStatus = connection.status;
      }
    }

    // Increment profile views only for other users
    if (currentUser?._id.toString() !== id) {
      user.profileViews += 1;
      await user.save();
    }

    return NextResponse.json({
      user: {
        ...user.toObject(),
        connectionStatus,
        connectionsCount: user.connections.length,
      },
      projects,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
