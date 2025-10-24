import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useGetAllMessage from "../hooks/UseGetAllMessage";
import { setMessages } from "../redux/chatSlice";
import axios from "axios";

export const Messages = ({ selectedUser }) => {
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [senderid, setSenderid] = useState("");
  const [reciverid, setReciverid] = useState("");
  const { user} = useSelector((store) => store.auth);
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);

  /////
  useEffect(() => {
    const fatchAllMessage = async () => {
      try {
        const result = await axios.get(
          `http://localhost:4001/api/message/getMessages/${selectedUser?._id}`,
          {
            headers: { senderid: user.newUser._id },
            withCredentials: true,
          }
        );
        // console.log(result.data[0].participants[1])
        setSenderid(result.data[0].participants[1]);

        setMsg(result.data);
        // toast.success(result.data.message)

        dispatch(setMessages(result.data.message));

        // navigate('/')
      } catch (error) {
        console.log(error);
        //  toast.error(error?.response?.data)
      }
    };
    // fatchAllMessage()
    const interval = setInterval(fatchAllMessage, 1000); // 5 seconds me ek baar call karega

    return () => clearInterval(interval);
  }, [selectedUser]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar src={selectedUser.userImg} size="80" round={true} />
          <span>{selectedUser.name}</span>
          <Link to={`/profile/${selectedUser._id}`}>
            <button className="h-8 my-2 px-3 rounded-md bg-gray-100 ">
              View profile
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col w-full gap-3">
        {msg &&
          msg?.map((conversation) => (
            <div key={conversation._id}>
              {conversation.message.map((msgItem) => (
                <div
                  key={msgItem._id}
                  className={`flex w-full border p-2 ${
                    senderid === user?.newUser?._id
                      ? "justify-end text-white bg-blue-500"
                      : reciverid === selectedUser._id
                      ? "justify-start text-white bg-gray-500"
                      : "bg-black-300 text-white"
                  }`}
                >
                  <div className="p-2 rounded-lg max-w-xs bg-blue-500">
                    {msgItem.message}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};
