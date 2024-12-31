import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";
import User from "./models/user.model";
import { connectDB } from "./db";

export async function auth(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Authorization header missing or malformed");
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      console.error("Token verification failed");
      return null;
    }

    await connectDB();
    const user = await User.findById(decoded.userId)
      .select("-password -__v")
      .lean();

    if (!user) {
      console.error("User not found");
      return null;
    }
    return user;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return null;
  }
}
