import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        title:{
            type:String
        },
        likes: [],
        postImage:{
            type:String
        }
    },
    {
        timestamps: true,
    }
)

export const Post = mongoose.model("Post", postSchema);