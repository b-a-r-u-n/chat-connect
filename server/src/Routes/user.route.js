import express from 'express';
import { deleteUser, followUser, getAllUsers, getSearchUser, getUser, unFollowUser, updateUserDetails, updateUserPassword } from '../Controllers/user.controller.js';
import { verifyJWT } from '../Middlewares/auth.middleware.js';
import { upload } from '../Middlewares/multer.middleware.js';

const router = express.Router();

router.route("/getallusers").get(verifyJWT, getAllUsers);
router.route("/:id").get(verifyJWT, getUser);
router.route("/search/:name").get(getSearchUser);
router.route("/update-details/:id").put(verifyJWT,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    updateUserDetails);
router.route("/update-password/:id").put(verifyJWT, updateUserPassword);
router.route("/:id").delete(verifyJWT, deleteUser);
router.route("/:id/follow").put(verifyJWT, followUser);
router.route("/:id/unfollow").put(verifyJWT, unFollowUser);

export default router;