import React, { useContext, useEffect, useState } from 'react'
import RegisterLogin from '../Components/RegisterLogin/RegisterLogin'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import axios from '../axios'


function Login(props) {

  // const {userLogged, setisLoginPage} = useContext(AuthContext)
  const navigate = useNavigate()
  const [user, setUser] = useState('')

  useEffect(() => {
    const check = async () => {
      let res = await axios.get('/auth')
      if(res.data.success){
        navigate('/')
      }
    }
    check()
  }, [])

  // useEffect(() => {
  //   async function check() {
  //     let res = await userLogged()
  //     if(res)navigate('/')
  //   }
  //   check()
  //   setisLoginPage(true)
  //   return () => {
  //     setisLoginPage(false)
  //   }
  // }, [])

  return (
    <>
        <RegisterLogin status={props.status} />
    </>
  )
}

export default Login