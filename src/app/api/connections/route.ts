// app/api/connections/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import Connection from "@/lib/models/connection";
import User from "@/lib/models/user.model";

export async function POST(req: NextRequest) {
  try {
    const user = (await auth(req)) as { _id: string };
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId } = await req.json();
    await connectDB();

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: user._id, recipient: recipientId },
        { requester: recipientId, recipient: user._id },
      ],
    });

    if (existingConnection) {
      return NextResponse.json(
        {
          error: "Connection already exists",
          status: existingConnection.status,
        },
        { status: 400 }
      );
    }

    // Create new connection
    const connection = await Connection.create({
      requester: user._id,
      recipient: recipientId,
    });

    return NextResponse.json({ connection });
  } catch (error) {
    console.error("Connection create error:", error);
    return NextResponse.json(
      { error: "Failed to send connection request" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = (await auth(req)) as { _id: string };
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user's connections
    const connections = await Connection.find({
      $or: [{ requester: user._id }, { recipient: user._id }],
    })
      .populate("requester recipient", "name avatar")
      .lean();

    return NextResponse.json({ connections });
  } catch (error) {
    console.error("Connections fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}
