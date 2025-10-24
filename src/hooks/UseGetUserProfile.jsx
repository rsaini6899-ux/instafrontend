import axios from "axios"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useDispatch } from 'react-redux'
import { setPosts } from '../redux/postSlice'
import { setUserProfile } from "../redux/AuthSlice"


const UseGetUserProfile = async (userId) => {
        const dispatch = useDispatch()
    useEffect(() => {
        const fatchUserProfile = async () => {
            try {
                const result = await axios.get(`http://localhost:4001/api/user/profile/${userId}`, {withCredentials: true})
                toast.success(result.data.message)
                  
                dispatch(setUserProfile(result.data))

            } catch (error) {
                console.log(error)
             toast.error(error?.response?.data)
            }
        }
        fatchUserProfile()
    },[userId])
}

export default UseGetUserProfile
