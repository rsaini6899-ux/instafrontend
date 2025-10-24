import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp }  from 'lucide-react'
import CreatePost from './CreatePost'
import Avatar from 'react-avatar'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import apiObj from '../api'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '../redux/AuthSlice'
import { setPosts, setSelectedPost } from '../redux/postSlice'
import { io } from 'socket.io-client'
import notificationSound from '../sounds/mixkit-software-interface-remove-2576.mp3'


const socket = io('http://localhost:4001')
socket.emit('register', 'USER_ID')

// socket.on('newNotification', (notification) => {
//   console.log('New notification received:', notification);
// })

const LeftSideBar = () => {

  const navigate = useNavigate()
  const {user , userProfile} = useSelector(store=>store.auth)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const logOutHandler = async () => {
      // e.preventDefault()
      try {
          let result = await apiObj.userLogOut()
          // console.log(result)
          let userData = result.data
          toast.success(result.data)
          dispatch(setAuthUser(null))
          dispatch(setSelectedPost(null))
          dispatch(setPosts([]))
          // localStorage.setItem("INSTA" , JSON.stringify(userData))
          navigate('/login')
        } catch (error) {
          console.log(error)
          toast.error(error.response || "Something Went Wrong")
        }
  }

  const sideBarHandler = async (text) => {
    if(text === 'Logout'){
      logOutHandler()
    }else if(text === 'Create'){
      setOpen(true)
    }else if(text === 'Profile'){
      navigate(`/profile/${user?.newUser?._id}`)
    }else if(text === 'Home'){
      navigate(`/`)
    }else if(text === 'Message'){
      navigate(`/chat-page`)
    }else if(text === 'Notifications'){
      try {
        const { data } = await axios.put(
          `http://localhost:4001/api/notification/notifications-read/${user.newUser?._id}`
        );
  
        // console.log('Notifications marked as read:', data)
  
        // Optionally, clear the notifications count after marking them as read
        setNotifications([])

      } catch (error) {
        console.error('Error marking notifications as read:', error);
        toast.error('Failed to mark notifications as read');
      }
      navigate(`/notifications/${user.newUser?._id}`)
    }
    }

      const sideBarItems = [
        { icon : <Home />, text : 'Home' },
        { icon : <Search />, text : 'Search' },
        { icon : <TrendingUp />, text : 'Explore' },
        { icon : <MessageCircle />, text : 'Message' },
        { icon : <Heart />, text : 'Notifications' },
        { icon : <PlusSquare />, text : 'Create' },
        { icon : (<Avatar src={userProfile?.userImg} size="35" round={true} />), text : 'Profile' },
        { icon : <LogOut />, text : 'Logout' },
      ]

      // console.log(sideBarItems)

    const userId = user?.newUser?._id
    
    const [notifications, setNotifications] = useState([])

  useEffect(() => {
    socket.emit('register', userId);

    socket.on('newNotification', (notification) => {
      // console.log('New Notification:', notification);

      // Play the notification sound
      const audio = new Audio(notificationSound);
      audio.play();

      // Update the notifications state
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off('newNotification');
    };
  }, [userId])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4001/api/notification/notifications-unread/${userId}`);
        // console.log(data);
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId])

  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen '>
     <div className='flex flex-col'>
        <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
        <div>
         {
         sideBarItems.map((item, index) => (
            <div onClick={() => sideBarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 '>
              {item.icon}
              <span>{item.text}</span>
              {item.text === 'Notifications' && notifications.length > 0 && (
                <button className='rounded-full h-5 w-5 absolute left-6 top-1 text-xs text-gray-900 bg-red-500'>
                  {notifications.length}
                </button>
              )}
            </div>
          ))
          }
        </div>
     </div>
     <CreatePost open={open} setOpen={setOpen} />
    </div>
    
  )
}

export default LeftSideBar