import React, { useEffect, useState } from "react";
import Layout from "./MainLayOut";
import UseGetUserProfile from "../hooks/UseGetUserProfile";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import Avatar from "react-avatar";

import { ImageOff } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  UseGetUserProfile(userId);

  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile , user } = useSelector((store) => store.auth);

  const isLoggedInUserPorfile = user?.newUser?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPosts =
    activeTab === "posts" ? userProfile?.post : userProfile.bookmarks;

  return (
    <div className="flex justify-center max-w-5xl mx-auto pl-10">
      <div>
        <Layout />
      </div>

      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar src={userProfile?.userImg} size="100" round={true} />
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.name}</span>
                {isLoggedInUserPorfile ? (
                  <div className="flex gap-3">
                      <button className="hover:bg-gray-200 rounded-lg pl-3 pr-3 bg-gray-100  text-sm h-8" onClick={() => navigate(`/edit/${userProfile._id}`)} >
                        Edit profile
                      </button>
                    <button className="hover:bg-gray-200 rounded-lg pl-3 pr-3 bg-gray-100  text-sm h-8">
                      View achive
                    </button>
                    <button className="hover:bg-gray-200 rounded-lg pl-3 pr-3 bg-gray-100  text-sm h-8">
                      Ad tools
                    </button>
                  </div>
                ) : isFollowing ? (
                  <div>
                    <button className="bg-gray-100 ms-3 rounded-lg pl-3 pr-3  text-sm h-8">
                      Unfollow
                    </button>
                    <button className="bg-gray-100 ms-4 rounded-lg pl-3 pr-3  text-sm h-8">
                      Message
                    </button>
                  </div>
                ) : (
                  <button className="bg-[#0095F6] ms-5 rounded-lg pl-3 pr-3 hover:bg-[#3192d2] text-sm h-8">
                    Follow
                  </button>
                )}
              </div>
              <div className="flex items-center gap-5">
                <p>
                  <span className="font-semibold">
                    {userProfile.post?.lenght || 0}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile.followers?.lenght || 0}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile.following?.lenght || 0}{" "}
                  </span>
                  following
                </p>
              </div>

              <div className="flex flex-col ">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <div className="flex items-center gap-1 bg-gray-100 w-fit p-1 rounded-lg">
                  <span>
                    {" "}
                    <AtSign />
                  </span>
                  <span>{userProfile?.name}</span>
                </div>
              </div>

              {/* //////////////////////// */}
              {/* <div className='ms-20'>
                  <h2>Notifications</h2>
                  {notifications.length === 0 ? (
                    <p>No notifications yet</p>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif._id}>
                        <p>{notif.message}</p>
                        <small>{new Date(notif.createdAt).toLocaleString()}</small>
                      </div>
                    ))
                  )}
                </div> */}
              {/* ////////////////// */}
            </div>
          </section>
        </div>

        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              } `}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPosts?.map((post) => {
              return (
                <div
                  key={post?._id}
                  className="relative group cursor-pointer w-full"
                >
                  <img
                    src={post.image}
                    alt="postImage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-10">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
