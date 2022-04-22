import React from 'react'
import {KeyboardArrowDown} from '@mui/icons-material'
import {Link} from 'react-router-dom'
function Bottomer() {
  const bottoms = ["Meta", "Blog", "Jobs", "Help", "API", "Privacy", "Terms", "TopAccounts", "Hashtags", "Locations", "Instagram Lite"];
  const bots = ["Dance", "Food & Drink", "Home & Garden", "Music", "Visual Arts"];
  const bols = [["English", <KeyboardArrowDown/>], "©2022 Instagram from Meta"];
  return (
    <>
      <div className="grid grid-cols-12 text-gray-400">{bottoms.map((bol, index)=>(<Link to="" key={index}>{bol}</Link>))}</div>
      <div className="flex gap-3 text-gray-400">{bots.map((bol, index)=>(<Link to="" key={index}>{bol}</Link>))}</div>
      <div className="flex gap-3 text-gray-400">{bols.map((bol, index)=>(bol[0] === "English" ? <Link to="" key={index}><div className="flex">{bol.map((div, index)=>(<div key={index}>{div}</div>))}</div></Link> : <span key={index}>{bol}</span>))}</div>
    </>
  )
}

export default Bottomer