import React from 'react'
import Avatar from 'react-avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex gap-3 items-center'>
            <Avatar src={comment.author[0].userImg} size="35" round={true} />
            <h1 className='font-bold text-sm'>{comment.author[0].name} <span className='font-normal pl-1'>{comment?.text}</span> </h1>
        </div>
    </div>
  )
}

export default Comment