import { Message } from "../Models/message.model.js";
import { apiError } from "../Utils/apiError.js";
import { apiResponce } from "../Utils/apiResponce.js";
import { asyncHandler } from "../Utils/asyncHandler.js";


const addMessage = asyncHandler(async (req, res) => {
    const {chatId, senderId, text} = req.body;    

    const message = await Message.create({
        chatId,
        senderId,
        text
    })

    if(!message)
        throw new apiError(404, "Chat not found");

    res
    .status(200)
    .json(
        new apiResponce(200, "Message added successfully", message)
    )
})

const getMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    const message = await Message.find({chatId});
    // console.log(message);
    
    if(message.length === 0)
        throw new apiError(404, "Message not found");

    res
    .status(200)
    .json(
        new apiResponce(200, "Message retrieved successfully", message)
    )
})

export {
    addMessage,
    getMessage
}