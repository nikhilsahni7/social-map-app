import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { token } = await req.json();

    console.log("Verification attempt:", {
      token,
      timestamp: new Date().toISOString(),
    });

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    console.log("User found:", {
      found: !!user,
      isTokenMatch: user?.verificationToken === token,
      isTokenExpired: user?.verificationTokenExpiry < new Date(),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
