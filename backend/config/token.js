import jwt from "jsonwebtoken"

const generateToken = async (userId)=>{
    try {
        let token = await jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn: "7d"})
        return token
    } catch (error) {
        console.log({message:"Token not generated"})
    }
}

export default generateToken