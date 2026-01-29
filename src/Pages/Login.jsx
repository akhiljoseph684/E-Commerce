import React, { useContext, useEffect } from 'react'
import RegisterLogin from '../Components/RegisterLogin/RegisterLogin'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'


function Login(props) {

  const {userLogged, setisLoginPage} = useContext(AuthContext)
  const navigate = useNavigate()
  useEffect(() => {
    async function check() {
      let res = await userLogged()
      if(res)navigate('/')
    }
    check()
    setisLoginPage(true)
    return () => {
      setisLoginPage(false)
    }
  }, [])
  return (
    <>
        <RegisterLogin status={props.status} />
    </>
  )
}

export default Login