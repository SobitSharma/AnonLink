import mongoose , {Schema, model} from "mongoose"

const userSchema = new Schema({
    username : {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    uniqueId:{
        type:String,
        required:true
    },
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message',
        }
    ],
    isAcceptingMessages:{
        type:Boolean,
    }
})

export const User = model('User', userSchema)