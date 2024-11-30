// app/api/connections/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";
import Connection from "@/lib/models/connection";
import User from "@/lib/models/user.model";

// app/api/connections/[id]/route.ts

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await auth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    await connectDB();

    const connection = await Connection.findById(params.id);
    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    // Update connection status
    connection.status = status;
    await connection.save();

    if (status === "accepted") {
      // Add users to each other's connections array
      await User.findByIdAndUpdate(connection.requester, {
        $addToSet: { connections: connection.recipient },
      });

      await User.findByIdAndUpdate(connection.recipient, {
        $addToSet: { connections: connection.requester },
      });
    }

    return NextResponse.json({ connection });
  } catch (error) {
    console.error("Connection update error:", error);
    return NextResponse.json(
      { error: "Failed to update connection" },
      { status: 500 }
    );
  }
}
