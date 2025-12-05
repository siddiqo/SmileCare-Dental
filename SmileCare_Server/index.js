import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

import userModel from "./models/userModel.js"


const UTAS_Post_App = new express()
UTAS_Post_App.use(express.json())
UTAS_Post_App.use(cors())

dotenv.config()

//Connection to MongoDB
try {
    const UTAS_Post_App_ConnectionString = `mongodb+srv://${process.env.MONGODB_USERID}:${process.env.MONGODB_PASSWORD}@cluster0.uqhgnwr.mongodb.net/${process.env.MONGODB_DATABASE}`
    mongoose.connect(UTAS_Post_App_ConnectionString)
    console.log("Database Connection Success !")
} catch (err) {
    console.log(err)
}


// Listener
UTAS_Post_App.listen(process.env.PORT, () => {
    try {
        console.log(`UTAS Post Server running at port ${process.env.PORT} ...!`)
    } catch (err) {
        console.log(err)
    }
})

//Register a new user with encrypted password
UTAS_Post_App.post("/userRegister", async (req, res) => {
    try {
        const userExist = await userModel.findOne({ userEmail: req.body.email })
        if (userExist) {
            res.send("User already exist !")
            //res.json({serverMsg : "User already exist !", flag : false})
        } else {
            const encrypredPassword = await bcrypt.hash(req.body.pwd, 10)
            const newUser = {
                userName: req.body.fullName,
                userGender: req.body.gender,
                userDoB: req.body.dob,
                userDept: req.body.dept,
                userEmail: req.body.email,
                userPassword: encrypredPassword,
                userProfilePic: req.body.profilePic
            }
            await userModel.create(newUser)
            res.send("Registration Success !")
            //res.json({serverMsg : "Registration Success !", flag : true})
        }
    } catch (err) {
        console.log(err)
    }
})


//Login verification
UTAS_Post_App.post("/userLogin", async (req, res) => {
    try {
        const user = req.body.userEmail
        const userExist = await userModel.findOne({ userEmail: user })
        if (!userExist) {
            //res.send("User not found !")
            res.json({serverMsg : "User not found !", loginStatus : false})
        } else {
            const matchPassword = await bcrypt.compare(req.body.userPassword, userExist.userPassword)
            if (!matchPassword) {
                //res.send("Incorrect Password !")
                res.json({serverMsg : "Incorrect Password !", loginStatus : false})
            } else {
                //res.send("Welcome")
                //res.send("Welcome : " + userExist.userName)
                res.json({serverMsg : "Welcome", user : user})
            }
        }
    } catch (err) {
        console.log(err)
    }
})
