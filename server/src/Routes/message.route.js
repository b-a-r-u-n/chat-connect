import express from 'express';
import { addMessage, getMessage } from '../Controllers/message.controller.js';

const router = express.Router();

router.route("/").post(addMessage);
router.route("/:chatId").get(getMessage);

export default router;