import { User } from "../Models/user.model.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponce } from "../Utils/apiResponce.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(!user)
            return apiError(404, "User not found");
    
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        if(!accessToken)
            return apiError(500, "Failed to generate access token");
        if(!refreshToken)
            return apiError(500, "Failed to generate refresh token");
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new apiError(400, error);
    }
}


const registerUser = asyncHandler(async (req, res) => {    

    const {userName, email, password, firstName, lastName} = req.body;
    if(!firstName?.trim())
        throw new apiError(400, "First Name is required");
    if(!lastName?.trim())
        throw new apiError(400, "Last Name is required");
    if(!userName?.trim())
        throw new apiError(400, "User Name is required");
    if(!email?.trim())
        throw new apiError(400, "Email is required");
    if(!password?.trim())
        throw new apiError(400, "Password is required");

    const isEmailExist = await User.findOne({email});
    const isUserNameExist = await User.findOne({userName});
    if(isEmailExist)
        throw new apiError(400, "Email already exist");
    if(isUserNameExist)
        throw new apiError(400, "User Name already exist");

    let profileImageLocalPath;
    let coverImageLocalPath;
    let profileImageURL;
    let coverImageURL;

    if(req?.files){
        profileImageLocalPath = req.files?.profileImage[0]?.path;
        coverImageLocalPath = req.files?.coverImage[0]?.path;

        profileImageURL = await uploadOnCloudinary(profileImageLocalPath);
        coverImageURL = await uploadOnCloudinary(coverImageLocalPath);
        if(!profileImageURL)
            throw new apiError(400, "Error while upload profile image.");
        if(!coverImageURL)
            throw new apiError(400, "Error while upload cover image.");
    }

    const user = await User.create({
        userName,
        email,
        password,
        firstName,
        lastName,
        profileImage: profileImageURL?.url || "https://res.cloudinary.com/barun0989/image/upload/v1726812298/samples/people/boy-snow-hoodie.jpg",
        coverImage: coverImageURL?.url || "https://res.cloudinary.com/barun0989/image/upload/v1726812298/samples/bike.jpg",
        about: "",
        relationship: "",
        livesIn: "",
        worksAt: "",
    })
    if(!user)
        throw new apiError(400, "Error while creating user.");

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    res
    .status(200)
    .json(
        new apiResponce(200, "User created successfully.", createdUser)
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // console.log("req.body",req.body);
    
    if(!email)
        throw new apiError(400, "Email is required");
    if(!password)
        throw new apiError(400, "Password is required");

    const user = await User.findOne({email});
    if(!user)
        throw new apiError(400, "Invalid email");

    const isCorrect = await user.isPasswordCorrect(password);
    if(!isCorrect)
        throw new apiError(400, "Invalid password");

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -profileImage -coverImage -about -relationship -livesIn -worksAt -followers -following");

    //localhost
    // const options = {
    //     httpOnly: true,  // ✅ Prevents XSS attacks
    //     secure: false,    // ✅ Required for `SameSite: None` (use HTTPS in production)
    //     // sameSite: 'None', // ✅ Allows cross-origin requests
    //     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7-day expiration
    // };

    //production
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponce(200, "Logged in successfully.", {user: loggedInUser, accessToken, refreshToken})
    )
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                accessToken: "",
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }
    res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new apiResponce(200, "Logged out successfully.", {})
    )
})

export {
    registerUser,
    loginUser,
    logoutUser
}