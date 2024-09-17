import express from "express"
import { configDotenv } from "dotenv"
import { logout, signin } from "./controllers/AuthController.js"
import cookieParser from "cookie-parser"
import dbConnect from "./DataBase/dbConnection.js"
import { changeMessageStatus, deleteMessages, getMessages, sendMessages } from "./controllers/MessageController.js"
import { verification } from "./middlware/Tokens.middleware.js"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
configDotenv()
app.use(cookieParser())
const PORT = process.env.PORT || 3000
app.use(cors({origin:"https://main--anonmessages.netlify.app"}))

dbConnect().then((res)=>{
    if(res){
        console.log("DataBase is Connected !")
        app.post("/v1/signin", signin)
        app.post("/v1/sendmessage/:id", sendMessages)
        app.get("/v1/getmessages",verification ,getMessages)
        app.get("/v1/delete/:messageId", verification,deleteMessages )
        app.put("/v1/update/:flag", verification, changeMessageStatus)
        app.get('/v1/logout', verification, logout)
    }
    else{
        console.log("DataBase is not Connected !!")
    }
})

app.listen(PORT, ()=>console.log(`The Server is running on PORt ${PORT}`))



































