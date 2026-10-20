import Booking from "../model/booking.model.js"
import Listing from "../model/listing.model.js"
import User from "../model/user.model.js"

export const createBooking = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId
        const { checkIn, checkOut, totalRent } = req.body

        const listing = await Listing.findById(id)
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" })
        }


        if (listing.host.toString() === userId.toString()) {
            return res.status(400).json({ message: "You cannot book your own listing" })
        }


        if (listing.isBooked) {
            return res.status(400).json({ message: "This listing is already booked" })
        }

        const checkInDate = checkIn ? new Date(checkIn) : new Date()
        const checkOutDate = checkOut ? new Date(checkOut) : new Date(Date.now() + 24 * 60 * 60 * 1000)


        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
        const calculatedRent = totalRent || (listing.rent * diffDays)

        const booking = await Booking.create({
            listing: listing._id,
            user: userId,
            host: listing.host,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalRent: calculatedRent,
            status: "confirmed"
        })

        listing.isBooked = true
        listing.bookedBy = userId
        await listing.save()


        const user = await User.findById(userId)
        if (user) {
            if (!Array.isArray(user.booking)) {
                user.booking = user.booking ? [user.booking, booking._id] : [booking._id]
            } else {
                user.booking.push(booking._id)
            }
            await user.save()
        }

        const populatedBooking = await Booking.findById(booking._id)
            .populate("listing")
            .populate("host", "name email")
            .populate("user", "name email")

        return res.status(201).json({
            message: "Listing booked successfully",
            booking: populatedBooking
        })
    } catch (error) {
        console.log("createBooking error", error)
        return res.status(500).json({ message: `createBooking error ${error.message}` })
    }
}

export const getUserBookings = async (req, res) => {
    try {
        const userId = req.userId
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: "listing",
                populate: {
                    path: "host",
                    select: "name email"
                }
            })
            .populate("host", "name email")
            .sort({ createdAt: -1 })

        return res.status(200).json(bookings)
    } catch (error) {
        console.log("getUserBookings error", error)
        return res.status(500).json({ message: `getUserBookings error ${error.message}` })
    }
}

export const getHostBookings = async (req, res) => {
    try {
        const hostId = req.userId
        const bookings = await Booking.find({ host: hostId })
            .populate("listing")
            .populate("user", "name email")
            .sort({ createdAt: -1 })

        return res.status(200).json(bookings)
    } catch (error) {
        console.log("getHostBookings error", error)
        return res.status(500).json({ message: `getHostBookings error ${error.message}` })
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId

        const booking = await Booking.findById(id)
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" })
        }


        if (booking.user.toString() !== userId.toString() && booking.host.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this booking" })
        }

        booking.status = "cancelled"
        await booking.save()


        await Listing.findByIdAndUpdate(booking.listing, {
            isBooked: false,
            bookedBy: null
        })

        return res.status(200).json({ message: "Booking cancelled successfully", booking })
    } catch (error) {
        console.log("cancelBooking error", error)
        return res.status(500).json({ message: `cancelBooking error ${error.message}` })
    }
}

export const checkBookingStatus = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId

        const booking = await Booking.findOne({
            listing: id,
            user: userId,
            status: "confirmed"
        })

        return res.status(200).json({
            isBookedByCurrentUser: !!booking,
            booking
        })
    } catch (error) {
        console.log("checkBookingStatus error", error)
        return res.status(500).json({ message: `checkBookingStatus error ${error.message}` })
    }
}
