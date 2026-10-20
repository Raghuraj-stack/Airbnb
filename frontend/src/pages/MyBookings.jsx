import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaArrowLeft, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaUser, FaHome } from 'react-icons/fa'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import { listingDataContext } from '../context/ListingContext.jsx'

function MyBookings() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'host' ? 'host' : 'guest'

  const { serverUrl } = useContext(authDataContext)
  const { handleViewCard, handleGetListing } = useContext(listingDataContext)

  const [activeTab, setActiveTab] = useState(initialTab)
  const [guestBookings, setGuestBookings] = useState([])
  const [hostBookings, setHostBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmCancelModal, setConfirmCancelModal] = useState(null)

  const fetchAllBookings = async () => {
    try {
      setLoading(true)
      const [guestRes, hostRes] = await Promise.all([
        axios.get(`${serverUrl}/api/booking/my-bookings`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/booking/host-bookings`, { withCredentials: true }),
      ])
      setGuestBookings(guestRes.data || [])
      setHostBookings(hostRes.data || [])
    } catch (error) {
      console.log('Error fetching bookings', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllBookings()
  }, [serverUrl])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchParams(tab === 'host' ? { tab: 'host' } : {})
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId)
      await axios.post(
        `${serverUrl}/api/booking/cancel/${bookingId}`,
        {},
        { withCredentials: true }
      )
      await fetchAllBookings()
      if (handleGetListing) await handleGetListing()
      setConfirmCancelModal(null)
    } catch (error) {
      console.error('Cancel booking error', error)
      alert(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const currentList = activeTab === 'guest' ? guestBookings : hostBookings

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-8 sm:px-8'>
      <div className='mx-auto max-w-5xl'>
        {/* Header */}
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/')}
              className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 hover:text-black'
            >
              <FaArrowLeft size={16} />
            </button>
            <div>
              <h1 className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
                Reservations & Bookings
              </h1>
              <p className='text-xs text-gray-500 sm:text-sm'>
                Manage your trips and reservations received on your properties
              </p>
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => navigate('/mylisting')}
              className='cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100'
            >
              My Listings
            </button>
            <button
              onClick={() => navigate('/')}
              className='cursor-pointer rounded-xl bg-[#FF0000] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E31C5F]'
            >
              Explore Stays
            </button>
          </div>
        </div>

        {/* Tabs for Guest vs Host */}
        <div className='mb-6 flex border-b border-gray-200'>
          <button
            onClick={() => handleTabChange('guest')}
            className={`flex items-center gap-2 border-b-2 py-3 px-5 text-sm font-semibold transition cursor-pointer ${
              activeTab === 'guest'
                ? 'border-[#FF0000] text-[#FF0000]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FaCalendarAlt size={14} />
            <span>My Trips (Bookings I Made)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'guest' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {guestBookings.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('host')}
            className={`flex items-center gap-2 border-b-2 py-3 px-5 text-sm font-semibold transition cursor-pointer ${
              activeTab === 'host'
                ? 'border-[#FF0000] text-[#FF0000]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FaHome size={15} />
            <span>Host Profile (Bookings on My Properties)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'host' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {hostBookings.length}
            </span>
          </button>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent'></div>
            <p className='mt-3 text-sm text-gray-500'>Loading reservations...</p>
          </div>
        ) : currentList.length === 0 ? (
          /* Empty state */
          <div className='rounded-3xl border border-dashed border-gray-300 bg-white py-20 px-4 text-center shadow-sm'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#FF0000]'>
              {activeTab === 'guest' ? <FaCalendarAlt size={30} /> : <FaHome size={30} />}
            </div>
            <h3 className='mt-4 text-xl font-bold text-gray-900'>
              {activeTab === 'guest' ? 'No Stays Booked Yet' : 'No Reservations on Your Properties'}
            </h3>
            <p className='mx-auto mt-1 max-w-sm text-sm text-gray-500'>
              {activeTab === 'guest'
                ? "You haven't booked any places yet. Start exploring listings and reserve your dream stay!"
                : 'When guests reserve any of your listed properties, their bookings and contact information will appear here.'}
            </p>
            <button
              onClick={() => navigate(activeTab === 'guest' ? '/' : '/listingpage1')}
              className='mt-6 cursor-pointer rounded-xl bg-[#FF0000] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#E31C5F]'
            >
              {activeTab === 'guest' ? 'Find Stays' : 'Add a New Listing'}
            </button>
          </div>
        ) : (
          /* Bookings List */
          <div className='flex flex-col gap-5'>
            {currentList.map((b) => {
              const item = b.listing
              const isConfirmed = b.status === 'confirmed'

              if (!item) {
                return (
                  <div
                    key={b._id}
                    className='rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500 shadow-sm'
                  >
                    Listing details are no longer available for booking #{b._id}.
                  </div>
                )
              }

              return (
                <div
                  key={b._id}
                  className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md'
                >
                  <div className='flex flex-col md:flex-row'>
                    {/* Image */}
                    <div className='relative md:w-72 md:shrink-0'>
                      <img
                        src={item.image1}
                        alt={item.title}
                        className='h-52 w-full object-cover md:h-full'
                      />
                      <span className='absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm uppercase tracking-wider'>
                        {item.category || 'Stay'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className='flex flex-1 flex-col justify-between p-5'>
                      <div>
                        <div className='flex flex-wrap items-start justify-between gap-2'>
                          <div>
                            <h2
                              className='text-lg font-bold text-gray-900 hover:text-red-500 cursor-pointer'
                              onClick={() => {
                                if (handleViewCard) handleViewCard(item._id)
                                else navigate(`/viewcard/${item._id}`)
                              }}
                            >
                              {item.title}
                            </h2>
                            <p className='mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 sm:text-sm'>
                              <FaMapMarkerAlt size={12} className='text-red-500' />
                              <span>
                                {item.landmark}, {item.city}
                              </span>
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {isConfirmed ? (
                              <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200'>
                                <FaCheckCircle size={12} /> Confirmed
                              </span>
                            ) : (
                              <span className='inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 border border-gray-200'>
                                <FaTimesCircle size={12} /> Cancelled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Guest / Host Info */}
                        {activeTab === 'host' ? (
                          <div className='mt-2.5 rounded-xl bg-amber-50/70 p-2.5 text-xs text-amber-900 border border-amber-200/70 flex items-center gap-2'>
                            <FaUser className='text-amber-600 shrink-0' size={13} />
                            <div>
                              <span className='font-semibold'>Booked By Guest: </span>
                              <span className='font-medium text-gray-900'>{b.user?.name || 'Guest'}</span>
                              {b.user?.email && (
                                <span className='text-gray-600'> • {b.user.email}</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          b.host && (
                            <p className='mt-2 text-xs text-gray-500 flex items-center gap-1.5'>
                              <FaUser className='text-gray-400' size={11} />
                              <span>Host: </span>
                              <span className='font-medium text-gray-700'>
                                {b.host.name} ({b.host.email})
                              </span>
                            </p>
                          )
                        )}

                        {/* Dates grid */}
                        <div className='mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3 text-xs sm:grid-cols-3 sm:text-sm border border-gray-200'>
                          <div>
                            <span className='block text-xs font-medium text-gray-500'>Check-In</span>
                            <span className='font-semibold text-gray-800'>
                              {formatDate(b.checkIn)}
                            </span>
                          </div>
                          <div>
                            <span className='block text-xs font-medium text-gray-500'>Check-Out</span>
                            <span className='font-semibold text-gray-800'>
                              {formatDate(b.checkOut)}
                            </span>
                          </div>
                          <div className='col-span-2 sm:col-span-1'>
                            <span className='block text-xs font-medium text-gray-500'>
                              {activeTab === 'host' ? 'Earnings' : 'Total Paid'}
                            </span>
                            <span className='font-bold text-[#FF0000]'>₹{b.totalRent}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4'>
                        <span className='text-xs text-gray-400'>
                          Booked on {formatDate(b.createdAt)}
                        </span>

                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => {
                              if (handleViewCard) handleViewCard(item._id)
                              else navigate(`/viewcard/${item._id}`)
                            }}
                            className='cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition'
                          >
                            View Stay
                          </button>

                          {isConfirmed && (
                            <button
                              onClick={() => setConfirmCancelModal(b)}
                              disabled={cancellingId === b._id}
                              className='cursor-pointer rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50'
                            >
                              {cancellingId === b._id
                                ? 'Cancelling...'
                                : activeTab === 'host'
                                ? 'Cancel Guest Booking'
                                : 'Cancel Booking'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CONFIRM CANCELLATION MODAL */}
      {confirmCancelModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl'>
            <h3 className='text-lg font-bold text-gray-900'>Cancel Reservation</h3>
            <p className='mt-2 text-sm text-gray-600'>
              Are you sure you want to cancel the reservation for{' '}
              <span className='font-semibold text-gray-800'>
                {confirmCancelModal.listing?.title}
              </span>
              ? This will release the listing so it becomes available again.
            </p>

            <div className='mt-6 flex justify-end gap-2.5'>
              <button
                onClick={() => setConfirmCancelModal(null)}
                className='cursor-pointer rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(confirmCancelModal._id)}
                disabled={cancellingId === confirmCancelModal._id}
                className='cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50'
              >
                {cancellingId === confirmCancelModal._id ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings
