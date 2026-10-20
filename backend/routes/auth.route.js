import express from "express"
import { login, logout, SignUp } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/signup" , SignUp)
authRouter.post("/login" , login)
authRouter.post("/logout" , logout)

export default authRouter