import express from 'express';
import { createChat, getAllUsersChats, getOneUserChat } from '../Controllers/chat.controller.js';
import { verifyJWT } from '../Middlewares/auth.middleware.js';

const router = express.Router();

router.route("/").post(verifyJWT, createChat);
router.route("/").get(verifyJWT, getAllUsersChats);
router.route("/find/:anotherUserId").get(verifyJWT, getOneUserChat);

export default router;