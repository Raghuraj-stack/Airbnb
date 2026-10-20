import generateToken from "../config/token.js"
import User from "../model/user.model.js"
import bcrypt from "bcryptjs"

export const SignUp = async (req, res) => {
    try {
        let { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Give all details" })
        }

        let existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        let hashedPassword = await bcrypt.hash(password, 10)

        let user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        let token = await generateToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)
    } catch (error) {
        console.log("Sign Up Error", error)
    }
}


export const login = async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Give all details" })
        }

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User not found try SignUp.." })
        }

        let exists = await bcrypt.compare(password, user.password)

        if (!exists) {
            return res.status(400).json({ message: "Incorrect Password" })
        }

        let token = await generateToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ message: "Login failed" })
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        return res.status(200).json({ message: "LogOut Successfull" })
    } catch (error) {
        return res.status(400).json({ message: "Logout unsuccessfull" })
    }
}

