import React,{useEffect, useContext} from 'react'
import Navigation from '../components/Navigation'
import { AppContext } from '../context/appContext';
import {useNavigate} from 'react-router-dom'
function Chat() {
    const navigate = useNavigate()
    const {setUser} = useContext(AppContext)
    useEffect(()=>{
        if(!localStorage.getItem('user') || localStorage.getItem('user') === undefined) {navigate('/login')}
        else{setUser(JSON.parse(localStorage.getItem('user')))}

    },[navigate, setUser])
  return (
    <div>
        <Navigation link="chat"/>
    </div>
  )
}

export default Chat