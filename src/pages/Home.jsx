import React,{useEffect, useContext} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation'
import { AppContext } from '../context/appContext';
import {MoreHoriz, FavoriteBorder, Send, BookmarkBorder} from '@mui/icons-material'
import {Avatar} from '@mui/material'
import {BsChat} from 'react-icons/bs'
import '../css/login.css'
function Home() {
  const {setUser, posters} = useContext(AppContext)
  const navigate = useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('user') || localStorage.getItem('user') === undefined) {navigate('/login')}
    else{setUser(JSON.parse(localStorage.getItem('user')))}

},[setUser, navigate]);
  return (
    <div className="bg-gray-100 h-fit">
      <Navigation link={'Home'}/>
      <div className="flex mt-5 justify-center">
        <div className="w-[35rem]">
          {
            posters?.map((poster, index)=>(
              poster.posts.length > 0 && poster.posts.map((post, index)=>(
                <div key={index} className="w-full bg-white">
                  <div className="flex px-3 h-16 w-full justify-between items-center">
                    <Link to="" className="cursor-pointer items-center flex gap-2">
                      {poster.profile !== "" ? <img src={poster.profile} alt="poster"/> : <Avatar />}
                      <span className="font-semibold text-lg">{poster.username}</span>
                    </Link>
                    <MoreHoriz className="cursor-pointer"/>
                  </div>
                  <div className="overflow-auto img flex">
                    {post.post.map((post, index)=>(
                      <img key={index} className="min-w-full" src={post} alt="post"/>
                    ))}
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-2 h-10 items-center">
                      <FavoriteBorder sx={{width: '1.7rem', height: '1.7rem'}} className="cursor-pointer"/>
                      <BsChat style={{width: '1.6rem', height: '1.6rem', transform: 'rotate(270deg)'}} className="cursor-pointer"/>
                      <Send sx={{width: '1.7rem', height: '1.7rem', transform: 'rotate(-20deg)'}} className="cursor-pointer"/>
                    </div>
                    <BookmarkBorder sx={{width: '1.7rem', height: '1.7rem'}} className="cursor-pointer"/>
                  </div>
                  {post.caption !== "" && <div><span className="font-semibold text-lg">{poster.username}</span><span>:{post.caption}</span></div>}
                </div>
             ))
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Home