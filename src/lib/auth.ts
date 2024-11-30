import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";
import User from "./models/user.model";
import { connectDB } from "./db";

export async function auth(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded?.userId) return null;

    await connectDB();
    const user = await User.findById(decoded.userId)
      .select("-password -__v")
      .lean();

    if (!user) return null;
    return user;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return null;
  }
}
