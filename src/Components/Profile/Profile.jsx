import React, { useContext, useEffect, useState } from 'react'
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';


function Profile({color}) {

    const {username, logout} = useContext(AuthContext);

    const navigate = useNavigate()

    useEffect(() => {
        if(!username)navigate('/')
    })
    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }
    const letter = username ? username.charAt(0).toUpperCase() : '';

  return (
    <div className='home'>
        <div className='logo' style={{background: color}}>
            <p>{letter}</p>
        </div>
        <div className="name">
            <p>Hey👋 {username}</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Profile