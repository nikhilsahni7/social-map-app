// app/api/projects/[id]/support/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/project.model";
import { auth } from "@/lib/auth";
import Notification from "@/lib/models/notifications";
import User from "@/lib/models/user.model";

interface SupportItem {
  item: string;
  quantity: string;
  byWhen: string;
  dropLocation: string;
  supportProvided: number;
}

interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    const user = (await auth(new NextRequest(request.url, request))) as unknown as AuthUser;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { supportItems, additionalSupport } = await request.json();

    const project = await Project.findById(params.id).populate("creator");
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update support counts
    project.supportItems = project.supportItems.map((item: SupportItem) => {
      const supportAmount = supportItems[item.item] || 0;
      return {
        ...item,
        supportProvided: (item.supportProvided || 0) + supportAmount
      };
    });

    await project.save();

    // Create notification
    const sender = await User.findById(user._id);
    const supportSummary = Object.entries(supportItems as Record<string, number>)
      .filter(([_, qty]) => qty > 0)
      .map(([item, qty]) => `${qty}x ${item}`)
      .join(", ");

    const message = `${sender.name} has supported your project "${project.title}" with ${supportSummary}${
      additionalSupport ? ` and offered additional support: ${additionalSupport}` : ''
    }`;

    const notification = new Notification({
      sender: user._id,
      receiver: project.creator._id,
      project: project._id,
      type: "support",
      message,
      additionalSupport
    });

    await notification.save();

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Support error:", error);
    return NextResponse.json(
      { error: "Failed to process support" },
      { status: 500 }
    );
  }
}
