import React from 'react'
import Avatar from 'react-avatar'
import  { useState } from 'react'
import Modal from 'react-modal'
import { Bookmark, Heart, MessageCircle, Send }  from 'lucide-react'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { setPosts, setSelectedPost } from '../redux/postSlice'
import { clearPosts } from '../redux/postSlice';

Modal.setAppElement('#root')

const Post = ({post}) => {

    const {user} = useSelector(store => store.auth)
    const {posts} = useSelector(store => store.post)
    const dispatch = useDispatch()
    const [text, setText] = useState('')
    const [open, setOpen]  = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [liked, setLiked] = useState(post.likes.includes(user.newUser?._id) || false)
    const[postLike, setPostLike] = useState(post.likes.length)
    const[comment, setComment] = useState(post.comments)

    const toggleModal = () => setIsOpen(!isOpen)

    const chanegeEventHandler = (e) => {
        e.preventDefault()
        const inputText = e.target.value
        if(inputText.trim()){
            setText(inputText)
        }else{
            setText('')
        }
    }

    const deletePostHandler = async () => {
        try {
            const result = await axios.delete(`http://localhost:4001/api/post/deletePost/${post._id}`, {withCredentials: true})
            const updatePostData = posts.filter((postItem) => postItem?._id !== post?._id)
            dispatch(setPosts(updatePostData))
            toast.success(result.data?.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data || "Something Went Wrong")
        }
    }

    const likeOrDislikeHandler = async () => {
            try {
                const action = liked ? 'dislike' : 'like';
                const result = await axios.get(`http://localhost:4001/api/post/${action}/${post._id}`, {withCredentials: true})
                const updatedLikes = liked ? postLike -1 : postLike + 1
                setPostLike(updatedLikes)
                setLiked(!liked)

                //apne post ko update krunga
                const updatedPostData = posts.map(p => 
                    p._id == post._id ? {
                        ...p,
                        likes : liked ? p.likes.filter(id => id !== user.newUser?._id) : [...p.likes, user.newUser?._id]
                    } : p
                    )
                    dispatch(setPosts(updatedPostData))
                toast.success(result.data?.message)
            } catch (error) {
                console.log(error)
                toast.error(error.response.data || "Something Went Wrong")
            }
    }

      
        // const handleClear = () => {
        //   dispatch(clearPosts()); // Clear Redux state
        //   console.log('Redux state cleared!');
        // };
        

    const commentHandler = async (e) => {
        e.preventDefault()
        try {
            const result = await axios.post(`http://localhost:4001/api/post/comment/${post._id}`, {text}, {withCredentials: true})
            const updatedCommentData = [...comment, result.data.comment]
            setComment(updatedCommentData)
            const updatedPostData = posts.map(p => 
                p._id == post._id ? {...p, comments : updatedCommentData} : p
                )
                dispatch(setPosts(updatedPostData))
                setText('')
            toast.success(result.data?.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data || "Something Went Wrong")
        }
    }

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
        {/* <div>
        <button onClick={handleClear} className="btn btn-danger">
            Clear Redux State
          </button>
        </div> */}
        <div className='flex items-center  justify-between'>
            <div className='flex items-center gap-2'>
                <Avatar src={post?.author[0].userImg } size="35" round={true} />
                <h1>{post?.author[0].name}</h1>
            </div>
            <div>
                <button onClick={toggleModal}>***</button>
                <Modal 
                    className=' w-[25%]  text-center mt-[18%] ms-[40%] p-4 rounded-lg  justify-between items-center shadow-lg'
                    isOpen={isOpen}
                    onRequestClose={toggleModal}
                    contentLabel="Example Dialog"
                >
                    <div className='flex flex-col justify-between gap-3'>
                        <div className=' text-red-600 cursor-pointer '><button>Unfollow</button></div>
                        <div className='cursor-pointer  '><button>Add to favoites</button></div>
                        {
                            user && user.newUser?._id === post.author[0]._id && <div className='cursor-pointer '><button onClick={deletePostHandler} >Delete</button></div>
                        }
                    </div>
                </Modal>
            </div>
        </div>
        <img 
        className='rounded-sm my-2 w-full aspect-square object-cover '
        src={post.image} 
        alt="post_img" />

       <div className='flex items-center justify-between'>
            <div className='flex gap-3 my-1 items-center'>
                {
                    liked ? <Heart onClick={likeOrDislikeHandler}  className=' cursor-pointer   fill-current text-red-600 ' /> :  <Heart onClick={likeOrDislikeHandler} className=' cursor-pointer hover:text-gray-500 ' />
                }
            <MessageCircle onClick={() => {
                dispatch(setSelectedPost(post))
               setOpen(true)}
            }  className=' cursor-pointer hover:text-gray-500 ' />
            <Send className=' cursor-pointer hover:text-gray-500 ' />
            </div>
            <div>
            <Bookmark className=' cursor-pointer hover:text-gray-500 ' />
            </div>
       </div>
       <span className='font-medium block mb-2' >{postLike} likes</span>
       <p>
        <span className='font-medium mr-2'>{post.author[0].name}</span>
        {post.caption}
       </p>
       {
        comment.length > 0 && (
            <span className='text-gray-400 cursor-pointer ' onClick={() => {
                     dispatch(setSelectedPost(post))
                    setOpen(true)}
                 } >view all {comment.length} comment</span>
        )
       }
       <CommentDialog open={open} setOpen={setOpen} />
       <div className='flex items-center justify-between'>
         <input 
         type="text"
         value={text}
         onChange={chanegeEventHandler}
         placeholder='Add a comment'
         className='outline-none  text-sm w-full'
         />
         {
          text && <span onClick={commentHandler} type='submit' className='text-[#38ADF8] cursor-pointer ' >Post</span>
         }
       </div>
    </div>
  )
}

export default Post