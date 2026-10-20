import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCheckCircle, FaCalendarAlt, FaUser, FaShieldAlt } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import axios from 'axios'
import { listingDataContext } from '../context/ListingContext.jsx'
import { userDataContext } from '../context/UserContext.jsx'
import { authDataContext } from '../context/AuthContext.jsx'

function ViewCard() {
  const navigate = useNavigate()
  const { id: urlId } = useParams()
  const { serverUrl } = useContext(authDataContext)
  const { userData, getCurrentUser } = useContext(userDataContext)
  const { cardDetails, setCardDetails, handleGetListing } = useContext(listingDataContext)

  // Edit popUp state
  const [popUp, setPopUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingListing, setFetchingListing] = useState(false)

  // Booking modal & submission states
  const [bookingModal, setBookingModal] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')

  // Booking date states
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const tomorrowStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }, [])

  const [checkIn, setCheckIn] = useState(todayStr)
  const [checkOut, setCheckOut] = useState(tomorrowStr)

  // Form fields for editing
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rent, setRent] = useState('')
  const [city, setCity] = useState('')
  const [landmark, setLandmark] = useState('')
  const [category, setCategory] = useState('')
  const [backEndImage1, setBackEndImage1] = useState(null)
  const [backEndImage2, setBackEndImage2] = useState(null)
  const [backEndImage3, setBackEndImage3] = useState(null)

  // Fetch listing if urlId exists but cardDetails doesn't match
  useEffect(() => {
    const loadListing = async () => {
      const listingId = urlId || cardDetails?._id
      if (!cardDetails && urlId) {
        setFetchingListing(true)
        try {
          const res = await axios.get(`${serverUrl}/api/listing/find/${urlId}`, {
            withCredentials: true,
          })
          setCardDetails(res.data)
        } catch (err) {
          console.error(err)
          navigate('/')
        } finally {
          setFetchingListing(false)
        }
      } else if (!cardDetails && !urlId) {
        navigate('/')
      }
    }
    loadListing()
  }, [urlId, cardDetails, serverUrl, navigate, setCardDetails])

  // Sync editing fields with cardDetails
  useEffect(() => {
    if (cardDetails) {
      setTitle(cardDetails.title || '')
      setDescription(cardDetails.description || '')
      setRent(cardDetails.rent || '')
      setCity(cardDetails.city || '')
      setLandmark(cardDetails.landmark || '')
      setCategory(cardDetails.category || '')
    }
  }, [cardDetails])

  // Calculations
  const calculatedDays = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const diff = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 1
  }, [checkIn, checkOut])

  const calculatedTotalRent = useMemo(() => {
    const daily = Number(cardDetails?.rent) || 0
    return daily * calculatedDays
  }, [cardDetails?.rent, calculatedDays])

  if (fetchingListing) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='flex flex-col items-center gap-3'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent'></div>
          <p className='text-sm text-gray-500'>Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!cardDetails) return null

  // Check host and booking status
  const hostId = typeof cardDetails.host === 'object' ? cardDetails.host?._id : cardDetails.host
  const isHost = hostId && userData?._id && hostId.toString() === userData._id.toString()
  const isBooked = !!cardDetails.isBooked
  const bookerId = typeof cardDetails.bookedBy === 'object' ? cardDetails.bookedBy?._id : cardDetails.bookedBy
  const isBookedByMe = bookerId && userData?._id && bookerId.toString() === userData._id.toString()

  // Handle Update Listing
  const handleUpdateListing = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('rent', rent)
      formData.append('city', city)
      formData.append('landmark', landmark)
      formData.append('category', category)
      ;[backEndImage1, backEndImage2, backEndImage3].forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img)
      })

      const res = await axios.post(
        `${serverUrl}/api/listing/update/${cardDetails._id}`,
        formData,
        { withCredentials: true }
      )

      if (res.data) {
        setCardDetails(res.data)
      }
      await handleGetListing()
      setPopUp(false)
    } catch (error) {
      console.log(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle Create Booking
  const handleConfirmBooking = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingError('')
    try {
      const res = await axios.post(
        `${serverUrl}/api/booking/create/${cardDetails._id}`,
        {
          checkIn,
          checkOut,
          totalRent: calculatedTotalRent,
        },
        { withCredentials: true }
      )

      // Update current cardDetails to reflect booked state
      setCardDetails((prev) => ({
        ...prev,
        isBooked: true,
        bookedBy: userData?._id,
      }))

      // Refresh listings and user context
      if (handleGetListing) await handleGetListing()
      if (getCurrentUser) await getCurrentUser()

      setBookingSuccess(true)
    } catch (error) {
      console.error('Booking error', error)
      setBookingError(error.response?.data?.message || 'Failed to complete booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-[#FF385C] focus:outline-none'
  const labelClass = 'mb-1 block text-sm font-medium text-gray-700'
  const fileClass =
    'w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600'
  const mainButtonClass =
    'mt-4 w-full cursor-pointer rounded-xl bg-[#FF0000] py-3 text-lg font-semibold text-white shadow-md transition hover:bg-[#E31C5F] active:scale-[0.99] sm:w-64'

  return (
    <div className='relative min-h-screen w-full bg-white px-4 pb-16 pt-4 md:px-10'>
      {!popUp && !bookingModal && (
        <button
          onClick={() => navigate('/')}
          type='button'
          className='absolute left-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#FF0000] text-white shadow-md transition hover:scale-105 hover:opacity-95'
        >
          <FaArrowLeft size={18} />
        </button>
      )}

      <div className='mx-auto w-full max-w-4xl pt-16'>
        {/* Header with Title and Status */}
        <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
          <div>
            <span className='inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600'>
              {cardDetails.category || 'Stay'}
            </span>
            <h1 className='mt-1 text-2xl font-bold uppercase tracking-tight text-gray-900 md:text-3xl'>
              In {cardDetails.landmark}, {cardDetails.city}
            </h1>
          </div>

          {isBooked && (
            <div className='flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 border border-amber-200 shadow-sm'>
              <span className='h-2 w-2 rounded-full bg-amber-500'></span>
              Currently Booked
            </div>
          )}
        </div>

        {/* Property Image Gallery */}
        <div className='grid h-auto grid-cols-1 gap-1.5 overflow-hidden rounded-2xl md:h-96 md:grid-cols-[7fr_5fr] md:grid-rows-2 shadow-sm'>
          <img
            src={cardDetails.image1}
            alt='Main view'
            className='h-60 w-full object-cover md:row-span-2 md:h-full transition duration-300 hover:scale-[1.01]'
          />
          <img
            src={cardDetails.image2}
            alt='Second view'
            className='h-44 w-full object-cover md:h-full transition duration-300 hover:scale-[1.01]'
          />
          <img
            src={cardDetails.image3}
            alt='Third view'
            className='h-44 w-full object-cover md:h-full transition duration-300 hover:scale-[1.01]'
          />
        </div>

        {/* Details Section */}
        <div className='mt-6 grid gap-6 border-b border-gray-200 pb-8 md:grid-cols-[2fr_1fr]'>
          <div className='flex flex-col gap-3'>
            <h2 className='text-xl font-bold uppercase tracking-tight text-gray-900'>
              {cardDetails.category}, {cardDetails.title}
            </h2>

            {cardDetails.host?.name && (
              <p className='text-sm text-gray-500 flex items-center gap-1.5'>
                <FaUser className='text-gray-400' size={13} />
                Hosted by <span className='font-medium text-gray-800'>{cardDetails.host.name}</span>
              </p>
            )}

            <p className='text-base leading-relaxed text-gray-700 whitespace-pre-line'>
              {cardDetails.description}
            </p>

            <div className='mt-2 flex items-center gap-3 text-sm text-gray-500'>
              <div className='flex items-center gap-1 text-emerald-600'>
                <FaShieldAlt size={14} />
                <span>Verified stay</span>
              </div>
              <span>•</span>
              <span>Fast check-in</span>
            </div>
          </div>

          {/* Pricing & Booking Card */}
          <div className='rounded-2xl border border-gray-200 bg-gray-50/70 p-5 shadow-sm flex flex-col justify-between'>
            <div>
              <div className='flex items-baseline gap-1'>
                <span className='text-3xl font-extrabold text-gray-900'>₹{cardDetails.rent}</span>
                <span className='text-sm font-medium text-gray-500'>/ night</span>
              </div>
              <p className='mt-1 text-xs text-gray-500'>Taxes and service fees included</p>
            </div>

            <div className='mt-6'>
              {isHost ? (
                <div>
                  {isBooked && (
                    <div className='mb-3 rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-950 border border-emerald-200'>
                      <p className='font-bold flex items-center gap-1.5 text-emerald-800 text-sm'>
                        <FaCheckCircle size={14} />
                        <span>Reservation Received!</span>
                      </p>
                      <p className='mt-1.5 text-gray-800 text-xs'>
                        Booked by <span className='font-semibold'>{cardDetails.bookedBy?.name || 'Guest'}</span>
                        {cardDetails.bookedBy?.email && (
                          <span className='text-gray-500'> ({cardDetails.bookedBy.email})</span>
                        )}
                      </p>
                      <button
                        onClick={() => navigate('/mybookings?tab=host')}
                        className='mt-2.5 w-full cursor-pointer rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition'
                      >
                        View Host Reservations
                      </button>
                    </div>
                  )}
                  <button onClick={() => setPopUp(true)} type='button' className={mainButtonClass}>
                    Edit Listing
                  </button>
                  <p className='mt-2 text-center text-xs text-gray-500'>You are the host of this property</p>
                </div>
              ) : isBooked ? (
                isBookedByMe ? (
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-center gap-2 rounded-xl bg-emerald-100 py-2.5 px-4 text-emerald-800 font-semibold'>
                      <FaCheckCircle size={18} />
                      <span>Booked by You!</span>
                    </div>
                    <button
                      onClick={() => navigate('/mybookings')}
                      className='w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition'
                    >
                      View in My Bookings
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      disabled
                      type='button'
                      className='w-full cursor-not-allowed rounded-xl bg-gray-300 py-3 text-lg font-semibold text-gray-600 shadow-none'
                    >
                      Already Booked
                    </button>
                    <p className='mt-2 text-center text-xs text-gray-500'>
                      This property has already been reserved
                    </p>
                  </div>
                )
              ) : (
                <div>
                  <button
                    onClick={() => {
                      setBookingError('')
                      setBookingSuccess(false)
                      setBookingModal(true)
                    }}
                    type='button'
                    className={mainButtonClass}
                  >
                    Booking
                  </button>
                  <p className='mt-2 text-center text-xs text-gray-500'>
                    Free cancellation available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {bookingModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn'>
          <div className='relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all'>
            <button
              onClick={() => {
                setBookingModal(false)
                setBookingSuccess(false)
              }}
              type='button'
              className='absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition'
            >
              <ImCross size={13} />
            </button>

            {bookingSuccess ? (
              <div className='flex flex-col items-center py-6 text-center'>
                <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
                  <FaCheckCircle size={36} />
                </div>
                <h3 className='text-2xl font-bold text-gray-900'>Booking Confirmed!</h3>
                <p className='mt-2 text-sm text-gray-600 max-w-sm'>
                  Congratulations! You have successfully booked{' '}
                  <span className='font-semibold text-gray-800'>{cardDetails.title}</span> in{' '}
                  <span className='font-semibold text-gray-800'>{cardDetails.city}</span>.
                </p>

                <div className='mt-5 w-full rounded-2xl bg-gray-50 p-4 text-left border border-gray-200'>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Check-In:</span>
                    <span className='font-medium text-gray-900'>{checkIn}</span>
                  </div>
                  <div className='mt-1.5 flex justify-between text-sm text-gray-600'>
                    <span>Check-Out:</span>
                    <span className='font-medium text-gray-900'>{checkOut}</span>
                  </div>
                  <div className='mt-1.5 flex justify-between text-sm text-gray-600'>
                    <span>Duration:</span>
                    <span className='font-medium text-gray-900'>{calculatedDays} day(s)</span>
                  </div>
                  <div className='mt-2 pt-2 border-t border-gray-200 flex justify-between font-bold text-base text-gray-900'>
                    <span>Total Amount:</span>
                    <span className='text-[#FF0000]'>₹{calculatedTotalRent}</span>
                  </div>
                </div>

                <div className='mt-6 flex w-full flex-col gap-2.5'>
                  <button
                    onClick={() => navigate('/mybookings')}
                    className='w-full cursor-pointer rounded-xl bg-[#FF0000] py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#E31C5F]'
                  >
                    View in My Bookings
                  </button>
                  <button
                    onClick={() => {
                      setBookingModal(false)
                      setBookingSuccess(false)
                    }}
                    className='w-full cursor-pointer rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100'
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className='flex flex-col gap-4'>
                <div>
                  <h3 className='text-2xl font-bold text-gray-900'>Confirm Your Booking</h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Please select your dates to complete the reservation
                  </p>
                </div>

                {/* Property Mini Summary */}
                <div className='flex items-center gap-3 rounded-2xl bg-gray-50 p-3 border border-gray-200'>
                  <img
                    src={cardDetails.image1}
                    alt={cardDetails.title}
                    className='h-16 w-16 rounded-xl object-cover'
                  />
                  <div className='flex-1 overflow-hidden'>
                    <h4 className='truncate text-sm font-semibold text-gray-900'>{cardDetails.title}</h4>
                    <p className='text-xs text-gray-500'>
                      {cardDetails.landmark}, {cardDetails.city}
                    </p>
                    <p className='mt-0.5 text-xs font-semibold text-[#FF0000]'>
                      ₹{cardDetails.rent} / day
                    </p>
                  </div>
                </div>

                {bookingError && (
                  <div className='rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-200'>
                    {bookingError}
                  </div>
                )}

                {/* Date Inputs */}
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label htmlFor='checkIn' className={labelClass}>
                      <span className='flex items-center gap-1.5'>
                        <FaCalendarAlt size={12} className='text-red-500' /> Check-In
                      </span>
                    </label>
                    <input
                      id='checkIn'
                      type='date'
                      min={todayStr}
                      required
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value)
                        if (new Date(e.target.value) >= new Date(checkOut)) {
                          const nextDay = new Date(e.target.value)
                          nextDay.setDate(nextDay.getDate() + 1)
                          setCheckOut(nextDay.toISOString().split('T')[0])
                        }
                      }}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor='checkOut' className={labelClass}>
                      <span className='flex items-center gap-1.5'>
                        <FaCalendarAlt size={12} className='text-red-500' /> Check-Out
                      </span>
                    </label>
                    <input
                      id='checkOut'
                      type='date'
                      min={checkIn || todayStr}
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Guest Info */}
                <div className='rounded-xl bg-gray-50/70 p-3 border border-gray-200 text-xs text-gray-600'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium text-gray-700'>Guest Name:</span>
                    <span>{userData?.name || 'Logged in user'}</span>
                  </div>
                  <div className='mt-1 flex items-center justify-between'>
                    <span className='font-medium text-gray-700'>Email:</span>
                    <span>{userData?.email || ''}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className='rounded-2xl bg-gray-50 p-3.5 border border-gray-200'>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>
                      ₹{cardDetails.rent} × {calculatedDays} day(s)
                    </span>
                    <span className='font-medium text-gray-800'>₹{calculatedTotalRent}</span>
                  </div>
                  <div className='mt-2 pt-2 border-t border-gray-200 flex justify-between font-bold text-base text-gray-900'>
                    <span>Total Rent</span>
                    <span className='text-[#FF0000]'>₹{calculatedTotalRent}</span>
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={bookingLoading}
                  className='mt-2 w-full cursor-pointer rounded-xl bg-[#FF0000] py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#E31C5F] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2'
                >
                  {bookingLoading ? (
                    <>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                      <span>Booking Property...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* UPDATE LISTING POPUP (Host Only) */}
      {popUp && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <button
            onClick={() => setPopUp(false)}
            type='button'
            className='absolute left-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#FF0000] text-white shadow-md hover:opacity-90'
          >
            <ImCross size={18} />
          </button>

          <form
            onSubmit={handleUpdateListing}
            className='flex max-h-[90vh] w-full max-w-lg flex-col gap-3 overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-2xl'
          >
            <h2 className='text-2xl font-semibold'>Update Listing</h2>

            <div>
              <label htmlFor='title' className={labelClass}>Title</label>
              <input
                id='title'
                type='text'
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor='description' className={labelClass}>Description</label>
              <textarea
                id='description'
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label htmlFor='image1' className={labelClass}>Image 1</label>
              <input
                id='image1'
                type='file'
                accept='image/*'
                onChange={(e) => setBackEndImage1(e.target.files[0])}
                className={fileClass}
              />
            </div>

            <div>
              <label htmlFor='image2' className={labelClass}>Image 2</label>
              <input
                id='image2'
                type='file'
                accept='image/*'
                onChange={(e) => setBackEndImage2(e.target.files[0])}
                className={fileClass}
              />
            </div>

            <div>
              <label htmlFor='image3' className={labelClass}>Image 3</label>
              <input
                id='image3'
                type='file'
                accept='image/*'
                onChange={(e) => setBackEndImage3(e.target.files[0])}
                className={fileClass}
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label htmlFor='rent' className={labelClass}>Rent</label>
                <input
                  id='rent'
                  type='number'
                  min='0'
                  required
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor='city' className={labelClass}>City</label>
                <input
                  id='city'
                  type='text'
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor='landmark' className={labelClass}>Landmark</label>
              <input
                id='landmark'
                type='text'
                required
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='mt-1 w-full cursor-pointer rounded-lg bg-[#FF0000] py-2.5 text-lg font-medium text-white transition hover:bg-[#E31C5F] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ViewCard