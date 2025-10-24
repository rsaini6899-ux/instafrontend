import React from 'react'
import { useState } from 'react'
import {toast} from 'react-toastify'
import {  Loader2 } from 'lucide-react'
import apiObj from '../api'
import { Link, useNavigate, } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/AuthSlice'
import axios from 'axios'

const Login = () => {
  const [loading, setLoading] = useState(false)

      const navigate = useNavigate()
    const dispatch = useDispatch()

    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const changeEventHandler = (e) => {
        setData({...data, [e.target.name]: e.target.value })
    }
   
      // const logunHandler = async (e) => {
      //   e.preventDefault();
      //   try {
      //     const res = await apiObj.userLogin(data, {
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       withCredentials: true,
      //     })

      //     console.log(res)

      //       toast.success(res.data.message)
  
      //       dispatch(setAuthUser(res.data))

      //       navigate('/');
      //   } catch (error) {
      //     toast.error(error?.response?.data || 'Something went wrong')
      //   }
      // }

      const logunHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const res = await axios.post(
            'http://localhost:4001/api/user/login',
            data,
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          )
      
            toast.success(res.data.message)
  
            dispatch(setAuthUser(res.data))

            navigate('/')

        } catch (error) {
          toast.error(error?.response?.data || 'Something went wrong')
        }finally {
          setLoading(false)
        }
      }
      
  return (
    <div className='flex items-center justify-center h-screen w-screen'>
        <form onSubmit={logunHandler} className='shadow-lg flex flex-col gap-4 p-8'>
            <div className='my-4'>
                <h1 className='text-center text-xl font-semibold pb-1'>LOGO</h1>
                <p className='text-center text-sm'>SingUp to see photos & videos your friends</p>
            </div>
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

{
    data && (
        <button
            type="submit"
            className={`bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center justify-center`}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Please wait
                </>
            ) : (
                "Login"
            )}
        </button>
    )
}



                 <p className='text-center text-sm mt-2'>Create a account? <Link className='text-blue-600' to='/signup'>SingUp</Link></p>

        </form>
    </div>
  )
}

export default Login