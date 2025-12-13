import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true,
            unique: true
        },
        userPassword: {
            type: String,
            required: true
        },
        userPhone: {
            type: String,
            required: false,
            default: ""
        },
        dateOfBirth: {
            type: Date,
            required: false
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: false
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
)

const userModel = mongoose.model("smilecare-users", userSchema)

export default userModel