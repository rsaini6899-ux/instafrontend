import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Avatar from 'react-avatar'
import SuggestedUsers from './SuggestedUsers'

const RightSideBar = () => {
  const {user ,userProfile} = useSelector(store => store.auth)
  return (
    <div className='m-fit my-10 pr-36'>
      <div className='flex items-center gap-2' >
        <Link to={`/profile/${user.newUser?._id}`} className="flex items-center gap-2" >
         <Avatar src={userProfile?.userImg} size='35' round={true} />
        </Link>
        <div>
          <h1 className='font-semibold text-sm'> <Link to={`/profile/${user.newUser?._id}`} >{user.newUser?.name}</Link></h1>
          <span className='text-gray-600 text-sm'>{userProfile?.bio}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSideBar
