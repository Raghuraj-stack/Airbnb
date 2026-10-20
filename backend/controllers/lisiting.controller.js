import uploadOnCloudinary from "../config/cloudinary.js"
import Listing from "../model/listing.model.js"
import User from "../model/user.model.js"
export const addListing = async (req, res) => {
    try {
        let host = req.userId
        let { title, description, rent, city, landmark, category } = req.body
        let image1 = await uploadOnCloudinary(req.files.image1[0].path)
        let image2 = await uploadOnCloudinary(req.files.image2[0].path)
        let image3 = await uploadOnCloudinary(req.files.image3[0].path)

        let listing = await Listing.create({
            title,
            description,
            rent,
            city,
            landmark,
            category,
            image1,
            image2,
            image3,
            host
        })
        let user = await User.findByIdAndUpdate(host, { $push: { listing: listing._id } }, { new: true })
        if (!user) {
            return res.status(400).json({ message: `user not found ${error}` })
        }
        return res.status(200).json(listing)
    } catch (error) {
        return res.status(500).json({ message: `add listing error ${error}` })
    }
}


export const getListing = async (req, res) => {
    try {
        let listing = await Listing.find().populate("host", "name email").populate("bookedBy", "name email").sort({createdAt:-1})
        if(!listing)
        {
            return res.status(400).json({message:"No listing Found"})
        }
        res.status(200).json(listing)
    } catch (error) {
        return res.status(500).json({message:"get listing error"})
    }
}


export const findListing = async (req, res)=>{
    try {
        let {id} = req.params
        let listing = await Listing.findById(id).populate("host", "name email").populate("bookedBy", "name email")
        if(!listing)
        {
            return res.status(400).json({message:"listing not found"})
        }
        res.status(200).json(listing)
    } catch (error) {
         return res.status(500).json({message:"listing error"})
    }
}

export const updateListing = async (req, res) => {
  try {
    console.log("params:", req.params)
console.log("body:", req.body)
console.log("files:", req.files)
    const { id } = req.params
    const { title, description, rent, city, landmark, category } = req.body

    const listing = await Listing.findById(id)
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" })
    }

  
    if (listing.host.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed" })
    }

    const updates = { title, description, rent, city, landmark, category }


    const files = req.files || {}
    for (const key of ["image1", "image2", "image3"]) {
      if (files[key]) {
        updates[key] = await uploadOnCloudinary(files[key][0].path)
      }
    }

    const updated = await Listing.findByIdAndUpdate(id, updates, { new: true })
    return res.status(200).json(updated)
  } catch (error) {
    console.log("update listing error", error)
    return res.status(500).json({ message: "Update listing error" })
  }
}