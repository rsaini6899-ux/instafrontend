import React from 'react'
import { useState } from 'react'
import {toast} from 'react-toastify'
import apiObj from '../api'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


const SignUp = () => {

    const navigate = useNavigate()

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const changeEventHandler = (e) => {
        setData({...data, [e.target.name]: e.target.value })
    }


    const singUpHandler = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post(
          'http://localhost:4001/api/user/signUp',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            // withCredentials: true, 
          }
        )
        console.log(res)
  
          toast.success(res.data)    
          
          navigate('/login')
      
      } catch (error) {
        toast.error(error?.response?.data || 'Something went wrong');
      }
    }

  return (
    <div className='flex items-center justify-center h-screen w-screen'>
        <form onSubmit={singUpHandler} className='shadow-lg flex flex-col gap-4 p-8'>
            <div className='my-4'>
                <h1 className='text-center text-xl font-semibold pb-1'>LOGO</h1>
                <p className='text-center text-sm'>SingUp to see photos & videos your friends</p>
            </div>
                <input 
                 value={data.name}
                 onChange={changeEventHandler}
                 type="text"
                 name='name' 
                 placeholder='Username'
                 className='border border-gray-500 rounded-lg p-1' 
                />
                 <input 
                 value={data.email}
                 onChange={changeEventHandler}
                 type="email"
                 name='email'  
                 placeholder='Email Address'
                 className='border border-gray-500 rounded-lg p-1' 
                />
                 <input 
                 value={data.password}
                 onChange={changeEventHandler}
                 type="password"
                 name='password'  
                 placeholder='Password'
                 className='border border-gray-500 rounded-lg p-1' 
                />
               
                 <button type='submit' className='bg-blue-500 text-white rounded-lg px-4 py-2'>Sign Up</button>

                 <p className='text-center text-sm mt-2'>Already have an account? <Link className='text-blue-600' to='/login'>Login</Link></p>
        </form>
    </div>
  )
}

export default SignUp