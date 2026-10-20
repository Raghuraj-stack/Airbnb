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
  let {serverUrl} =  useContext(authDataContext)
  let {userData , setUserData} = useContext(userDataContext)
  const [name, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignUp = async (e)=>{
    try {
      e.preventDefault()
      let result = await axios.post(serverUrl + "/api/auth/signup" ,{
        name , email , password
      },{withCredentials:true})
      console.log(result)
      setUserData(result.data)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className='relative w-screen min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div>
        <FaArrowLeft size={35} onClick={()=>{navigate('/')}} className='absolute left-5 top-5 cursor-pointer bg-[#FF385C] text-white rounded-full p-2'/>
      </div>
      <form onSubmit={handleSignUp} className='w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-xl'>
        <h1 className='text-3xl font-semibold text-center text-gray-900'>Welcome to AirBnb</h1>
        <p className='text-center text-gray-500 mt-1 mb-6'>Sign Up to continue to your account</p>

        <div className='flex flex-col'>
          <label htmlFor='email' className='font-semibold text-gray-800 mb-1'>
            UserName
          </label>
          <input required 
            onChange={(e)=>{setUsername(e.target.value)}}
            value={name}
            type='text'
            id='name'
            placeholder='username'
            className='p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF385C]'
          />
          <label htmlFor='email' className='font-semibold text-gray-800 mb-1'>
            Email
          </label>
          <input required
            onChange={(e)=>{setEmail(e.target.value)}}
            value={email}
            type='email'
            id='email'
            placeholder='you@example.com'
            className='p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF385C]'
          />

          <label htmlFor='password' className='font-semibold text-gray-800 mb-1'>
            Password
          </label>
          <div className='flex relative items-center'>
          <input required
          onChange={(e)=>{setPassword(e.target.value)}}
          value={password}
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
          Sign in
        </button>

        <p className='text-center text-gray-600 mt-6'>
          Already have an account?{' '}
          <a href='/login' className='font-semibold text-gray-900 underline'>
           Login
          </a>
        </p>
      </form>
    </div>
  )
}

export default SignIn