import { Router } from "express";
import { router as authRouter } from "./database/entities/auth/auth.routes";
import { router as userRouter } from "./database/entities/users/user.routes";
import { router as roomRouter } from "./database/entities/room/room.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/room", roomRouter);

export { router };
