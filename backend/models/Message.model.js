import {model, Schema} from "mongoose";

const messagesSchema = new Schema({
    message:{
        type:String,
        required:true
    },
    timeStamp:{
        type:String,
        required:true
    }
})

export const Message = model('Message', messagesSchema);