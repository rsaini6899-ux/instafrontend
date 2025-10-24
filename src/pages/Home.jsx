import React from 'react'
import MainLayOut from './MainLayOut'
import Feed from './Feed'
import RightSideBar from '../components/RightSideBar'
import  useGetAllPosts  from '../hooks/UseGetAllPost'
import useGetSuggestedUsers from '../hooks/UseGetSuggestedUsers'
// import Layout from './MainLayOut'

const Home = () => {
  useGetAllPosts()
  useGetSuggestedUsers() 
  return (
    <div className='flex'>
      <MainLayOut/>
      <Feed/>
      <div>
        <RightSideBar/>
      </div>
    </div>
  )
}

export default Home