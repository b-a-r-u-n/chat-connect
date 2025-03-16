import { User } from "../Models/user.model.js";
import { apiError } from "../Utils/apiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log(token);
        
        if (!token)
            throw new apiError(401, "Unauthorized Access...");
    
        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(verifyToken._id).select("-password -refreshToken");
        if (!user)
            throw new apiError(401, "Invalid access token");
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error);
    }
})

export {verifyJWT}