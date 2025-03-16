import express from 'express'
import { upload } from '../Middlewares/multer.middleware.js';
import { loginUser, logoutUser, registerUser } from '../Controllers/auth.controller.js';

const router = express.Router();

router.route("/register").post(
    upload.fields([
        {
            name: 'profileImage',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export default router;