import React,{useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation'
import { AppContext } from '../context/appContext';
function Home() {
  const {setUser} = useContext(AppContext)
  const navigate = useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem('user') || localStorage.getItem('user') === undefined) {navigate('/login')}
    else{setUser(JSON.parse(localStorage.getItem('user')))}

},[setUser, navigate])
  return (
    <div>
      <Navigation link={'Home'}/>
    </div>
  )
}

export default Home