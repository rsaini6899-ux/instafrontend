import React, { useRef, useState } from "react";
import Layout from "./MainLayOut";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setAuthUser } from "../redux/AuthSlice";

export const EditProfile = () => {
  const { user ,userProfile} = useSelector((store) => store.auth)
  const imgRef = useRef();
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState({
    userImg: user?.newUser?.userImg,
    bio: userProfile?.bio,
    gender: user?.newUser?.gender
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0]
    if(file){
      setInput({...input, userImg:file })
    }
  }

  const selectChangeHandler = (value) => {
    setInput({...input, gender: value })
  }

  const editProfileHandler = async () => {
    const formData = new FormData()
    formData.append("bio", input.bio)
    formData.append("gender", input.gender)
    if(input.userImg){
      formData.append("userImg", input.userImg)
    }
    try {
      setLoading(true)
      const result = await axios.put(`http://localhost:4001/api/user/edit/${id}`, formData, {
        headers: {
          'Content-Type':'multipart/form-data',
          // 'Authorization': `Bearer ${user.token}`
        },
        withCredentials: true
      })
      console.log(result)

      const updateData = {
        ...user,
        bio: result.data?.bio,
        gender: result.data?.gender,
        userImg: result.data?.userImg
      }

      // dispatch(setPosts([result.data.posts, ...posts]))
      dispatch(setAuthUser(updateData))
      navigate(`/profile/${user?.newUser?._id}`)
      toast.success(result.data.message)

    } catch (error) {
      console.log(error)
      toast.error(error.response.data )
    }finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center max-w-5xl mx-auto pl-10">
      <div>
        <Layout />
      </div>

      <div className="flex w-[80%] mx-auto pl-10">
        <section className="flex flex-col gap-6 w-full my-8">
          <h1 className="font-bold text-xl">Edit Profile</h1>
          <div className="flex items-center justify-between bg-gray-100 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <Avatar src={userProfile?.userImg} size="35" round={true} />
              <div>
                <h1 className="font-bold text-sm">{user?.newUser?.name}</h1>
                <span className="text-gray-600x">{userProfile?.bio}</span>
              </div>
            </div>
            <input ref={imgRef} onChange={fileChangeHandler} type="file" className="hidden" />
            <button
              onClick={() => imgRef?.current.click()}
              className="bg-[#0095F6] hover:bg-[#318bc7] text-white px-3 p-1 rounded-md"
            >
              Change Photo
            </button>
          </div>
          <div>
            <h1 className="font-bold text-xl mb-2">bio</h1>
            <textarea value={input.bio} name="bio" onChange={(e) => setInput({...input, bio: e.target.value})} className="w-full border focus-visible:ring-transparent rounded-md ps-2 pt-1"></textarea>
          </div>
          <div>
            <h1 className="font-bold mb-2">Gender</h1>
            <select defaultValue={input.gender} onValueChange={selectChangeHandler} className="w-full border p-1 rounded-md">
            <option className="hidden" value="male"></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-end">
            {loading ? (
              <button className="bg-[#0095F6] hover:bg-[#318bc7] text-white px-3 p-1 rounded-md">
                Please wait
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              </button>
            ) : (
              <button onClick={editProfileHandler} className="bg-[#0095F6] hover:bg-[#318bc7] text-white px-3 p-1 rounded-md">
                Submit
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
