import React, { useContext, useEffect, useState } from 'react'
import Banner from '../Components/Banner/Banner'
import Products from '../Components/Products/Products'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom';

function Home() {

  return (
    <>
        <Banner />
        <Products />
    </>
  )
}

export default Home