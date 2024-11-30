// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import Connection from "@/lib/models/connection";

export async function GET(req: NextRequest) {
  try {
    const user = (await auth(req)) as { _id: string };
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get pending connection requests for the current user
    const notifications = await Connection.find({
      recipient: user._id,
      status: "pending",
    })
      .populate("requester", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    const formattedNotifications = notifications.map((notification) => ({
      _id: notification._id,
      requester: {
        _id: notification.requester._id,
        name: notification.requester.name,
        avatar: notification.requester.avatar,
      },
      status: notification.status,
      createdAt: notification.createdAt,
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
