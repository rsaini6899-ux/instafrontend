import axios from "axios"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useDispatch } from 'react-redux'
import { setPosts } from '../redux/postSlice'


const useGetAllPost = async (e) => {
        const dispatch = useDispatch()
    useEffect(() => {
        const fatchAllPost = async () => {
            try {
                const result = await axios.get('http://localhost:4001/api/post/getPosts', {withCredentials: true})
                toast.success(result.data.message)
                  
                dispatch(setPosts(result.data))
    
                // navigate('/')
            } catch (error) {
                console.log(error)
             toast.error(error?.response?.data)
            }
        }
        fatchAllPost()
    },[])
}

export default useGetAllPost