import React from 'react'
import Avatar from 'react-avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const SuggestedUsers = () => {
    const {suggestedUsers} = useSelector(store => store.auth)
  return (
    <div className='my-10'>
      <div className='flex items-center justify-between mb-2 text-sm'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See All</span>
      </div>
       {
        suggestedUsers.map((user) => {
            return (
                <div key={user._id} className='flex my-5 items-center gap-5 justify-between' >
                    <div className='flex items-center gap-2' >
                        <Link to={`/profile/${user._id}`} className="flex items-center gap-2" >
                        <Avatar src={user.userImg} size='35' round={true} />
                        </Link>
                     <div>
                        <h1 className='font-semibold text-sm'> <Link to={`/profile/${user._id}`} >{user.name}</Link></h1>
                        <span className='text-gray-600 text-sm'>{user.bio}</span>
                     </div>
                   </div>
                   <span className='text-[#38ADF4] text-xm font-semibold cursor-pointer hover:text-[#3495d6]'>Follow</span>
                </div>
            )
        }) 
      } 

    </div>
  )
}

export default SuggestedUsers