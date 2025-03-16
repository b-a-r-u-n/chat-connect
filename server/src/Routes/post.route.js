import express from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { createPost, deletePost, getPost, getTimeLinePosts, likeAndDislikePost, updatePost } from "../Controllers/post.controller.js";

const router = express.Router();

router.route("/").post(
    upload.fields([
        {
            name: "postImage",
            maxCount: 1
        }
    ]),
    verifyJWT,
    createPost
)
router.route("/:id").get(getPost);
router.route("/:id").put(
    upload.fields([
        {
            name: "postImage",
            maxCount: 1
        }
    ]),
    verifyJWT,
    updatePost
);
router.route("/:id").delete(verifyJWT, deletePost);
router.route("/:id/like").put(verifyJWT, likeAndDislikePost);
router.route("/:id/timelinepost").get(verifyJWT, getTimeLinePosts);

export default router;