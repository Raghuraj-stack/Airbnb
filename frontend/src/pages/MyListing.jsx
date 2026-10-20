// import React from 'react'
// import { useContext } from 'react'
// import { listingDataContext } from '../context/ListingContext.jsx'
// import Card from '../Components/Card.jsx'
// import {useNavigate} from "react-router-dom"
// import { FaArrowLeft } from 'react-icons/fa'

// function MyListing() {
//     const navigate = useNavigate()
//   let {listing , setListing , newListing , setNewListing} = useContext(listingDataContext)
//   return (
//     <div className='flex flex-col items-center justify-center relative'>
//         <button onClick={()=>{navigate("/")}}
//                 type='button'
//                 className='absolute left-6 top-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#FF0000] text-white shadow-md hover:opacity-90'
//               >
//                 <FaArrowLeft size={22} />
//         </button>
//         <div className='text-4xl font-bold text-mauve-700 mt-10 border-2 pt-2 pb-2 pl-8 pr-8'>My Listing's</div>
//       <div className='w-screen h-[77vh] flex items-center justify-center gap-6 flex-wrap mt-15 md:mt-10'>
//       {newListing.map((list)=>(
//         <Card title={list.title} landmark={list.landmark} city={list.city} description={list.description} image1={list.image1} image2={list.image2} image3={list.image3} rent={list.rent}/>
//       ))}
//       </div>
//     </div>
//   )
// }

// export default MyListing


import React, { useContext, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { listingDataContext } from '../context/ListingContext'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'


function MyListing() {
  const navigate = useNavigate()
  const { listing, handleGetListing, handleViewCard } = useContext(listingDataContext)
  const { serverUrl } = useContext(authDataContext)
  const { userData } = useContext(userDataContext)
  

  
  const myListings = useMemo(() => {
    if (!userData?._id) return []
    return listing.filter((item) => {
      const hostId = typeof item.host === 'object' ? item.host?._id : item.host
      return hostId === userData._id
    })
  }, [listing, userData])

  

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
      
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-100"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Listings</h1>
              <p className="text-xs text-gray-500">Manage properties you host</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/mybookings?tab=host')}
              className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Guest Reservations
            </button>
            <button
              onClick={() => navigate('/listingpage1')}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              + Add listing
            </button>
          </div>
        </div>

     
        {myListings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <p className="text-lg font-medium text-gray-700">You haven't listed anything yet</p>
            <p className="mt-1 text-sm text-gray-500">Add your first property to start getting bookings.</p>
            <button
              onClick={() => navigate('/listingpage1')}
              className="mt-5 rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Add listing
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myListings.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative">
                    <img
                      src={item.image1}
                      alt={item.title}
                      className="h-48 w-full cursor-pointer object-cover"
                      onClick={() => {
                        if (handleViewCard) handleViewCard(item._id)
                        else navigate(`/viewcard/${item._id}`)
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      {item.isBooked ? (
                        <span className="rounded-full bg-emerald-600 text-white px-2.5 py-1 text-xs font-semibold shadow-sm">
                          ✓ Booked
                        </span>
                      ) : (
                        <span className="rounded-full bg-black/60 text-white backdrop-blur-sm px-2.5 py-1 text-xs font-medium">
                          Available
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="line-clamp-1 font-semibold text-gray-900">{item.title}</h2>
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {item.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.landmark}, {item.city}
                    </p>
                    <p className="mt-2 font-medium text-gray-900">
                      ₹{item.rent} <span className="text-sm font-normal text-gray-500">/ day</span>
                    </p>

                    {item.isBooked && (
                      <div className="mt-3 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-950 border border-emerald-200">
                        <p className="font-semibold flex items-center gap-1 text-emerald-800">
                          <span>🎉 Booked by:</span>
                          <span>{item.bookedBy?.name || 'Guest'}</span>
                        </p>
                        {item.bookedBy?.email && (
                          <p className="text-emerald-700 mt-0.5">{item.bookedBy.email}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        if (handleViewCard) handleViewCard(item._id)
                        else navigate(`/viewcard/${item._id}`)
                      }}
                      className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      View
                    </button>
                    {item.isBooked && (
                      <button
                        onClick={() => navigate('/mybookings?tab=host')}
                        className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyListing