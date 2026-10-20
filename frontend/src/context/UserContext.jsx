import React, { createContext, useContext, useState, useEffect } from 'react'
import { authDataContext } from './AuthContext.jsx'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({ children }) {
  const { serverUrl } = useContext(authDataContext)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      })
      setUserData(result.data)
    } catch (error) {
      console.log(error.response?.data?.message || error.message)
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  const value = {
    userData,
    setUserData,
    getCurrentUser,
    loading,
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext