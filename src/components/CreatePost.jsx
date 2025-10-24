import React, { useRef, useEffect, useState } from 'react'
import { readFileAsDataUrl } from './readFile'
import {  Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import apiObj from '../api'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../redux/postSlice'


const CreatePost = ({ open, setOpen }) => {
  const modalRef = useRef(null)
  const imgRef = useRef()
  const [file, setFile] = useState('')
  const [caption, setCaption] = useState('')
  const [imgPreview, setImgPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {posts} = useSelector(store => store.post)

  const fileChangeHandler = async (e) => {
    // e.preventDefault()
    const file = e.target.files[0]
    if(file){
        setFile(file)
        const dataUrl = await readFileAsDataUrl(file)
        setImgPreview(dataUrl)
    }
  }

  const createPostHandler = async (e) => {
    const formData = new FormData()
    formData.append('caption', caption)
    if(imgPreview) formData.append('image', file)
    try {
         setLoading(true)
        // let result = await apiObj.addNewPost(formData)
        const result = await axios.post(
          'http://localhost:4001/api/post/addNewPost',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        )
        // console.log(result)
        toast.success(result.data.message)
        dispatch(setPosts([result.data.posts, ...posts]))
        setOpen(false)  
      } catch (error) {
        console.log(error)
        toast.error(error.response.data );
      } finally {
        setLoading(false)
      }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setOpen])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div 
        ref={modalRef}
        className="bg-white h-auto rounded-lg max-w-3xl w-[30%]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className='text-center py-2 font-semibold'>
          Create a post
        </header>
        <hr />
        <div className='w-[50%] text-center pb-5 mx-auto'>
        <img className='ms-10 w-[50%]' src="https://i.etsystatic.com/34485599/r/il/dee909/5140040715/il_570xN.5140040715_7bjs.jpg" alt="" />
        <span>Drag photos and videos here</span>
        <textarea 
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
          className='w-full h-[calc(100%-4rem)] p-3 resize-none outline-none focus-visible:ring-transparent' 
          placeholder="Write something..."
        />
        {
            imgPreview && (
                <div>
                    <img className=' w-[80%]' src={imgPreview} alt="preview_img" />
                </div>
            )
        }
        <input ref={imgRef} onChange={fileChangeHandler} className='hidden' type='file' />
        <button onClick={() => imgRef.current.click()} className='w-full bg-[#0095FB] hover:bg-[#258bcf] text-center mt-5 text-white p-1 rounded-sm'>Select from computer</button>
        {
    imgPreview && (
        <button
            onClick={createPostHandler}
            type="submit"
            className={`w-full bg-[#0095FB] hover:bg-[#258bcf] text-center mt-5 text-white p-1 rounded-sm flex items-center justify-center`}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Please wait
                </>
            ) : (
                "Post"
            )}
        </button>
    )
}

        </div>
      </div>
    </div>
  )
}

export default CreatePost