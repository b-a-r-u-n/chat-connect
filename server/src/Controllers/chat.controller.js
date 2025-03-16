import { Chat } from "../Models/chat.model.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponce } from "../Utils/apiResponce.js";
import { asyncHandler } from "../Utils/asyncHandler.js";


const createChat = asyncHandler(async (req, res) => {
    const { anotherUserId } = req.body;
    console.log("anotherUserId",anotherUserId);
    

    const selfUserId = req.user?._id.toString();

    const isChatExist = await Chat.findOne({
        members: {
            $all: [selfUserId, anotherUserId]
        }
    })

    if(isChatExist){
        return res
        .status(200)
        .json(
            new apiResponce(200, "Chat already exist!", isChatExist)
        )
    }

    const chat = await Chat.create({
        members: [selfUserId, anotherUserId]
    })

    if(!chat)
        throw new apiError( 400, "Failed to create chat");

    res
    .status(200)
    .json(
        new apiResponce(200, "Chat created Successful", chat)
    )
})

const getAllUsersChats = asyncHandler(async (req, res) => {
    const id = req.user?._id.toString();

    const chat = await Chat.find({
        members: {$in: [id]}
    })
    // console.log(chat); 
    
    if(!chat)
        throw new apiError(400, "Failed to get Users chats");

    res
    .status(200)
    .json(
        new apiResponce(200, "User chats", chat)
    )
})

const getOneUserChat = asyncHandler(async (req, res) => {
    // ID of the user to start a chat with
    const anotherUserId = req.params.anotherUserId;

    // Logged in user id
    const userId = req.user?._id.toString();

    const chat = await Chat.findOne({
        members: {
            $all: [userId, anotherUserId]
        }
    })

    if(!chat)
        throw new apiError(400, "Failed to get User chat");

    res
    .status(200)
    .json(
        new apiResponce(200, "User chat", chat)
    )

})

export {
    createChat,
    getAllUsersChats,
    getOneUserChat
}