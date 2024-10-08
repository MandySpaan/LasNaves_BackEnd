import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../database/entities/users/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
// The "your_jwt_secret" can be set as a fallback value in case the .env is not set

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function authToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send({ message: "No token found" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(403)
          .send({ message: "Your session has expired, please login again" });
      }
      return res.status(403).send({ message: "Invalid token" });
    }
    req.user = user as { userId: string; email: string };
    next();
  });
}

export async function isAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  if (user.role !== "admin" && user.role !== "superAdmin") {
    return res
      .status(403)
      .send({ message: "Unauthorized, you need to be admin for this" });
  }
  next();
}

export async function isSuperAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.user?.userId;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  if (user.role !== "superAdmin") {
    return res
      .status(403)
      .send({ message: "Unauthorized, you need to be super admin for this" });
  }
  next();
}
