
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaAirbnb, FaSearch, FaFire, FaTractor, FaBed, FaStore, FaBars, FaRegUserCircle } from 'react-icons/fa'
import { MdVilla, MdPool, MdMeetingRoom, MdApartment } from 'react-icons/md'
import { GiWoodCabin } from 'react-icons/gi'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import { userDataContext } from '../context/UserContext.jsx'
import { listingDataContext } from '../context/ListingContext.jsx'

const categories = [
  { label: 'Trending', icon: FaFire },
  { label: 'Villa', icon: MdVilla },
  { label: 'Farm House', icon: FaTractor },
  { label: 'Pool House', icon: MdPool },
  { label: 'Rooms', icon: MdMeetingRoom },
  { label: 'Flat', icon: MdApartment },
  { label: 'PG', icon: FaBed },
  { label: 'Cabins', icon: GiWoodCabin },
  { label: 'Shops', icon: FaStore },
]

function Nav() {
  const { userData, setUserData } = useContext(userDataContext)
  const { serverUrl } = useContext(authDataContext)
  const { category, setCategory, setNewListing, listing, searchQuery, handleSearch } = useContext(listingDataContext)
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.post(serverUrl + '/api/auth/logout', {}, { withCredentials: true })
      setUserData(null)
      setShowMenu(false)
    } catch (error) {
      console.log(error)
    }
  }

  // receives the clicked label directly
  const handleCategory = (label) => {
    if (handleSearch) handleSearch('')
    // clicking the active category again, or "Trending", shows everything
    if (label === 'Trending' || label === category) {
      setCategory('Trending')
      setNewListing(listing)
      return
    }
    setCategory(label)
    setNewListing(
      listing.filter(
        (item) => item.category?.toLowerCase() === label.toLowerCase()
      )
    )
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (window.location.pathname !== '/') {
      navigate('/')
    }
  }

  const handleSearchInput = (value) => {
    if (handleSearch) handleSearch(value)
    if (window.location.pathname !== '/') {
      navigate('/')
    }
  }

  const goTo = (path) => {
    setShowMenu(false)
    navigate(path)
  }

  return (
    <header className="w-full border-b border-gray-200 bg-white fixed top-0 z-40">
      <div className="relative flex items-center justify-between px-6 py-4 md:px-12">
        <div
          className="flex cursor-pointer items-center gap-1 text-[#FF385C]"
          onClick={() => {
            if (handleSearch) handleSearch('')
            setCategory('Trending')
            setNewListing(listing)
            navigate('/')
          }}
        >
          <FaAirbnb size={34} />
          <span className="hidden text-2xl font-bold sm:block">airbnb</span>
        </div>

        {/* Desktop Active Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden w-full max-w-md items-center justify-between rounded-full border border-gray-300 py-1.5 pl-5 pr-2 shadow-sm transition hover:shadow-md focus-within:shadow-md focus-within:border-gray-400 md:flex lg:max-w-lg"
        >
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search by city, landmark, or stay..."
            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchInput('')}
              className="mr-2 cursor-pointer text-xs text-gray-400 hover:text-gray-600 transition"
              title="Clear search"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#FF385C] text-white transition hover:bg-[#E03150]"
            title="Search"
          >
            <FaSearch size={13} />
          </button>
        </form>

        <div className="flex items-center gap-4">
          {userData && (
            <span
              onClick={() => goTo('/listingpage1')}
              className="hidden cursor-pointer font-medium text-gray-800 lg:block"
            >
              List your home
            </span>
          )}

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex cursor-pointer items-center gap-3 rounded-full border border-gray-300 px-4 py-2 transition hover:shadow-md"
          >
            <FaBars />
            {!userData && <FaRegUserCircle size={24} />}
            {userData && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white uppercase">
                {userData?.name?.slice(0, 1)}
              </span>
            )}
          </button>
        </div>

        {showMenu && (
          <ul className="absolute right-6 top-20 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg md:right-12">
            {!userData && (
              <li className="cursor-pointer px-5 py-3 hover:bg-gray-100" onClick={() => goTo('/login')}>
                Login
              </li>
            )}
            {userData && (
              <li onClick={handleLogOut} className="cursor-pointer px-5 py-3 hover:bg-gray-100">
                Logout
              </li>
            )}
            <li className="border-t border-gray-200"></li>
            {userData && (
              <li onClick={() => goTo('/listingpage1')} className="cursor-pointer px-5 py-3 hover:bg-gray-100">
                List your Home
              </li>
            )}
            {userData && <li onClick={() => goTo('/mylisting')} className="cursor-pointer px-5 py-3 hover:bg-gray-100">My Listing</li>}
            {userData && <li onClick={() => goTo('/mybookings')} className="cursor-pointer px-5 py-3 hover:bg-gray-100">Check Booking</li>}
          </ul>
        )}
      </div>

      {/* Mobile Search Bar */}
      <div className="px-6 pb-2.5 md:hidden">
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full items-center justify-between rounded-full border border-gray-300 py-2 pl-4 pr-2 shadow-sm focus-within:border-gray-400"
        >
          <div className="flex flex-1 items-center gap-2">
            <FaSearch className="text-[#FF385C] shrink-0" size={13} />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search by city, landmark, stay..."
              className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchInput('')}
              className="px-2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      <div className="flex items-center justify-start gap-8 overflow-x-auto px-6 pb-3 md:justify-center md:gap-12">
        {categories.map(({ label, icon: Icon }) => (
          <div
            key={label}
            onClick={() => handleCategory(label)}
            className={`flex min-w-fit cursor-pointer flex-col items-center gap-1 border-b-2 pb-2 text-gray-800 hover:border-gray-400 ${
              category === label ? 'border-black' : 'border-transparent'
            }`}
          >
            <Icon size={26} />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </header>
  )
}

export default Nav