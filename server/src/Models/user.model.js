import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    userName:{
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    profileImage:{
        type: String
    },
    coverImage:{
        type: String
    },
    about:{
        type: String
    },
    relationship:{
        type: String,
        // enum: ['single', 'married', 'divorced'],
        // default: 'single'
    },
    livesIn:{
        type: String
    },
    worksAt:{
        type: String
    },
    country:{
        type: String
    },
    // followers:{
    //     type: Array,
    //     default: []
    // },
    // following:{
    //     type: Array,
    //     default: []
    // },
    refreshToken:{
        type: String
    }
},{
    timestamps: true
})

userSchema.pre('save', async function(next) {
    if(!this.isModified("password"))
        next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
      }, 
      process.env.ACCESS_TOKEN_SECRET, 
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      });
}

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign({
        _id: this._id
      }, 
      process.env.REFRESH_TOKEN_SECRET, 
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      });
}

export const User = mongoose.model("User", userSchema);
