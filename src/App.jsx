import React, { useEffect, useState } from 'react';
import { assets } from './assets/assets.js';
import './App.css';
import Navbar from './Components/Navbar/Navbar.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import Profile from './Components/Profile/Profile.jsx';
import Product from './Components/Product/Product.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Cart from './Components/Cart/Cart.jsx';
import Payment from './Components/Payment/Payment.jsx';
import Admin from './Pages/Admin/Admin.jsx';
import UserOrder from './Components/UserOrder/UserOrder.jsx';
import BlockPage from './Components/BlockPage/BlockPage.jsx';

function App() {

  const [color, setColor] = useState('')
const { pathname } = useLocation();


useEffect(() =>  {
  setColor(`rgb(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)})`)
}, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // remove if you want instant
    });
  }, [pathname]);

  return (
    <>
      <Navbar color={color} />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login status='Login' />}></Route>
        <Route path='/register' element={<Login status='Sign Up' />}></Route>
        <Route path='/blocked' element={<BlockPage/>}></Route>
        <Route path='/profile' element={<Profile color={color}/>}></Route>
        <Route path='/product/:id' element={<Product/>}></Route>
        <Route path='/cart' element={<Cart />}></Route>
        <Route path='/order' element={<UserOrder />}></Route>
        <Route path='/payment' element={<Payment />}></Route>
        <Route path='/admin/*' element={<Admin />}></Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App