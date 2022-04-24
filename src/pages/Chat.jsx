import React,{useEffect, useContext, useState} from 'react'
import Navigation from '../components/Navigation'
import { AppContext } from '../context/appContext';
import {useNavigate} from 'react-router-dom'
import {KeyboardArrowDown, ContentCopy, InfoOutlined, FavoriteBorder} from '@mui/icons-material'
import {Avatar, Button} from '@mui/material'
import {BsImage, BsEmojiSmile} from 'react-icons/bs'
import Picker from 'emoji-picker-react'
import '../css/login.css'
import {socket} from '../axios/axios'
function Chat() {
    const navigate = useNavigate();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("");
    const handleEmojiPicker = () =>{
      setShowEmojiPicker(!showEmojiPicker);
    }
    const {setUser, members, user, messages, setMessages} = useContext(AppContext)
    useEffect(()=>{
        if(!localStorage.getItem('user') || localStorage.getItem('user') === undefined) {navigate('/login')}
        else{setUser(JSON.parse(localStorage.getItem('user')))}

    },[navigate, setUser]);
    const [room, setRoom] = useState(null)
    const [chatt, setChatt] = useState(null);
    const joinRoom = (chat)=>{
      setChatt(chat);
      let roomId = orderIds(user._id, chat._id);
      setRoom(roomId)
      socket.emit('join-room', roomId);
    }
    const orderIds = (id1, id2) =>{
      return id1>id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
    }
    const handleEmojiClick = (event, emoji) =>{
      let message = msg;
      message +=emoji.emoji;
      setMsg(message);
    };
    const handleMsg = (themsg) =>{
      setMsg(themsg);
    }
    const [showSend, setShowSend] = useState(false);
useEffect(()=>{
  if(msg !== ""){
    setShowSend(true)
    }else{
      setShowSend(false)
    }
  }, [msg]);
  const dates = new Date();
  const goodTime = () =>{
    let hours = dates.getHours().toString();
    let minutes = dates.getMinutes().toString();
    hours = hours.length > 1 ? hours : `0${hours}`;
    minutes = minutes.length > 1 ? minutes : `0${minutes}`;
    return `${hours}:${minutes}`;
  }
  const goodDate = () =>{
    let year = dates.getFullYear();
    let month = (1+dates.getMonth()).toString();
    let day = dates.getDate().toString();
    month = month.length > 1 ? month : `0${month}`;
    day = day.length > 1 ? day : `0${day}`;
    return `${day}/${month}/${year}`;
  }
  const sendMessage = (e) =>{
    e.preventDefault();
    if(msg !== ""){
    let time = goodTime();
    let date = goodDate();
    socket.emit('sendMessage', user._id, room, msg, time, date);
    }
    setMsg("");
  };
  const messageDiv = document.querySelector('div.message')
  useEffect(()=>{
    if(messageDiv) messageDiv.scrollTop = messageDiv.scrollHeight;
  },[messages, messageDiv]);
  socket.off('all-room-messages').on('all-room-messages', (payload)=>{
    setMessages(payload);
  });
  const handleFavorites = () =>{
    let time = goodTime();
    let date = goodDate();
    socket.emit('sendMessage', user._id, room, '❤️', time, date);
    setMsg("")
  }
  return (
    <>
    <Navigation link="chat"/>
    <div className="flex items-center w-full justify-center h-[92vh] bg-gray-200">
      <div className="bg-white w-[70%] flex border-2 border-solid border-gray-300 h-[80%]">
        <div className="w-[30%] h-full border-r-2 border-solid border-gray-300">
          <div className="flex border-b-2 border-solid border-gray-300 h-16 w-full justify-end items-center gap-16">
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-lg">{user?.username}</span>
              <KeyboardArrowDown sx={{width: '1.7rem', height: '1.7rem'}}/>
            </div>
            <ContentCopy />
          </div>
          <div className="overflow-y-auto">
            {members?.map((member, index)=>(
              <div key={index} onClick={()=>{joinRoom(member)}} className={`flex ${chatt?._id === member._id && 'bg-gray-200'} cursor-pointer py-2 px-2 hover:bg-gray-200 gap-2 items-center`}>
                {member.profile === "" ? <Avatar /> : <img src={members.profile} alt="chat"/>}
                <div className="flex flex-col">
                  <span>{member.username}</span>
                  <span className="text-gray-500">

                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[70%] relative">
          {chatt && 
          <div className="border-b-2 border-solid items-center border-gray-300 h-16 px-4 w-full flex justify-between">
          <div className="flex gap-3 items-center">
            <div className="relative">{chatt.profile === "" ? <Avatar /> : <img src={chatt.profile} alt="chat" />}{chatt.status === "Active" && <span className="absolute bg-[green] rounded-full bottom-0 right-0 h-3 w-3"></span>}</div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{chatt.username}</span>
              {chatt.status === "Active" && <span className="text-gray-400 text-base">Active now</span>}
            </div>
          </div>
          <InfoOutlined sx={{width: '2rem', height: '2rem'}}/>
          </div>}
          {chatt ? <div className="overflow-y-auto h-[74%] message img">
            {messages.map((message, index)=>(
              <div key={index}>
                <h1 className="text-gray-500 text-center py-2">{message._id}</h1>
                <div>
                  {message.messages.map((newMessage, index)=>(
                    <div key={index} className={`${newMessage.sender === user._id ? 'justify-end' : 'justify-start'} mb-4 px-4 flex`}>
                      <div className={`flex ${newMessage.sender === user._id ? 'items-end' : 'items-start'} flex-col`}>
                        <div className={`${newMessage.sender === user._id ? 'bg-gray-200' : 'bg-white border-2 border-solid border-gray-200'} px-4 py-2 rounded-[20px] text-xl min-w-[2rem] max-w-[20rem] break-words ${newMessage.message === '❤️' && 'ken text-3xl'}`}>{newMessage.message}</div>
                        <div className="font-semibold text-lg">{newMessage.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div> : <div className="h-full w-full flex items-center justify-center font-semibold text-2xl"><span>Please a user</span><BsEmojiSmile style={{backgroundColor: 'yellow', color: 'red', borderRadius: '50%'}}/></div>}
          {chatt && <div className="w-full flex justify-center absolute bottom-5">
            <form method="post" onSubmit={sendMessage} className="rounded-[30px] h-[3rem] px-4 flex justify-between items-center border-2 border-solid border-gray-300 w-[90%]">
              <div className="relative">
                <BsEmojiSmile onClick={handleEmojiPicker} style={{width: '1.6rem', height: '1.6rem', cursor: 'pointer'}}/>
                {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} style={{position: 'absolute', top: '-350px'}}/>}
              </div>
              <input type="text" autoComplete="off" value={msg} onChange={(e) => handleMsg(e.target.value)} name="chat" placeholder="Message..." className="outline-none px-3 h-full w-[87%]"/>
              <div className="flex gap-2 items-center">
                {showSend ? <Button type="submit">Send</Button> : <>
                <label htmlFor="sendImage" className="cursor-pointer"><BsImage style={{width: '1.6rem', height: '1.6rem'}}/></label>
                <FavoriteBorder onClick={handleFavorites} sx={{width: '1.7rem', height: '1.7rem'}} className="cursor-pointer"/>
                </>
                }
                <input type="file" id="sendImage" hidden/>
              </div>
            </form>
          </div>}
        </div>
      </div>
    </div>
  </>
  )
}

export default Chat