import React, {useState, useContext} from 'react'
import {Facebook} from '@mui/icons-material'
import {Button, Alert} from '@mui/material'
import {Link, useNavigate} from 'react-router-dom'
import Bottomer from '../components/Bottomer'
import axios from '../axios/axios'
import { AppContext } from '../context/appContext'
function Signup() {
  const navigate = useNavigate()
  const links = ["Terms", "Data", "Policy ", "Cookie Policy"];
  const [values, setValues] = useState(
    {
      email: '',
      fullname: '',
      username: '',
      password: '',
    }
  );
  const getValues = (e) =>{
    setValues({...values, [e.target.name] : e.target.value})
  };
  const {setUser} = useContext(AppContext);
  const [err, setErr] = useState(null)
  const handleSignup = async(e)=>{
    e.preventDefault();
    const response = await (await axios.post('/signup', values)).data;
    if(!response.status) return setErr(response.msg)
    if(response.status) {
      setUser(response.user)
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/');
    }
  }
  return (
    <div className="bg-gray-100 h-[100%] flex-col flex gap-4 items-center py-10">
      {err && <Alert className="w-[25rem]" severity="error">{err}</Alert>
}      <div className="bg-white gap-5 py-10 h-fit border-2 flex flex-col items-center rounded-[0.3rem] border-solid border-gray-300 w-[25rem]">
        <h1 className="text-3xl text-center pb-3 font-bold">Instagram</h1>
        <div className="text-center flex flex-col text-xl font-semibold text-gray-500"><span>Sign up to see photos and videos</span><span>from your friends.</span></div>
        <Button variant="contained" style={{display: 'flex', alignItems: 'center'}} className="flex justify-center w-fit px-[4rem] py-2 rounded-lg font-semibold items-center gap-1 text-lg bg-blue-500 text-white cursor-pointer"><Facebook /><span>Log in with Facebook</span></Button>
        <div className='flex items-center gap-4'><div className='border-t-[3px] border-solid border-gray-200 w-[8rem]'></div><div>OR</div><div className='border-t-[3px] border-solid border-gray-200 w-[8rem]'></div></div>
        <form onSubmit={handleSignup} className="flex flex-col w-[20rem] gap-2" method="post" action="#">
          <input type="text" onChange={getValues} name="email" className="w-full outline-none  px-2 py-2 border-2 border-solid border-gray-200" placeholder='Mobile Number or Email'/>
          <input type="text" onChange={getValues} name="fullname" className="w-full outline-none  px-2 py-2 border-2 border-solid border-gray-200" placeholder='Full Name'/>
          <input type="text" onChange={getValues} name="username" className="w-full outline-none  px-2 py-2 border-2 border-solid border-gray-200" placeholder='Username'/>
          <input type="password" autoComplete="off" onChange={getValues} name="password" className="w-full outline-none px-2 py-2 border-2 border-solid border-gray-200" placeholder='Password'/>
          <Button type="submit" variant="contained">Sign Up</Button>
          <div className="flex flex-col"><span className="text-sm">By signing up, you agree to our</span><div>{links.map((link, index)=>(link === 'Cookie Policy' ? <div key={index}><span>and </span><Link to="" className='font-semibold  text-sm text-gray-500'>{link}</Link></div>:<Link to="" className='font-semibold text-sm text-gray-500' key={index}>{`${link}, `}</Link>))}</div></div>
        </form>
      </div>
      <div className="bg-white w-[25rem] border-solid border-gray-300 border-2 h-14 flex items-center justify-center gap-2"><span>Have an account?</span><Link to="/login" className="text-blue-700">Login</Link></div>
      <Bottomer />
    </div>
  )
}

export default Signup