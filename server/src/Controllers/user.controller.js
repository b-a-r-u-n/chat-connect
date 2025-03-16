import { Follow } from "../Models/follow.model.js";
import { User } from "../Models/user.model.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponce } from "../Utils/apiResponce.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import mongoose from "mongoose";
import { deleteFromCloudinary, uploadOnCloudinary } from "../Utils/cloudinary.js";

const getAllUsers = asyncHandler(async (req, res) => {

    let users = await User.aggregate([
        {
            $lookup:{
                from: "follows",
                localField: "_id",
                foreignField: "following",
                as: "followers"
            }
        },
        {
            $lookup:{
                from: "follows",
                localField: "_id",
                foreignField: "followers",
                as: "followedTo" 
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "userId",
                as: "posts"
            }
        },
        {
            $addFields:{
                followersCount: {
                    $size: "$followers"
                }
            }
        },
        {
            $addFields:{
                followedToCount: {
                    $size: "$followedTo"
                }
            }
        },
        {
            $addFields: {
                totalPosts: {
                    $size: "$posts"
                }
            }
        },
        {
            $addFields: {
              isFollowed: {
                $cond: {
                  if: { $in: [req.user?._id, "$followers.followers"] },
                  then: true,
                  else: false
                }
              }
            }
          },
        {
            $project:{
                userName:1,
                email:1,
                firstName:1,
                lastName:1,
                isAdmin:1,
                profileImage:1,
                coverImage:1,
                about:1,
                relationship:1,
                livesIn:1,
                worksAt:1,
                followersCount:1,
                followedToCount:1,
                followers:1,
                followedTo:1,
                totalPosts:1,
                isFollowed:1,
                country:1
            }
        }
    ])
    
    users = users.filter((user) => user._id?.toString() !== req.user?._id?.toString())
    if (!users)
        throw new apiError(res, 404, "No users found");

    res
    .status(200)
    .json(
        new apiResponce(200, "Users found successfully", users)
    )

})

const getUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    // const user = await User.findById(id).select("-password -refreshToken -isAdmin -profileImage -coverImage -about -relationship -livesIn -worksAt -followers -following");
    // if (!user)
    //     throw new apiError(404, "User not found");

    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup:{
                from: "follows",
                localField: "_id",
                foreignField: "following",
                as: "followers"
            }
        },
        {
            $lookup:{
                from: "follows",
                localField: "_id",
                foreignField: "followers",
                as: "followedTo" 
            }
        },
        {
            $lookup: {
                from: "posts",
                localField: "_id",
                foreignField: "userId",
                as: "posts"
            }
        },
        {
            $addFields:{
                followersCount: {
                    $size: "$followers"
                }
            }
        },
        {
            $addFields:{
                followedToCount: {
                    $size: "$followedTo"
                }
            }
        },
        {
            $addFields: {
                totalPosts: {
                    $size: "$posts"
                }
            }
        },
        {
            $addFields: {
              isFollowed: {
                $cond: {
                  if: { $in: [req.user?._id, "$followers.followers"] },
                  then: true,
                  else: false
                }
              }
            }
          },
        {
            $project:{
                userName:1,
                email:1,
                firstName:1,
                lastName:1,
                isAdmin:1,
                profileImage:1,
                coverImage:1,
                about:1,
                relationship:1,
                livesIn:1,
                worksAt:1,
                followersCount:1,
                followedToCount:1,
                followers:1,
                followedTo:1,
                totalPosts:1,
                isFollowed:1,
                country:1
            }
        }
    ])

    if (!user)
        throw new apiError(404, "User not found");
    
    res
    .status(200)
    .json(
        new apiResponce(200, "User found", user[0])
    )
})

const getSearchUser = asyncHandler(async (req, res) => {
    const name = req.params.name;    

    const users = await User.aggregate([
        {
            $addFields:{
                fullName:{
                    $concat: [
                        {$trim: { input: "$firstName" }},
                        {$trim: { input: "$lastName" }}
                    ]
                }
            }
        },
        {
            $match:{
                $or: [
                    { fullName: {$regex: name, $options: "i"}},
                    { firstName: {$regex: name, $options: "i"}},
                    { lastName: {$regex: name, $options: "i"}},
                    { userName: {$regex: name, $options: 'i'}}
                ]
            }
        },
        {
            $project: {
                _id: 1,
                userName: 1,
                fullName: 1,
                profileImage: 1,
                firstName: 1,
                lastName: 1,
            }
        }
    ])

    if(users.length === 0)
        throw new apiError(404, "User not found");
    
    res
    .status(200)
    .json(
        new apiResponce(200, "Users found", users)
    )
    
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const id = req.params.id;
    
    const user = await User.findById(req.user._id);
    
    if (!user)
        throw new apiError(404, "Unauthorized Access!!");

    // if(id !== user._id.toString() || user.isAdmin !== false)
    //     throw new apiError(403, "You are not authorized to update this user!!");
    
    let coverImageURL;
    let profileImageURL;
    if(req.files){
        if(req.files?.coverImage?.[0]){
            const coverImageLocalPath = req.files?.coverImage[0]?.path;
            coverImageURL = await uploadOnCloudinary(coverImageLocalPath);
            if(!coverImageURL)
                throw new apiError(400, "Error while uploading cover image");
        }
        if(req.files?.profileImage?.[0]){
            const profileImageLocalPath = req.files?.profileImage[0]?.path;
            profileImageURL = await uploadOnCloudinary(profileImageLocalPath);
            if(!profileImageURL)
                throw new apiError(400, "Error while uploading cover image");
        }
        // const coverImageLocalPath = req.files?.coverImage[0]?.path;
        // const profileImageLocalPath = req.files?.profileImage[0]?.path;

        // coverImageURL = await uploadOnCloudinary(coverImageLocalPath);
        // profileImageURL = await uploadOnCloudinary(profileImageLocalPath);
        // if(!coverImageURL)
        //     throw new apiError(400, "Error while uploading cover image");
        // if(!profileImageURL)
        //     throw new apiError(400, "Error while uploading profile image");
    }

    // console.log(id);
    // console.log(user._id.toString());
    

    if(id == user._id.toString() || user.isAdmin){
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                ...req.body,
                coverImage: coverImageURL?.url || user.coverImage,
                profileImage: profileImageURL?.url || user.profileImage
            },
            {
                new: true,
            }
        ).select("-password -refreshToken -isAdmin -about -relationship -livesIn -worksAt -followers -following");

        if(!updatedUser)
            throw new apiError(400, "No user exist!!")

        await deleteFromCloudinary(user.coverImage);
        await deleteFromCloudinary(user.profileImage);

        res
        .status(200)
        .json(
            new apiResponce(200, "User updated Successfull", updatedUser)
        )
    }
    else{
        throw new apiError(403, "You are not authorized to update this user!!");
    }
})

const updateUserPassword = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const newPassword = req.body.password;

    const user = await User.findById(req.user?._id);
    if(!user)
        throw new apiError(404, "Unauthorized access");

    if(user._id.toString() !== id)
        throw new apiError(403, "You are not authorized to update this user password!!");

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    res 
    .status(200)
    .json(
        new apiResponce(200, "Password changed successfully", {})
    )
})

const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(req.user?._id);
    if(!user)
        throw new apiError(404, "Unauthorized access");

    if(id === user?._id.toString() || user.isAdmin){
        await User.findByIdAndDelete(id);
        
        res
        .status(200)
        .json(
            new apiResponce(200, "User deleted successfully", {})
        )
    }else{
        throw new apiError(403, "You are not authorized to delete this user!!");
    }
})

const followUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if(!user)
        throw new apiError(404, "User not found");
    
    if(req.user?._id.toString() === id)
        throw new apiError(403, "You can't follow yourself!!");

    const alreadyFollowed = await Follow.findOne({
        followers: req.user?._id,
        following: id
    })

    if(alreadyFollowed)
        throw new apiError(400, "You are already following this user!!");

    await Follow.create({
        followers: req.user?._id,
        following: id
    })

    res
    .status(200)
    .json(
        new apiResponce(200, "User followed successfully", {})
    )
})

const unFollowUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if(!user)
        throw new apiError(404, "User not found");

    if(req.user?._id.toString() === id)
        throw new apiError(403, "You can't unfollow yourself!!");

    const alreadyFollowed = await Follow.findOne({
        followers: req.user?._id,
        following: id
    })

    if(!alreadyFollowed)
        throw new apiError(400, "You are not following this user!!");

    await Follow.findOneAndDelete({
        followers: req.user?._id,
        following: id
    })

    res
    .status(200)
    .json(
        new apiResponce(200, "User unfollowed successfully", {})
    )
})


export {
    getAllUsers,
    getUser,
    getSearchUser,
    updateUserDetails,
    updateUserPassword,
    deleteUser,
    followUser,
    unFollowUser
}

// const updateUserDetails = asyncHandler(async (req, res) => {
//     const id = req.params.id;
    
//     const user = await User.findById(req.user._id);
    
//     if (!user)
//         throw new apiError(404, "Unauthorized Access!!");

//     if(id !== user._id.toString() || user.isAdmin !== false)
//         throw new apiError(403, "You are not authorized to update this user!!");

//     if(req.body.password){
//         user.password = req.body.password;
//         await user.save({validateBeforeSave: true})
//         delete req.body.password;
//     }

//     console.log(req.body);
    

//     const updatedUser = await User.findByIdAndUpdate(
//         user._id,
//         req.body,
//         {
//             new: true
//         }
//     ).select("-password -refreshToken -isAdmin -profileImage -coverImage -about -relationship -livesIn -worksAt -followers -following");

//     console.log(user);
    

//     res
//     .status(200)
//     .json(
//         new apiResponce(200, "User updated Successfull", updatedUser)
//     )
// }) 