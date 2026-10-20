import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
import bookingRouter from "./routes/booking.route.js"
dotenv.config()
const port = process.env.PORT || 8000
let app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"https://airbnb-gn0m.onrender.com",
    credentials:true
}))

app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)
app.use("/api/listing" , listingRouter)
app.use("/api/booking" , bookingRouter)
app.listen(port , ()=>{
    connectDb()
    console.log("Server Started")
})
