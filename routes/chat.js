import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getChats, sendMessage } from "../controllers/chat.js";

const router = express.Router();

// read
router.get("/getchats", verifyToken, getChats);

// update
router.patch("/sendmessage", verifyToken, sendMessage);

export default router;