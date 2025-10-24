import axios from "axios"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useDispatch, useSelector,  } from 'react-redux'
import { setPosts } from '../redux/postSlice'
import { setMessages } from "../redux/chatSlice"

const useGetAllMessage = async (e) => {
        const dispatch = useDispatch()
        const {user, selectedUser } = useSelector(store => store.auth)
    useEffect(() => {
        const fatchAllMessage = async () => {
            try {
                const result = await axios.get(`http://localhost:4001/api/message/getMessages/${selectedUser?._id}`,
                    {
                        headers: { senderid: user.newUser._id }, 
                        withCredentials: true,
                    }
                )
                console.log(result.data)
                // toast.success(result.data.message)
                  
                dispatch(setMessages(result.data.message))
    
                // navigate('/')
            } catch (error) {
                console.log(error)
             toast.error(error?.response?.data)
            }
        }
        fatchAllMessage()
    },[selectedUser])
}

export default useGetAllMessage