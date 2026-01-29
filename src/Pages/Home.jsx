import React, { useContext, useEffect, useState } from 'react'
import Banner from '../Components/Banner/Banner'
import Products from '../Components/Products/Products'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom';

function Home() {

  const {currentUser, setBlockPage, blockPage} = useContext(AuthContext);
  const [user, setUser] = useState({})

  const navigate = useNavigate()

  useEffect(()  => {
    async function check () {
      let res = await currentUser()
      if(res.block && !blockPage){
          setBlockPage(!blockPage)
          navigate('/blocked')
      }
      setUser(res)
    }
    check()
  }, [])

  return (
    <>
        <Banner />
        <Products />
    </>
  )
}

export default Home