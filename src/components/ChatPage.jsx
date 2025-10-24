import React, { useEffect, useState } from "react";
import Layout from "../pages/MainLayOut";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import { setSelectedUser } from "../redux/AuthSlice";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Messages } from "./Messages";
import axios from "axios";
import { setMessages } from "../redux/chatSlice";

export const ChatPage = () => {
  const dispatch = useDispatch();
  const [textMessage, setTextMessage] = useState("");
  const [msg, setMsg] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);

  // const isOnline = true;

  const sendMessageHandler = async (receiverId) => {
    try {
      const response = await axios.post(
        `http://localhost:4001/api/message/sendMessage/${receiverId}`,
        { textMessage, senderId: user.newUser._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("response", response);
      dispatch(
        setMessages([...(messages || []), response.data?.message.message])
      );
      setTextMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div>
      <div>
        <Layout />
      </div>

      <div className=" flex ml-[16%] h-screen">
        <section className="w-full md:w-1/4 my-8 ">
          <h1 className="font-bold mb-4 px-3 text-xl">{user?.newUser?.name}</h1>
          <hr className="mb-4 border-gray-300" />
          <div className="overflow-auto h-[80vh]">
            {suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <Avatar src={suggestedUser?.userImg} size="45" round={true} />
                  <div className="flex flex-col">
                    <span className="font-medium">{suggestedUser?.name}</span>
                    <span
                      className={`text-xs font-bold ${
                        isOnline ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        {selectedUser ? (
          <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
            <div className="flex gap-3 items-center px-3 py-2 border-b border-gry-300 sticky top-0 bg-white z-10">
              <Avatar src={selectedUser.userImg} size="35" round={true} />
              <div className="flex flex-col">
                <span>{selectedUser?.name}</span>
              </div>
            </div>
            <Messages selectedUser={selectedUser} />
            <div className="flex items-center p-4 border-t border-t-gray-300">
              <input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                name=""
                className="flex-1 border p-1 rounded-md mr-2 focus-visible:ring-transparent"
                placeholder="Messages..."
              />
              <button onClick={() => sendMessageHandler(selectedUser?._id)}>
                Send
              </button>
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center mx-auto">
            <MessageCircle className="w-32 h-32 my-4" />
            <h1>Your messages</h1>
            <span>Send a message to start a chat.</span>
          </div>
        )}
      </div>
    </div>
  );
};
