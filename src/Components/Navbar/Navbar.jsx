import React, { useContext, useEffect, useState } from 'react';
import './Navbar.css'
import logo from './../../assets/logo.png'
import order_icon from './../../assets/order-icon.png'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { toast } from 'react-toastify';

function Navbar({color}) {

  const {username,  userLogged, logout, isLoginPage, cartDot, setCartDot, isCartPage, admin, currentUser, blockPage, setBlockPage} = useContext(AuthContext)
  

  useEffect(() => {
    async function check () {
      await userLogged()
    } 
    check()
  }, [])
  if(cartDot && isCartPage){
  setTimeout(() => {
    document.getElementById('cart-dot').classList.add('dot')
  }, 1000)
}

  const handleLogout = async () => {
    let res = await logout()
    toast.success(res.message)
    navigate('/login')
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
              username ?
              <div className='profile' style={{background: color}} onClick={() => navigate('/profile')}>{username[0].toUpperCase()}</div>
              :!isLoginPage ?
              <button onClick={() => navigate('/login')}>Login</button>
              : <button onClick={() => navigate('/')}>Guest</button>
            }
        </div>
    </div>
  )
}

export default Navbar