import React, { useContext } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import {listingDataContext} from "../context/ListingContext.jsx"
import { useNavigate } from 'react-router-dom'
function ListingPage3() {
    const navigate = useNavigate()
    const {
  title, description, rent, city, landmark,
  frontEndImage1, frontEndImage2, frontEndImage3,
  handleAddListing , setAdding , adding
} = useContext(listingDataContext)
  return (
    <div className='relative min-h-screen w-full bg-white px-4 pb-12 pt-6 md:px-12'>
    
      <button onClick={() => navigate('/listingpage2')}
        type='button'
        className='absolute left-2 top-2 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#FF0000] text-white shadow-md hover:opacity-90'
      >
        <FaArrowLeft size={22} />
      </button>

      <div className='mx-auto w-full max-w-6xl pt-16 md:pt-4'>
       
        <h1 className='mb-5 text-3xl uppercase text-gray-900'>In {landmark} , {city} </h1>

      
        <div className='grid h-auto grid-cols-1 gap-1 overflow-hidden rounded-lg md:h-124 md:grid-cols-[7fr_5fr] md:grid-rows-2'>
          <img
            src={frontEndImage1}
            alt='Main view'
            className='h-64 w-full object-cover md:row-span-2 md:h-full'
          />
          <img
            src={frontEndImage2}
            alt='Second view'
            className='h-48 w-full object-cover md:h-full'
          />
          <img
            src={frontEndImage3}
            alt='Third view'
            className='h-48 w-full object-cover md:h-full'
          />
        </div>

    
        <div className='mt-6 flex flex-col gap-3'>
          <h2 className='text-3xl uppercase text-gray-900'>{title} , {landmark}</h2>
          <p className='text-2xl uppercase text-gray-800'>{description}</p>
          <p className='text-2xl text-gray-800'>Rs.{rent}/day</p>
        </div>

   
        <button onClick={handleAddListing}
        disabled={adding}
          type='button'
          className='mt-4 w-full cursor-pointer rounded-lg bg-[#FF0000] py-3 text-xl font-medium text-white transition hover:bg-[#E31C5F] sm:w-96'
        >
          {adding ? "adding..." : "Add Listing"}
        </button>
      </div>
    </div>
  )
}

export default ListingPage3