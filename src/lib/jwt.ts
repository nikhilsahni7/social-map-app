import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export const createToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d", // 30 days
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};
