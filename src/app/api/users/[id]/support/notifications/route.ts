// app/api/users/[id]/support/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/lib/models/notifications";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const user = (await auth(req)) as { _id: string } | null;

  // Ensure the user is authenticated and is accessing their own notifications
  if (!user || user._id.toString() !== params.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notifications = await Notification.find({
      receiver: params.id,
      type: "support",
    })
      .populate("sender", "name avatar")
      .populate("project", "title");

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching support notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
