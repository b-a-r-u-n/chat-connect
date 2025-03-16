import { log } from "console";
import { Follow } from "../Models/follow.model.js";
import { Post } from "../Models/post.model.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponce } from "../Utils/apiResponce.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../Utils/cloudinary.js";
import mongoose from "mongoose";

const createPost = asyncHandler(async (req, res) => {
    
    const imageLocalPath = await req.files?.postImage[0]?.path;
    // console.log(imageLocalPath);
    
    const imageUrl = await uploadOnCloudinary(imageLocalPath);
    if(!imageUrl)
        throw new apiError(400, "Failed to upload image to cloudinary");

    // console.log(imageUrl.url);
    

    const postDetails = await Post.create({
        userId: req.user?._id.toString(),
        title: req.body?.title || "",
        postImage: imageUrl?.url
    })

    if(!postDetails)
        throw new apiError(400, "Failed to create post");

    res
    .status(200)
    .json(
        new apiResponce(200, "Post Upload successfully", postDetails)
    )
})

const getPost = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const post = await Post.findOne({userId: id});

    if(!post)
        throw new apiError(404, "Post not found");    

    res
    .status(200)
    .json(
        new apiResponce(200, "Post found", post)
    )
})

const updatePost = asyncHandler(async (req, res) => {
    const id = req.params.id;

    let imageUrl;    
    if(req.files){
        if(req.files?.postImage?.[0]){
            const imageLocalPath = req.files?.postImage[0]?.path;
            imageUrl = await uploadOnCloudinary(imageLocalPath);
            if(!imageUrl)
                throw new apiError(400, "Failed to upload image to cloudinary");
        }
    }
    
    const post = await Post.findById(id);
    if(!post)
        throw new apiError(404, "Post not found");
    
    if(req.user?._id.toString() !== post.userId.toString())
        throw new apiError(401, "You are not authorized to update this post");

    const updatedPost = await Post.findByIdAndUpdate(
        post._id,
        {
            $set: {
                title: req.body?.title || post.title,
                postImage: imageUrl?.url || post.postImage,
            }
        },
        {
            new: true
        }
    )

    await deleteFromCloudinary(post.postImage);

    res
    .status(200)
    .json(
        new apiResponce(200, "Post updated successfully", updatedPost)
    )
})

const deletePost = asyncHandler(async (req, res) => {
    //post id
    const id = req.params.id;

    const post = await Post.findById(id);
    if(!post)
        throw new apiError(404, "Post not found");
    
    if(req.user?._id.toString() !== post.userId.toString())
        throw new apiError(401, "You are not authorized to delete this post");

    await Post.findByIdAndDelete(post._id);
    
    deleteFromCloudinary(post.postImage);

    res
    .status(200)
    .json(
        new apiResponce(200, "Post deleted successfully", {})
    )
})

const likeAndDislikePost = asyncHandler(async (req, res) => {
    //Post id
    const id = req.params.id;

    const post = await Post.findById(id);
    if(!post)
        throw new apiError(404, "Post not found");

    if(!post.likes.includes(req.user?._id.toString())){
        await post.updateOne(
            {
                $push: {
                    likes: req.user?._id.toString()
                }
            }
        )

        res
        .status(200)
        .json(
            new apiResponce(200, "Post liked successfully", {})
        )
    }
    else{
        await post.updateOne({
            $pull: {
                likes: req.user?._id.toString()
            }
        })

        res
        .status(200)
        .json(
            new apiResponce(200, "Post disliked successfully", {})
        )
    }
})

const getTimeLinePosts = asyncHandler(async (req, res) => {
    //User id
    const userId = req.params.id;

    //Get User posts from database
    let posts = await Post.find({userId});
    

    posts = posts.map((post) => ({
        ...post._doc,
        // isLiked: post.likes?.some((likedId) => likedId.tostring() === req.user?._id.toString()) || false
        isLiked: post.likes?.includes(req.user?._id.toString())
    }));


    //Get following User's posts from database
    let followingPosts = await Follow.aggregate([
        {
            $match: {
                followers: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "following",
                foreignField: "userId",
                as: "followingUser"
            }
        },
        {
            $unwind: "$followingUser"
        },
        {
            $replaceRoot: {
                newRoot: "$followingUser"
            }
        },
        {
            $project:{
                _id:1,
                userId:1,
                title:1,
                likes:1,
                postImage:1,
                followingUser:1,
                createdAt:1,
                updatedAt:1,
                followingUserDetails:1
            }
        }
    ])

    followingPosts = followingPosts.map((post) => ({
        ...post,
        // isLiked: post.likes?.some((likedId) => likedId.tostring() === req.user?._id.toString()) || false
        isLiked: post.likes?.includes(req.user?._id.toString())
    }));

    let allPost = [...posts, ...followingPosts];
    
    allPost.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    })

    res
    .status(200)
    .json(
        new apiResponce(200, "Posts found", allPost)
    )
})


export {
    createPost,
    getPost,
    updatePost,
    deletePost,
    likeAndDislikePost,
    getTimeLinePosts
}