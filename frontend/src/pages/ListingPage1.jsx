import React from 'react'
import { useState , useContext} from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import {useNavigate} from "react-router-dom"
import { listingDataContext } from '../context/ListingContext'

function ListingPage1() {
  const navigate = useNavigate()
let {
  title, setTitle,
description, setDescription,
frontEndImage1, setFrontEndImage1,
frontEndImage2, setFrontEndImage2,
frontEndImage3, setFrontEndImage3,
backEndImage1, setBackEndImage1,
backEndImage2, setBackEndImage2,
backEndImage3, setBackEndImage3,
rent, setRent,
city, setCity,
landmark, setLandmark,
category, setCategory,
} = useContext(listingDataContext)

const handleImage1 = (e)=>{
    let file = e.target.files[0]
    setBackEndImage1(file)
    setFrontEndImage1(URL.createObjectURL(file))
}
const handleImage2 = (e)=>{
    let file = e.target.files[0]
    setBackEndImage2(file)
    setFrontEndImage2(URL.createObjectURL(file))
}
const handleImage3 = (e)=>{
    let file = e.target.files[0]
    setBackEndImage3(file)
    setFrontEndImage3(URL.createObjectURL(file))
}
  return (
    <div className='relative flex min-h-screen w-full justify-center bg-white px-4 pb-12 pt-28'>
      
      <button onClick={()=>{navigate("/")}}
        type='button'
        className='absolute left-6 top-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#FF0000] text-white shadow-md hover:opacity-90'
      >
        <FaArrowLeft size={22} />
      </button>

      
      <div className='absolute right-6 top-6 rounded-full bg-[#FF385C] px-6 py-3 text-xl font-medium text-white shadow-lg'>
        SetUp Your Home
      </div>

      
      <form onSubmit={(e)=>{e.preventDefault()
                          navigate("/listingpage2")
      }} 
       className='flex w-full max-w-3xl flex-col gap-5'>
        <div>
          <label htmlFor='title' className='mb-2 block text-xl text-gray-800'>Title</label>
          <input
          value={title}
          onChange={(e)=>{setTitle(e.target.value)}}
            id='title'
            type='text'
            required
            className='w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-[#FF385C] focus:outline-none'
          />
        </div>

        <div>
          <label htmlFor='description' className='mb-2 block text-xl text-gray-800'>Description</label>
          <textarea
          value={description}
          onChange={(e)=>{setDescription(e.target.value)}}
            id='description'
            rows={3}
            required
            className='w-full resize-y rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-[#FF385C] focus:outline-none'
          />
        </div>

        <div>
          <label htmlFor='image1' className='mb-2 block text-xl text-gray-800'>Image1</label>
          <input
          onChange={handleImage1}
            id='image1'
            type='file'
            accept='image/*'
            required
            className='w-full cursor-pointer rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-[#FF385C] focus:outline-none'
          />
        </div>

        <div>
          <label htmlFor='image2' className='mb-2 block text-xl text-gray-800'>Image2</label>
          <input onChange={handleImage2}
            id='image2'
            type='file'
            accept='image/*'
            required
            className='w-full cursor-pointer rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-[#FF385C] focus:outline-none'
          />
        </div>

        <div>
          <label htmlFor='image3' className='mb-2 block text-xl text-gray-800'>Image3</label>
          <input
          onChange={handleImage3}
            id='image3'
            type='file'
            accept='image/*'
            required
            className='w-full cursor-pointer rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-[#FF385C] focus:outline-none'
          />
        </div>

        <div>
          <label htmlFor='rent' className='mb-2 block text-xl text-gray-800'>Rent</label>
          <input
          value={rent}
          onChange={(e)=>{setRent(e.target.value)}}
            id='rent'
            type='number'
            min='0'
            required
            className='w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-[#FF385C] focus:outline-none'
          />
        </div>

        <div>
          <label htmlFor='city' className='mb-2 block text-xl text-gray-800'>City</label>
          <input
          value={city}
          onChange={(e)=>{setCity(e.target.value)}}
            id='city'
            type='text'
            required
            className='w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-[#FF385C] focus:outline-none'
          />
        </div>

        <div>
          <label htmlFor='landmark' className='mb-2 block text-xl text-gray-800'>Landmark</label>
          <input
          value={landmark}
          onChange={(e)=>{setLandmark(e.target.value)}}
            id='landmark'
            type='text'
            required
            className='w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-[#FF385C] focus:outline-none'
          />
        </div>

        <button 
          type='submit'
          className='mt-2 w-full cursor-pointer rounded-lg bg-[#FF0000] py-3 text-xl font-medium text-white transition hover:bg-[#E31C5F] sm:w-72'
        >
          Next
        </button>
      </form>
    </div>
  )
}

export default ListingPage1