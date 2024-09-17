import { User } from "../models/User.model.js"
import { Message } from "../models/Message.model.js"

function formatDate() {
    const date = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
  
    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
}

const sendMessages = async(req, res) => {
    try {
        const {id} = req.params
        const {message} = req.body 
    
        if(!message){
            return res.status(400).json({
                message:"Message Cannot be blank",
                status:400
            })
        }
    
        const user = await User.findOne({uniqueId:id})
        if(!user){
            return res.status(400).json({
                status:400,
                message:"Invalid Request as User doesnot Exists"
            })
        }

        if(!user.isAcceptingMessages){
            return res.status(400).json({
                status:400,
                message:"User is currently not Accepting the Messages"
            })
        }
    
        const newMessage = new Message({
            message:message,
            timeStamp:formatDate()
        })

        user?.messages.push(newMessage)
        
        await user.save()
        await newMessage.save()
        
        return res.status(200).json(
            {
                message:"Message Sent SucessFully",
                status:200
            }
        )
    } catch (error) {
        console.log("Error Occurred in Send Message Controller ", error.message)
        res.status(500).json({
            message:"Internal Error occurred !",
            status:500
        })
    }
}

const getMessages = async(req, res) => {
    res.status(200).json({
        status:200,
        message:"Messages fetched SucessFully",
        messages:req.user?.messages || []
    })
}

const deleteMessages = async(req, res) => {
    try {
        const {messageId} = req.params
        const user = req.user
    
        const userForDeletingMessage = await User.findByIdAndUpdate(user?._id, {
            $pull : {messages:messageId}
        }, {new:true}).populate('messages')

        await Message.findByIdAndDelete(messageId)
    
        res.status(200).json({
            message:"Message SucessFully Deleted",
            messages:userForDeletingMessage?.messages,
            status:200
        })
    } catch (error) {
        console.log("Error in Deleting Message Controller ", error.message)
        res.status(500).json({
            message:"Server Internal Error Occurred",
            status:500
        })
    }
}

const changeMessageStatus = async(req, res) => {
    try {
        const {flag} = req.params 
        let updatedFlag;
        const user = req.user
        if(flag == 'true'){
            updatedFlag=true
        }
        else{
            updatedFlag = false
        }
    
        await User.findByIdAndUpdate(user?._id, {isAcceptingMessages:updatedFlag});
        res.status(200).json({
            message:"User Accepting Messages Status Updated SuccessFully",
            status:200
        })
    } catch (error) {
        console.log("Error in Change Message Status")
        res.status(500).json({
            message:"Internal Error Occurred",
            status:500
        })
    }

}

export {sendMessages, getMessages, deleteMessages, changeMessageStatus}