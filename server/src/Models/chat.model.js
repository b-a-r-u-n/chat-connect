import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Chat = mongoose.model("Chat", chatSchema);