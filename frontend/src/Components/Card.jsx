import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import { listingDataContext } from '../context/ListingContext.jsx'
import {useNavigate} from "react-router-dom"

function Card({ title, city, landmark, image1, image2, image3, rent , id, isBooked }) {
  const images = [image1, image2, image3].filter(Boolean)

  const navigate = useNavigate()
  let {userData} = useContext(userDataContext)
  let {handleViewCard} = useContext(listingDataContext)

  const handleClick = ()=>{
    if(userData){
      handleViewCard(id)
    }  
    else
    {
      navigate("/login") 
    }
  }
  return (
    <div onClick={handleClick} className="w-72 shrink-0 cursor-pointer group">
      <div className="relative w-full aspect-square rounded-2xl overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={title || 'property'}
            className="w-full h-full shrink-0 snap-center object-cover transition duration-300 group-hover:scale-105"
          />
        ))}
        {isBooked && (
          <div className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm uppercase tracking-wider">
            Booked
          </div>
        )}
      </div>

   
      <div className="mt-3 text-gray-900">
        <div className="font-medium uppercase truncate">
          In {landmark}, {city}
        </div>
        <div className="uppercase text-sm truncate">{title}</div>
        <div className="mt-0.5 text-sm text-[#7a4a4a]">₹{rent}/day</div>
      </div>
    </div>
  )
}

export default Card