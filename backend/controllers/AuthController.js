import { User } from "../models/User.model.js"
import jwt from "jsonwebtoken"
import uniqueId from "generate-unique-id"

const signin = async(req, res) => {
    try {
        const {name, email} = req.body
        if(!name || !email){
            return res.status(400).json({
                status:400,
                message:"Values cannot be blank"
            })
        }
    
        let UserExistAuthentication;
        UserExistAuthentication = await User.findOne({email}).populate('messages')
        if(!UserExistAuthentication){
            UserExistAuthentication = new User({
                username:name,
                email:email,
                uniqueId : uniqueId(),
                isAcceptingMessages:true
            })
            await UserExistAuthentication.save()
        }
    
        const token = jwt.sign(
            {_id:UserExistAuthentication._id, 
            username:UserExistAuthentication.username,
            email:UserExistAuthentication.email
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn:"1d",
            }
        )
    
        res.cookie('token', token)
        res.status(200).json({
            status:200,
            message:"User Authentication SuccessFull",
            user:{
                username : UserExistAuthentication.username,
                email:UserExistAuthentication.email,
                uniqueId: UserExistAuthentication.uniqueId,
                messages:UserExistAuthentication.messages,
                isAcceptingMessages:UserExistAuthentication.isAcceptingMessages
                }
        })
    } catch (error) {
        console.log(`Error in the Authentication module ${error.message}`)
        res.status(500).json({
            status:500,
            message:"Internal Error Occurred"
        })
    }
}

const logout = async(req, res) => {
    try {
        res.clearCookie('token')
        res.status(200).json({
            message:"LogOut SuccessFull",
            status:200
        })
    } catch (error){
        console.log("Error Occurred In LogOut Controller", error.message)
        res.status(400).json({
            message:"Internal Error Occurred",
            status:400
        })
    }
}

export {signin, logout}