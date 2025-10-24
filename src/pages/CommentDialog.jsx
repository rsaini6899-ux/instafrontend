import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import React, { useEffect, useState } from 'react'
import Avatar from 'react-avatar'
import { useDispatch, useSelector } from 'react-redux'
import Comment from '../components/Comment'
import axios from 'axios'
import { toast } from 'react-toastify'
import { setPosts } from '../redux/postSlice'

Modal.setAppElement('#root')

const CommentDialog = ({ open, setOpen }) => {
  const {selectedPost, posts} = useSelector(store => store.post)
  const [text, setText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
   const[comment, setComment] = useState([])
  const toggleModal = () => setIsOpen(!isOpen)
  const dispatch = useDispatch()

  useEffect(() => {
    if(selectedPost){
      setComment(selectedPost?.comments)
    }
  }, [selectedPost])

 const changeEventHandler = (e) => {
    const inputText = e.target.value
    if(inputText.trim()){
      setText(inputText)
    }else{
      setText('')
    }
  }
  
  const sendMessageHandler = async (e) => {
    e.preventDefault()
    try {
        const result = await axios.post(`http://localhost:4001/api/post/comment/${selectedPost._id}`, {text}, {withCredentials: true})
        // console.log(result.data)
        const updatedCommentData = [...comment, result.data.comment]
        setComment(updatedCommentData)
        const updatedPostData = posts.map(p => 
            p._id == selectedPost._id? {...p, comments : updatedCommentData} : p
            )
            dispatch(setPosts(updatedPostData))
            setText('')
        toast.success(result.data?.message)
    } catch (error) {
        console.log(error)
        toast.error(error.response?.data || "Something Went Wrong")
    }
}


  if (!open) return null

  return (
    // <div className='' onClick={() => setOpen(false)}>
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white flex h-[50%] rounded-lg max-w-3xl w-full">
        <div className='w-[50%]'>
          <img
            className="rounded-sm w-full h-full aspect-square object-cover"
            src={selectedPost.image}
            alt="post_img"
          />
        </div>
        <div className="w-[50%] h-full flex flex-col">
          <div className="p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Link to='/'>
                <Avatar src={selectedPost.author[0].userImg} size="35" round={true} />
              </Link>
              <Link to='/' className='ms-3'>{selectedPost.author[0].name}</Link>
            </div>
            <div>
              <button onClick={toggleModal}>***</button>
              
              <Modal
                className="w-[25%] text-center mt-[10%] mx-auto p-4 rounded-lg bg-white shadow-lg outline-none"
                isOpen={isOpen}
                onRequestClose={toggleModal}
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                contentLabel="Options Modal"
                shouldCloseOnOverlayClick={true}
              >
                <div className="flex flex-col gap-4">
                  <button
                    className="text-red-600 font-bold"
                    onClick={() => {
                      console.log('Unfollow clicked');
                      toggleModal()
                    }}
                  >
                    Unfollow
                  </button>
                  <button
                    className="text-blue-600 font-bold"
                    onClick={() => {
                      console.log('Add to favorites clicked')
                      toggleModal()
                    }}
                  >
                    Add to favorites
                  </button>
                </div>
              </Modal>
            </div>
          </div>

          <hr />
          
          <div className="flex-1 overflow-y-auto p-3">
            {
             comment.map((comment) => <Comment key={comment._id} comment={comment} />)
            }
          </div>
          
          <div className="p-3 flex items-center gap-2">
            <input 
              value={text}
              onChange={changeEventHandler}
              type="text" 
              placeholder='Add a comment...' 
              className='w-full outline-none border border-gray-300 p-2 rounded' 
            />
            {          
              text && <button className='text-gray-500' onClick={sendMessageHandler}>Send</button>
            }
          </div>
        </div>
      </div>
    </div>
    // </div>
  )
}

export default CommentDialog
