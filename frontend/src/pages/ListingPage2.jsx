import React, { useContext } from 'react'
import { FaArrowLeft, FaTractor, FaBed, FaStore } from 'react-icons/fa'
import { MdVilla, MdPool, MdMeetingRoom, MdApartment } from 'react-icons/md'
import { GiWoodCabin } from 'react-icons/gi'
import {useNavigate} from "react-router-dom"
import { listingDataContext } from '../context/ListingContext.jsx'
const categories = [
  { label: 'Villa', icon: MdVilla },
  { label: 'Farm House', icon: FaTractor },
  { label: 'Pool House', icon: MdPool },
  { label: 'Rooms', icon: MdMeetingRoom },
  { label: 'Flat', icon: MdApartment },
  { label: 'PG', icon: FaBed },
  { label: 'Cabin', icon: GiWoodCabin },
  { label: 'Shops', icon: FaStore },
]

function ListingPage2() {
    const navigate = useNavigate()
    const {category, setCategory} = useContext(listingDataContext)
  return (
    <div className='relative flex min-h-screen w-full flex-col items-center bg-white px-4 pb-28 pt-28'>
      
      <button
      onClick={()=>{navigate("/listingpage1")}}
        type='button'
        className='absolute left-6 top-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#FF0000] text-white shadow-md hover:opacity-90'
      >
        <FaArrowLeft size={22} />
      </button>

      
      <div className='absolute right-6 top-6 rounded-full bg-[#FF385C] px-6 py-3 text-xl font-medium text-white shadow-lg'>
        Set Your Category
      </div>

      
      <h1 className='mb-12 text-center text-3xl text-gray-900'>
        Which of these best describes your place?
      </h1>

      
      <div className='flex w-full max-w-190 flex-wrap justify-center gap-5'>
        {categories.map(({ label, icon: Icon }) => (
          <div onClick={()=>{setCategory(label)}}
            key={label}
            className={`flex h-32 w-56 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 bg-white text-gray-900 shadow-sm transition hover:shadow-md ${category == label ? "border-[#FF385C]" : "border-slate-300"}`}
          >
            <Icon size={32} />
            <span className='text-lg'>{label}</span>
          </div>
        ))}
      </div>

     
      <button disabled={!category}
      onClick={()=>{navigate("/listingpage3")}}
        type='button'
        className='fixed bottom-6 right-6 cursor-pointer rounded-lg bg-[#FF0000] px-8 py-3 text-xl font-medium text-white shadow-md transition hover:bg-[#E31C5F]'
      >
        Add Listing
      </button>
    </div>
  )
}

export default ListingPage2