import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"

const verification = async(req, res, next) => {
    try {
        const token = req.cookies?.token
    
        if(!token){
            return res.status(400).json({
                message:"Invalid User",
                status:400
            })
        }
    
        const check = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!check){
            return res.status(400).json({
                status:400,
                message:'Invalid Token Request'
            })
        }
        const user = await User.findById(check._id).populate('messages') 
        req.user = user
        return next()
    } catch (error) {
        console.log('Error in Verification module', error.message)
        res.status(500).json({
            message:"Internal Error Occurred",
            status:500
        })
    }
}

export {verification}