import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import {Route, Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import MainLayOut from './pages/MainLayOut'
import { Children, useEffect } from 'react'
import Profile from './pages/Profile'
import Notification from './pages/Notification'
import { EditProfile } from './pages/EditProfile'
import { ChatPage } from './components/ChatPage'
import {io} from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'

function App() {
   const {user} = useSelector(store => store.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    if(user){
      const socketio = io('http://localhost:4001' , {
        query: {
          userId: user?.newUser?._id
        },
        transports: ['websocket']
      })
      dispatch(setSocket(socketio))

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      })

      return () => {
        socketio.close()
        dispatch(setSocket(null))
      }
    }else{
      // socketio.close()
      dispatch(setSocket(null))
    }
  },[user, dispatch])

  return (
    <div>
    <ToastContainer/>
    <Routes>
   <Route path='/MainLayOut' element={<MainLayOut />} />
      <Route path='/' element={<Home />} />
      <Route path='/profile/:id' element={<Profile />} /> 
      <Route path='/notifications/:id' element={<Notification />} /> 
      <Route path='/signUp' element={<SignUp/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/edit/:id' element={<EditProfile/>} />
      <Route path='/chat-page' element={<ChatPage/>} />
    </Routes>
  </div>
  )
}

export default App
