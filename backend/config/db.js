import mongoose from "mongoose"

const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("Db Connected")
    } catch (error) {
        console.log({message:"Database error"})
    }
}

export default connectDb