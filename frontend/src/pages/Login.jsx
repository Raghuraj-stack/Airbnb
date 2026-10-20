import React, { useContext } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { authDataContext } from '../context/AuthContext.jsx';
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { userDataContext } from '../context/UserContext.jsx';
function SignIn() {
  const [eyeToggle, setEyeToggle] = useState(false)
  let {userData , setUserData} = useContext(userDataContext)
  let {serverUrl} =  useContext(authDataContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e)=>{
    try {
      e.preventDefault()
      let result = await axios.post(serverUrl + "/api/auth/login" ,{
        email , password
      },{withCredentials:true})
      console.log(result)
      setUserData(result.data)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }


  
  return (
    <div className='w-screen min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div>
              <FaArrowLeft onClick={()=>{navigate('/')}} size={35} className='absolute left-5 top-5 cursor-pointer bg-[#FF385C] text-white rounded-full p-2'/>
            </div>
      <form onSubmit={handleLogin} className='w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-xl'>
        <h1 className='text-3xl font-semibold text-center text-gray-900'>Welcome to AirBnb</h1>
        <p className='text-center text-gray-500 mt-1 mb-6'>Login to continue</p>

        <div className='flex flex-col'>
          
          <label htmlFor='email' className='font-semibold text-gray-800 mb-1'>
            Email
          </label>
          <input
          onChange={(e)=>{setEmail(e.target.value)}}
            type='email'
            id='email'
            placeholder='you@example.com'
            className='p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF385C]'
          />

          <label htmlFor='password' className='font-semibold text-gray-800 mb-1'>
            Password
          </label>
          <div className='flex relative items-center'>
          <input
          onChange={(e)=>{setPassword(e.target.value)}}
            type = {eyeToggle ? "text" : "password"}
            id='password'
            placeholder='Enter your password'
            className='w-full p-3 border  border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[#FF385C]'
          />  
          {eyeToggle == true ? <FaRegEye className='absolute right-4 cursor-pointer' onClick={()=>{
            setEyeToggle(!eyeToggle)
          }}/>
        :
        <FaRegEyeSlash className='absolute right-4 cursor-pointer' onClick={()=>{
            setEyeToggle(!eyeToggle)
          }}/>
        }
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer'
        >
          Login
        </button>

        <p className='text-center text-gray-600 mt-6'>
          Don't have an account?{' '}
          <a href='/signup' className='font-semibold text-gray-900 underline'>
           SignUp
          </a>
        </p>
      </form>
    </div>
  )
}

export default SignIn