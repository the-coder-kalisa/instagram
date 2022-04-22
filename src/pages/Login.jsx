import React, {useContext, useState} from 'react'
import {Facebook} from '@mui/icons-material'
import login from '../images/signup.png'
import { Link, useNavigate } from 'react-router-dom'
import app from '../images/appStore.png';
import play from '../images/playStore.png';
import Bottomer from '../components/Bottomer.jsx'
import {Button, Alert} from '@mui/material'
import "../css/login.css"
import axios from '../axios/axios'
import {AppContext} from '../context/appContext'
function Login() {
    const navigate = useNavigate()
    const {setUser} = useContext(AppContext)
    const getters = [
       {
           img: app,
           link: ''
       },{
           img: play,
           link: ''
       }
    ];
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const getValues = (e) =>{
        setValues({...values, [e.target.name]: e.target.value})
    }
    const [err, setErr] = useState(null)
    const handleLogin = async(e) =>{
        e.preventDefault()
        const data = await (await axios.post('/login', values)).data;
        if(!data.status) setErr(data.msg);
        if(data.status) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user))
            navigate('/');
        }
    }
  return (
    <div className="flex py-10 bg-gray-100 h-[100%] flex-col items-center gap-5 ">
        <div className="flex pt-10 gap-7 justify-center">
        <img src={login} alt="Signup" className="h-[40rem]"/>
        <div className="flex flex-col items-center gap-3 w-[25rem]"> 
            <form onSubmit={handleLogin} method="post" action="#" className="bg-white border-[1px] w-full py-4 flex flex-col items-center border-solid border-gray-200">
                <h1 className="font-bold text-3xl py-6">Instagram</h1>
                {err && <Alert severity="error" className="w-[80%] my-5">{err}</Alert>}
                <div className="flex flex-col gap-2">
                    <input onChange={getValues} type="text" name="email" className="w-[20rem] pl-2 py-5 font-normal rounded-[3px] text-[#000000ba] border-[1px] border-solid border-gray-300 h-9 outline-none" placeholder="Phone number, username, or email"/>
                    <input onChange={getValues} type="password" autoComplete="off" name="password" className="w-[20rem] pl-2 py-5 font-normal rounded-[3px] text-[#000000ba] border-[1px] border-solid border-gray-300 h-9 outline-none" placeholder="Password"/>
                    <Button type="submit" variant="contained" className="w-[20rem] h-9 outline-none text-white rounded-[3px] bg-[#0094f682] font-semibold text-lg">Login</Button>
                    <div className="flex flex-row justify-between w-full items-center"><div className='border-t-2 border-solid border-gray-300 w-[8.5rem]'></div><span>OR</span><div className='border-t-2 border-solid border-gray-300 w-[8.5rem]'></div></div>
                    <Button style={{display: 'flex', gap: 5, alignItems: 'center'}}><Facebook /><span>Login with Facebook</span></Button>
                    <Link to="/forgot" className="text-center py-3 text-[#223f79d4]">Forgot password?</Link>
                </div>
            </form>
            <div className="bg-white w-full border-[1px] border-solid py-4 flex items-center justify-center border-gray-300">
                <span>Don't have an account?</span><Link to="/signup" className="text-blue-500 text-lg ml-2 font-medium">Sign up</Link>
            </div>
            <div>Get app.</div>
            <div className="flex gap-2 h-12">{getters.map((get, index)=>(<Link to={get.link} key={index}><img src={get.img} className="h-full" alt={JSON.stringify(get.img)}/></Link>))}</div>
        </div>
        </div>
        <Bottomer />
    </div>
  )
}

export default Login