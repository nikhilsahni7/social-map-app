// app/api/projects/[id]/support/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import Notification from "@/lib/models/notifications";
import { Project } from "@/lib/models/project.model";
import User from "@/lib/models/user.model";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = (await auth(req)) as { _id: string };
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    connectDB();

    const project = await Project.findById(params.id).populate("creator");
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { supportItems } = await req.json();

    // Create notification message
    const sender = await User.findById(
      Array.isArray(user) ? user[0]._id : user._id
    );
    const receiver = project.creator;

    const supportSummary = Object.entries(supportItems)
      .map(([item, qty]) => `${qty}x ${item}`)
      .join(", ");

    const message = `${sender.name} has supported your project "${project.title}" with ${supportSummary}`;

    // Create a new notification
    const notification = new Notification({
      sender: sender._id,
      receiver: receiver._id,
      project: project._id,
      type: "support",
      message,
    });

    await notification.save();

    return NextResponse.json({ message: "Support sent successfully" });
  } catch (error) {
    console.error("Support error:", error);
    return NextResponse.json(
      { error: "Failed to send support" },
      { status: 500 }
    );
  }
}
