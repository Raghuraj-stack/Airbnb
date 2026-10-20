import express from "express"
import isAuth from "../middleware/isAuth.js"
import { addListing, findListing, getListing, updateListing } from "../controllers/lisiting.controller.js"
import upload from "../middleware/multer.js"
const listingRouter = express.Router()

listingRouter.post("/add" , isAuth ,upload.fields([
    {name:"image1" , maxCount:1},
    {name:"image2" , maxCount:1},
    {name:"image3" , maxCount:1}
]), addListing)

listingRouter.get("/get" , getListing)
listingRouter.get("/find/:id" ,isAuth , findListing)
listingRouter.post("/update/:id", isAuth , upload.fields([
    {name:"image1" , maxCount:1},
    {name:"image2" , maxCount:1},
    {name:"image3" , maxCount:1}
]), updateListing)

export default listingRouter