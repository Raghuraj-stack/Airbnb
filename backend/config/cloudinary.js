import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'



const uploadOnCloudinary = async (filepath) => {
    cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
  try {
    if (!filepath) return null
    const uploadResult = await cloudinary.uploader.upload(filepath)
    return uploadResult.secure_url
  } catch (error) {
    console.log('cloudinary upload error', error)
    throw error
  } finally {
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
    }
  }
}

export default uploadOnCloudinary