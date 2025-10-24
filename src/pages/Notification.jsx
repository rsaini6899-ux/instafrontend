import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client'
const socket = io('http://localhost:4001');
socket.emit('register', 'USER_ID');


socket.on('newNotification', (notification) => {
  console.log('New notification received:', notification);
});


const Notification = () => {
    const params = useParams()
    const userId = params.id
    console.log('userId:', userId)

      const [notifications, setNotifications] = useState([])
      const [todayNotifications, setTodayNotifications] = useState([])
      const [olderNotifications, setOlderNotifications] = useState([])


    useEffect(() => {

      socket.emit('register', userId);

      socket.on('newNotification', (notification) => {
          // console.log('New Notification:', notification);
          setNotifications((prev) => [notification, ...prev]); 
      });

      return () => {
          socket.off('newNotification'); 
      };
  }, [userId])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4001/api/notification/notifications/${userId}`)
        console.log(data)
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const socket = io('http://localhost:4001')
    
    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    return () => {
        socket.disconnect();
    }
}, [])

useEffect(() => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Midnight of today

  const todayNotifs = notifications.filter((notif) => new Date(notif.createdAt) >= startOfDay);
  const olderNotifs = notifications.filter((notif) => new Date(notif.createdAt) < startOfDay);

  setTodayNotifications(todayNotifs);
  setOlderNotifications(olderNotifs);
}, [notifications]);

    return (

    <div className='ms-20 flex gap-10  mt-5'>
      <div>
        <h2>Today's Notifications</h2>
        {todayNotifications.length === 0 ? (
          <p>No notifications for today</p>
        ) : (
          todayNotifications.map((notif) => (
            <div key={notif._id} className="mb-4">
              <p>{notif.message}</p>
              <small>{new Date(notif.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
      <div>
        <h2>Older Notifications</h2>
        {olderNotifications.length === 0 ? (
          <p>No older notifications</p>
        ) : (
          olderNotifications.map((notif) => (
            <div key={notif._id} className="mb-4">
              <p>{notif.message}</p>
              <small>{new Date(notif.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
  </div>
  )
}

export default Notification