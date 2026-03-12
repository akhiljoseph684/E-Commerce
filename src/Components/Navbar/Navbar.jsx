import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css'
import logo from './../../assets/logo.png'
import order_icon from './../../assets/order-icon.png'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { toast } from 'react-toastify';
import api from '../../axios';

function Navbar({color}) {


  const {user, setUser} = useContext(AuthContext);

  const {username,  userLogged, logout, isLoginPage, cartDot, setCartDot, isCartPage, admin} = useContext(AuthContext)
  

  useEffect(() => {
    async function check () {
      await userLogged()
      let res = await api.get('/auth');
      if(!res.data.success){
        toast.error(res.data.message)
        return;
      }
      setUser(res.data.user)
    } 
    check()
  }, [])
  if(cartDot && isCartPage){
  setTimeout(() => {
    document.getElementById('cart-dot').classList.add('dot')
  }, 1000)
}

  const navigate = useNavigate()


  return (
    !admin && <div className='navbar'>
        <div className="logo-name" onClick={() => navigate('/')}>
            <img src={logo} alt="" />
            <h1><i>Smart Buy</i></h1>
        </div>
        <div className="cart-login">
          <div className={`cart-icon ${cartDot && isCartPage ? 'animate' : 'dup-animate'}`} onClick={() => navigate('/cart')} onAnimationEnd={() =>  setCartDot(false)}>
            <i className={`fa-solid fa-cart-shopping`}></i>
            <div id='cart-dot'></div>
          </div>
          <div className={`cart-icon`} onClick={() => navigate('/order')}>
            <i className="fa-solid fa-inbox"></i>
          </div>
            {
              user ?
              <img src={user.image && user.image !== ""  ? user.image : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg?w=360"} alt="profile" onClick={() => navigate('/profile')} />
              :!isLoginPage ?
              <button onClick={() => navigate('/login')}>Login</button>
              : <button onClick={() => navigate('/')}>Guest</button>
            }
        </div>
    </div>
  )
}

export default Navbar