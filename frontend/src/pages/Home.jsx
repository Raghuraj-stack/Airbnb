import React from 'react'
import Nav from '../Components/Nav.jsx'
import { useContext } from 'react'
import { listingDataContext } from '../context/ListingContext.jsx'
import Card from '../Components/Card.jsx'
import { userDataContext } from '../context/UserContext.jsx'
import { FaSearch } from 'react-icons/fa'

function Home() {
  let { userData } = useContext(userDataContext)
  let { listing, newListing, setNewListing, searchQuery, handleSearch, setCategory } = useContext(listingDataContext)

  return (
    <div>
      <Nav />
      {userData && (
        <div className='w-full min-h-[70vh] flex items-center justify-center gap-6 flex-wrap px-6 mt-64 md:mt-36 pb-12'>
          {newListing.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center'>
              <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#FF385C]'>
                <FaSearch size={22} />
              </div>
              <h3 className='text-xl font-bold text-gray-900'>No listings found</h3>
              <p className='mt-1 max-w-sm text-sm text-gray-500'>
                {searchQuery
                  ? `We couldn't find any stays matching "${searchQuery}". Try searching for another city, landmark, or category.`
                  : 'No properties found in this category.'}
              </p>
              <button
                onClick={() => {
                  if (handleSearch) handleSearch('')
                  setCategory('Trending')
                  setNewListing(listing)
                }}
                className='mt-5 cursor-pointer rounded-xl bg-[#FF385C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e03150]'
              >
                Clear Search
              </button>
            </div>
          ) : (
            newListing.map((list) => (
              <Card
                key={list._id}
                title={list.title}
                landmark={list.landmark}
                city={list.city}
                description={list.description}
                image1={list.image1}
                image2={list.image2}
                image3={list.image3}
                rent={list.rent}
                id={list._id}
                isBooked={list.isBooked}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Home
