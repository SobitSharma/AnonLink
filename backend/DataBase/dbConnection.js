import mongoose from "mongoose";

const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.DB_URL, {dbName:'UnknownUserDB'});
        return true
    } catch (error) {
        console.log("Error in Connecting The DataBase", error.message)
        return false
    }
}

export default dbConnect;