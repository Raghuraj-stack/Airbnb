import React, { useContext } from 'react'
import {Route, Routes} from "react-router-dom"
import Home from './pages/Home.jsx'
import SignUp from "./pages/SignUp.jsx"
import Login from "./pages/Login.jsx"
import ListingPage1 from './pages/ListingPage1.jsx'
import ListingPage2 from './pages/ListingPage2.jsx'
import ListingPage3 from './pages/ListingPage3.jsx'
import { userDataContext } from './context/UserContext.jsx'
import MyListing from './pages/MyListing.jsx'
import ViewCard from './pages/ViewCard.jsx'
import MyBookings from './pages/MyBookings.jsx'
function App() {
  const {userData} = useContext(userDataContext)
  return (
    <>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/listingpage1' element={userData != null ? <ListingPage1/> : <Login/>}/>
        <Route path='/listingpage2' element={userData != null ? <ListingPage2/> : <Login/>}/>
        <Route path='/listingpage3' element={userData != null ? <ListingPage3/> : <Login/>}/>
        <Route path='/mylisting' element={userData != null ? <MyListing/> : <Login/>}/>
        <Route path='/viewcard' element={userData != null ? <ViewCard/> : <Login/>}/>
        <Route path='/viewcard/:id' element={userData != null ? <ViewCard/> : <Login/>}/>
        <Route path='/mybookings' element={userData != null ? <MyBookings/> : <Login/>}/>
        <Route path='/bookings' element={userData != null ? <MyBookings/> : <Login/>}/>
    </Routes>
    </>
  )
}

export default App
