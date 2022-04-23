import {Add, Explore, FavoriteBorder, ExploreOutlined, Favorite, Search, 
    ArrowDropUp, Circle, Close, VideoLibraryOutlined, ArrowBack, ContentCopy,
    Code, ZoomIn, Bookmark, Settings, PublishedWithChanges } from '@mui/icons-material'
import thecoder from "../images/messenger.png";
import React, { useContext, useEffect, useState } from 'react'
import {BsMessenger} from 'react-icons/bs'
import {Link, useNavigate} from 'react-router-dom'
import {IoHomeOutline, IoHomeSharp} from 'react-icons/io5'
import { Avatar, Button, CircularProgress, IconButton } from '@mui/material';
import { AppContext } from '../context/appContext';
import axios,{socket} from '../axios/axios'
import "./src.css"
function Navigation ({link}){
    const {user, setMembers, setUser, setPosters} = useContext(AppContext);
    const icons = [
        {name: <IoHomeSharp style={{height: 30, width: 30}}/>, link, now: "Home", active: <IoHomeOutline style={{height: 30, width: 30}}/>},
        {name: <BsMessenger style={{height: 30, width: 30}}/>, link, now: "chat", active: <img src={thecoder} alt="thecoder" className="h-[30px]"/>},
        {name: <Add style={{height: 30, width: 30}}/>, function: 'post'},
        {name: <Explore style={{height: 30, width: 30}}/>, link, now: "explore", active: <ExploreOutlined style={{height: 30, width: 30}}/>},
        {name: <Favorite style={{height: 30, width: 30}}/>, active: <FavoriteBorder style={{height: 30, width: 30}}/>, function: 'loved'},
        {name: <Avatar style={{height: 30, width: 30}}/>, link}
    ]
    const [div, setDiv] = useState(false)
    const focused = () =>{
        setDiv(true);
    }
    const notFocused = ()=>{
        setDiv(false)
    }

    // const [recent, setRecent] = useState(null);
    const [searchers, setSearchers] = useState([])
    socket.off('search').on('search', (payload)=>{
        let newSearch = [];
        if(user){
            for(let i=0; i<payload.length; i++){
                if(payload[i]._id === user._id){
                    continue;
                }
                newSearch.push(payload[i]);
            }
            setSearchers(newSearch)
        }
    })
    socket.off('new-user').on('new-user', (payload)=>{
        setPosters(payload)
        let newUser = []
        if(user){
            for(let i=0; i<payload.length; i++){
                if(payload[i]._id === user._id){
                    continue;
                }
                newUser.push(payload[i]);
            }
            setMembers(newUser)
        }
    })
    useEffect(()=>{
        if(user){
            socket.emit('new-user');
        }
    }, [user]);
    const [sharedFollowers, setSharedFollowers] = useState([]);
    const search = (e)=>{
        setChanged(true)
        if(e.target.value === "") return setChanged(false);
        socket.emit('search', e.target.value)
        socket.emit('get_ids', sharedFollowers)
    }
    const [fol, setFol] = useState([])
    const [changed, setChanged] = useState(false);
    socket.off('get_ids').on('get_ids', (payload)=>{
        setFol(payload)
    });
    const [mrpost, setMrPost] = useState(false)
    const post = () =>{
        setMrPost(true);
    }
    const favorite = () =>{
        console.log('loved')
    }
    const [profile, setProfile] = useState(false)
    const view = () =>{
        setProfile(true)
    }
    const notPost = ()=>{
        setMrPost(false);
        setFiles([]);
        setPreview([]); 
    }
    const [files, setFiles] = useState([]);
    const [preview, setPreview] = useState([]);
    var myfiles = [];
    const [lastOne, setLastOne] = useState([]);
    const getPost = (e)=>{
        setFiles([...files, e.target.files])
        let images = []
        myfiles.push(...e.target.files);
        setLastOne([...myfiles])
        myfiles.map((file)=>{
            return images.push(URL.createObjectURL(file))
        })
        setPreview([...preview, ...images])
    }
    const [discard, setDiscard] = useState(false)
    const getDiscard = () =>{
        if(!finalShare) {setDiscard(true)}
        else{setFinalShare(false)}
    }
    const cancelPost = () =>{
        setFiles([]);
        setPreview([]);
        setDiscard(false)
    }
    const cancelThem = ()=>{
        setDiscard(false)
    }
    const [showers, setShowers] = useState(false)
    const uploadAnother = () =>{
        setShowers(true)
    }
    const removePost = (img)=>{
        const btn = preview?.filter((value, index, array)=>{
            return value !== img;
        });
        setPreview([...btn])
    }
    const [finalShare, setFinalShare] = useState(false);
    const [caption, setCaption] = useState("");
    const [posting, setPosting] = useState(false)
    const navigate = useNavigate();
    const shares = async() =>{
        if(!finalShare) setFinalShare(true);
        if(finalShare) {
            try{
                setPosting(true);
                if(lastOne.length > 0){
                let goodPosts = [];
                    for(let i=0; i<lastOne.length; i++){
                    const data = new FormData();
                    data.append('file', lastOne[i]);
                    data.append('upload_preset', 'z2u2gblf');
                    let res = await fetch('https://api.cloudinary.com/v1_1/doubfwhsl/image/upload', {
                        method: 'post',
                        body: data
                    })
                    const urlData = await res.json();
                    goodPosts.push(urlData.url);
                    }
                const the = () =>{
                    var dates = new Date();
                    var month = (dates.getMonth()+1).toString();
                    var day = dates.getDate().toString();
                    day = day.length > 1 ? day : `0${day}`;
                    var year = dates.getFullYear();
                    month = month.length > 1 ? month : `0${month}`;
                    var hours = dates.getHours().toString();
                    hours = hours.length > 1 ? hours : `0${hours}`;
                    var minutes = dates.getMinutes().toString();
                    minutes = minutes.length > 1 ? minutes : `0${minutes}`;
                    var seconds = dates.getSeconds().toString();
                    seconds = seconds.length > 1 ? seconds : `0${seconds}`;
                    let todayDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
                    return todayDate;
                }
                let _id = user._id;
                const response = await (await axios.post('/post', {post: goodPosts, date: the(), caption, _id})).data;
                setUser(response.user);
                localStorage.setItem('user', JSON.stringify(response.user))
                setPosting(false);
                notPost();
                navigate('/');
                }
            }catch(e){
                console.log(e) 
            }
        }
    }
    const views = [
        {icon: <Avatar sx={{width: '2rem', height: '2rem'}}/>, name: 'Profile'},
        {icon: <Bookmark sx={{width: '2rem', height: '2rem'}}/>, name: 'Saved'},
        {icon: <Settings sx={{width: '2rem', height: '2rem'}}/>, name: 'Settings'},
        {icon: <PublishedWithChanges sx={{width: '2rem', height: '2rem'}}/>, name: 'Switch Accounts'}
    ]
    return(
        <>
        {discard && 
        <div className="flex fixed h-full w-full z-50 items-center justify-center bg-[#000000aa]">
            <div className="bg-white rounded-[10px] flex w-[26rem] h-[14rem] justify-between flex-col">
                <div className="flex flex-col gap-3 my-6 items-center">
                <h1 className="text-xl font-bold">Discard post?</h1>
                <h1 className="text-gray-500">if you leave your edits wont't be saved</h1>
                </div>
                <Button onClick={cancelPost} style={{color: 'red', borderTop: '1px solid gray', borderBottom: '1px solid gray', paddingTop: 10, paddingBottom: 10, width: '100%', fontWeight: 'bold'}}>Discard</Button>
                <Button style={{paddingBottom: 10, width: '100%'}} onClick={cancelThem}>cancel</Button>
            </div>
        </div>}
        {mrpost && 
            <div className="h-[100%] z-40 w-[100%] fixed flex items-center justify-center bg-[#000000aa]">
                <Close className="absolute cursor-pointer top-0 right-0 text-white" sx={{width: '2.5rem', height: '2.5rem'}} onClick={notPost} />
                {preview.length !== 0 ?
                (!posting ? <div className={`bg-white flex-col flex relative rounded-lg w-[${finalShare ? '50rem' : '35rem'}] h-[35rem]`}>
                        <div className="w-full flex justify-between items-center text-center border-b-2 border-solid py-3 border-gray-200 font-semibold text-xl">
                         <ArrowBack className="cursor-pointer" sx={{width: '2rem', height: '2rem'}} onClick={getDiscard}/>
                         <h1>Crop</h1> 
                         <Button className="cursor-pointer" onClick={shares}>{finalShare ? 'Share' : 'Next'}</Button> 
                       </div>  
                       <div className="flex">
                       <div className="absolute bottom-0 flex w-full flex-col items-end ite">
                        {showers && preview.length !== 0 && !finalShare &&
                         <div className="bg-[#000000aa] rounded-[10px] max-w-[30rem] min-w-fit img flex items-center">
                             <div className="flex p-2 max-w-[28rem] img gap-2 overflow-auto">
                            {preview.map((img, index)=>(
                                    <div className="relative flex overflow-hidden h-[10rem] w-[10rem] min-w-[10rem] items-centerpx-4 py-2 items-center gap-3" key={index}>
                                        <IconButton style={{position: 'absolute', top: 7, right: 3, background: '#000000aa', height: '1.5rem', width: '1.5rem'}} onClick={()=>{removePost(img)}}><Close style={{color: 'white'}}/></IconButton>
                                        <img src={img} alt="view" className="min-h-full"/>
                                    </div>
                            ))}
                            </div>
                            <IconButton style={{border: '2px solid #c5c5c5', }} className="cursor-pointer"><label htmlFor='uploadAnother' className="cursor-pointer"><Add style={{color: '#c5c5c5', width: '2rem', height: '2rem'}}/></label></IconButton>
                            <input type="file" id="uploadAnother" accept="image/*" onChange={getPost} hidden multiple/>
                        </div>}
                        {!finalShare && 
                        <div className="px-3 w-full flex justify-between">
                            <div className="flex gap-3">
                                <IconButton style={{color: 'white', backgroundColor: '#434141'}}><Code style={{transform: 'rotate(-40deg)'}}/></IconButton>
                                <IconButton style={{color: 'white', backgroundColor: '#434141'}}><ZoomIn /></IconButton>
                            </div>
                            <IconButton onClick={uploadAnother} style={{color: 'white', backgroundColor: '#434141'}}><ContentCopy /></IconButton>
                       </div>}
                        </div>
                    <div className="flex overflow-auto img w-full h-[32.3rem]">
                   {preview.map((img, index)=>(
                        <div key={index} className="h-full min-w-full overflow-auto img rounded-bl-lg  bg-cover bg-center">
                            <img src={img} className="min-h-full"  alt="post"/>
                        </div>
                   ))}
                   </div>
                   {finalShare && <div className="bg-white h-[32.3rem] rounded-r-[10px] w-[50rem]">
                       <div className="flex gap-2 items-center">{user.profile === "" ? <Avatar /> : <img src={user.profile} alt="profile"/>}<span className="font-semibold text-lg">{user.username}</span></div>
                       <textarea onChange={(e)=> {setCaption(e.target.value)}} className="outline-none resize-none h-1/2 w-full" placeholder="Write a caption"></textarea>
                    </div>}
                   </div>
                </div> : 
                <div className="bg-white flex items-center justify-center h-[30rem] w-[30rem]">
                    <CircularProgress />
                </div>)
                : <div className="bg-white rounded-lg w-[32rem] h-[35rem]">
                    <h1 className="w-full text-center border-b-2 border-solid py-3 border-gray-200 font-semibold text-xl">Create new post</h1>  
                    <div className="h-[80%] gap-4 w-full flex flex-col items-center justify-center">
                        <VideoLibraryOutlined sx={{width: '4rem', height:'4rem'}}/>
                        <h1 className="text-gray-500 text-lg">Drag photos and videos here</h1>
                        <Button variant='contained' className="cursor-pointer"><label htmlFor="upload" className="cursor-pointer">Select from computer</label></Button>
                        <input id="upload" type="file" accept="image/*" onChange={getPost} hidden multiple/>
                     </div>
                </div>
                }
            </div>}
        <div className="bg-white justify-center py-3 gap-[25rem] items-center border-b-2 border-solid flex border-gray-200">
            <Link to="/" className="text-3xl font-semibold">Instagram</Link>  
        {user &&
            <div className="flex items-center gap-10">
                <div className="relative" >
                   <div className="bg-gray-200 px-3 flex gap-2 items-center rounded-[10px] py-2"><Search style={{color: 'gray'}}/><input onFocus={focused} onBlur={notFocused} type="search" name="search" onChange={search} className="outline-none bg-transparent w-[15rem]" autoComplete="off" placeholder="Search"/></div>
                  {div && 
                  <div>
                  <ArrowDropUp style={{position: 'absolute', left: '42%',top: '1.5rem', height: '3.5rem', width: '3.5rem', color: 'gray'}}/>
                   <div className="absolute border-2 w-[25rem] -left-12 top-14 border-solid shadow-md border-gray-200 rounded-md bg-white">
                       {!changed ? <>
                       <div className="px-3 py-3 flex justify-between"><h1 className="text-lg font-medium">Recent</h1><Button>Clear All</Button></div>
                       <div className="h-[20rem] flex items-center justify-center text-gray-300 font-semibold text-lg">No recent searches</div>  
                       </>: <div className={`h-[24rem] ${searchers.length === 0 ? 'items-center justify-center' : 'flex-col mt-2'} overflow-auto flex`}>{searchers.length === 0 ? "No results found" : 
                       searchers.map((search, index)=>{
                           for(let i =0; i<user.followers; i++){
                               for(let j=0; j<search.followers; j++){
                                   if(user.followers[i] === search.followers[j] || user.following[i] === search.following[j] || user.followers[i] === search.following[j] || user.following[i] === search.followers[j]){
                                       setSharedFollowers([...sharedFollowers, search.followers[j]])
                                   }
                               }
                           }
                        return(
                       <Link to={`/viewProfile/${search.username}`} key={index} className="flex gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                           {search.profile === "" ? <Avatar sx={{width: '3rem', height: '3rem'}}/>: <img src={search.profile} alt="profilesea"/>}
                           <div>
                               <span className="font-bold">{search.username}</span>
                               <div>
                                   <span className="text-gray-500">{search.fullname}</span>
                                   {sharedFollowers.length !== 0 && <div><Circle sx={{width: '1rem', height: '1rem'}} style={{color: 'gray'}}/><span>Followed</span>
                                   <div>
                                       {fol.map((fol, index)=>(
                                           <div key={index}>{fol},</div>
                                       ))}
                                   </div>
                                   </div>}
                                </div>
                            </div>
                        </Link>)})}</div>}
                   </div>
                   </div>
                   }
                </div>
                <div className='flex gap-5 items-center'>
                    {icons.map((icon, index)=>(
                        icon.now !== undefined ? <Link key={index} to={icon.now === 'Home' ? '/' : `/${icon.now}`}>{icon.now === icon.link ? icon.name : icon.active}</Link> : <div className="relative" key={index}><IconButton onFocus={icon.function === 'post' ? post : (icon.function === 'loved' ? favorite : view)} onBlur={()=>{setProfile(false)}}>{icon.name}</IconButton>
                        {profile && icon.function !== "loved" && icon.function !== "post" &&
                        <div className="relative">
                        <ArrowDropUp className="absolute -top-4" sx={{width: '3rem', height: '3rem', color: 'gray'}}/>
                        <div className="bg-white rounded-md border-2 border-solid border-gray-300 shadow-md drop-shadow-md absolute top-3 right-2 w-[15rem] ">
                            {views.map((view, index)=>(
                                <Link to="" key={index} className="flex w-full hover:bg-gray-200 py-2 pl-2 cursor-pointer gap-3 items-center">
                                    {view.icon}
                                    <span className="font-[300] text-gray-600">{view.name}</span>
                                </Link>
                            ))}
                            <Button style={{color: 'black', display: 'flex', justifyContent: 'flex-start', borderTop: '2px solid gray', paddingTop: '0.5rem'}} className="w-full">Log Out</Button>
                            </div>
                            </div>
                            }
                        </div>
                    ))}
                </div>
            </div>}
        </div>
        </>
    )
}
export default Navigation 