// import React, { createContext, useContext , useState  , useEffect } from 'react'
// import axios from "axios"
// import {authDataContext} from "./AuthContext.jsx"
// export const listingDataContext = createContext()
// import {useNavigate} from "react-router-dom"

// function ListingContext({children}) {
//     let {serverUrl} = useContext(authDataContext)
//     const navigate = useNavigate()

// let [title, setTitle] = useState("")
// let [description, setDescription] = useState("")
// let [frontEndImage1, setFrontEndImage1] = useState(null)
// let [frontEndImage2, setFrontEndImage2] = useState(null)
// let [frontEndImage3, setFrontEndImage3] = useState(null)
// let [backEndImage1, setBackEndImage1] = useState(null)
// let [backEndImage2, setBackEndImage2] = useState(null)
// let [backEndImage3, setBackEndImage3] = useState(null)
// let [rent, setRent] = useState("")
// let [city, setCity] = useState("")
// let [landmark, setLandmark] = useState("")
// let [category, setCategory] = useState("")
// let [adding, setAdding] = useState(false)
// let [listing , setListing] = useState([])
// let [newListing , setNewListing] = useState([])



// const handleAddListing = async ()=>{
//     try {
//       setAdding(true)
//             let formData =new FormData()
//                 formData.append("title" , title)
//                 formData.append("image1" , backEndImage1)
//                 formData.append("image2" , backEndImage2)
//                 formData.append("image3" , backEndImage3)
//                 formData.append("description" ,description )
//                 formData.append("rent" , rent)
//                 formData.append("city" , city)
//                 formData.append("landmark" , landmark)
//                 formData.append("category" , category)

//             const result = await axios.post(serverUrl + "/api/listing/add" , formData , {withCredentials:true})
//             setAdding(false)
//             console.log(result)
//             navigate("/")
//         } catch (error) {
//           setAdding(false)
//             console.log(error)
//         }
//     }
    
//     let value ={
//         title, setTitle,
// description, setDescription,
// frontEndImage1, setFrontEndImage1,
// frontEndImage2, setFrontEndImage2,
// frontEndImage3, setFrontEndImage3,
// backEndImage1, setBackEndImage1,
// backEndImage2, setBackEndImage2,
// backEndImage3, setBackEndImage3,
// rent, setRent,
// city, setCity,
// landmark, setLandmark,
// category, setCategory,
//     handleAddListing,
//     adding , setAdding,
//     listing , setListing,
//     newListing , setNewListing,
//     handleGetListing
//     }
    
//     const handleGetListing = async ()=>{
//   try {
//     const result = await axios.get(serverUrl + "/api/listing/get" , {withCredentials:true})
//     setListing(result.data)
//     setNewListing(result.data)
//   } catch (error) {
//     console.log(error)
//   }
// }

//   useEffect(() => {
//     handleGetListing()
//   }, [adding])
  

//   return (
//     <div>
//       <listingDataContext.Provider value={value}>
//         {children}
//       </listingDataContext.Provider>
//     </div>
//   )
// }


// export default ListingContext


import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from './AuthContext.jsx'

export const listingDataContext = createContext()

function ListingContext({ children }) {
  const { serverUrl } = useContext(authDataContext)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [frontEndImage1, setFrontEndImage1] = useState(null)
  const [frontEndImage2, setFrontEndImage2] = useState(null)
  const [frontEndImage3, setFrontEndImage3] = useState(null)
  const [backEndImage1, setBackEndImage1] = useState(null)
  const [backEndImage2, setBackEndImage2] = useState(null)
  const [backEndImage3, setBackEndImage3] = useState(null)
  const [rent, setRent] = useState('')
  const [city, setCity] = useState('')
  const [landmark, setLandmark] = useState('')
  const [category, setCategory] = useState('')
  const [adding, setAdding] = useState(false)
  const [listing, setListing] = useState([])
  const [newListing, setNewListing] = useState([])
  const [error, setError] = useState(null)
  const [cardDetails, setCardDetails] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    if (!query || !query.trim()) {
      if (category && category !== 'Trending') {
        setNewListing(listing.filter((item) => item.category?.toLowerCase() === category.toLowerCase()))
      } else {
        setNewListing(listing)
      }
      return
    }

    const q = query.toLowerCase().trim()
    const filtered = listing.filter((item) => {
      const matchCity = item.city?.toLowerCase().includes(q)
      const matchLandmark = item.landmark?.toLowerCase().includes(q)
      const matchTitle = item.title?.toLowerCase().includes(q)
      const matchCategory = item.category?.toLowerCase().includes(q)
      const matchDescription = item.description?.toLowerCase().includes(q)
      return matchCity || matchLandmark || matchTitle || matchCategory || matchDescription
    })
    setNewListing(filtered)
  }, [listing, category])

  const resetForm = () => {
    setTitle(''); setDescription(''); setRent('')
    setCity(''); setLandmark(''); setCategory('')
    setFrontEndImage1(null); setFrontEndImage2(null); setFrontEndImage3(null)
    setBackEndImage1(null); setBackEndImage2(null); setBackEndImage3(null)
  }

  const handleGetListing = useCallback(async () => {
    try {
      const result = await axios.get(serverUrl + '/api/listing/get', { withCredentials: true })
      setListing(result.data)
      setNewListing(result.data)
    } catch (err) {
      console.log(err)
    }
  }, [serverUrl])


  const handleAddListing = async () => {
    setAdding(true)
    setError(null)
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

      await axios.post(serverUrl + '/api/listing/add', formData, { withCredentials: true })
      await handleGetListing()
      resetForm()
      navigate('/')
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || 'Failed to add listing')
    } finally {
      setAdding(false)
    } 
  }

  const handleViewCard = async(id)=>{
    try {
      let result = await axios.get(serverUrl + `/api/listing/find/${id}` ,{withCredentials:true} )
      setCardDetails(result.data)
      navigate(`/viewcard/${id}`)
      return result.data
    } catch (error) {
      console.log(error)
      return null
    }  
  }


  useEffect(() => {
    handleGetListing()
  }, [handleGetListing])

  const value = useMemo(() => ({
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
    handleAddListing, handleGetListing,
    adding, setAdding,
    listing, setListing,
    newListing, setNewListing,
    error, handleViewCard,
    cardDetails, setCardDetails,
    searchQuery, setSearchQuery,
    handleSearch
  }))

  return (
    <listingDataContext.Provider value={value}>
      {children}
    </listingDataContext.Provider>
  )
}

export default ListingContext