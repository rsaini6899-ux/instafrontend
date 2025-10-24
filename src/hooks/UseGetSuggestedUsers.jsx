import axios from "axios"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useDispatch } from 'react-redux'
import { setPosts } from '../redux/postSlice'
import { setSuggestedUsers } from "../redux/AuthSlice"


const useGetSuggestedUsers = async (e) => {
        const dispatch = useDispatch()
       useEffect(() => {
        const fatchSuggestedPost = async () => {
            try {
                const result = await axios.get('http://localhost:4001/api/user/suggested', {withCredentials: true})

                toast.success(result.data.message)
                  
                dispatch(setSuggestedUsers(result.data))

            } catch (error) {
                console.log(error)
             toast.error(error?.response?.data)
            }
        }
        fatchSuggestedPost()
    },[])
}

export default useGetSuggestedUsers