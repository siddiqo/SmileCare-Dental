import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: { type: "string", required: true },
        userGender: { type: "string", required: true, default: "M" },
        userDoB: { type: "date", required: true },
        userDept: { type: "string", required: true },
        userEmail: { type: "string", required: true },
        userPassword: { type: "string", required: true },
        userProfilePic: { type: "string", required: false, default : "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png" }
    },
    {
        versionKey: false
    }
)

const userModel = new mongoose.model("utas-post-users", userSchema)

export default userModel