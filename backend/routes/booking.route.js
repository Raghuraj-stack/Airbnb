import express from "express"
import isAuth from "../middleware/isAuth.js"
import {
    createBooking,
    getUserBookings,
    getHostBookings,
    cancelBooking,
    checkBookingStatus
} from "../controllers/booking.controller.js"

const bookingRouter = express.Router()

bookingRouter.post("/create/:id", isAuth, createBooking)
bookingRouter.get("/my-bookings", isAuth, getUserBookings)
bookingRouter.get("/host-bookings", isAuth, getHostBookings)
bookingRouter.post("/cancel/:id", isAuth, cancelBooking)
bookingRouter.get("/status/:id", isAuth, checkBookingStatus)

export default bookingRouter
