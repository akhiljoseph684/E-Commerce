import React, { useContext, useState } from 'react';
import './RegisterLogin.css'
import { toast } from 'react-toastify'
import { AuthContext } from '../../AuthContext'
import { useNavigate } from 'react-router-dom';

function RegisterLogin({status}) {

    const navigate = useNavigate()
    const {register, login} = useContext(AuthContext)

    const [error, setError] = useState('');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setError('')
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(status === 'Login'){
            let res = await login(userData)
            if(res.success){
                toast.success(res.message)
                navigate('/')
            }else{
                setError(res.message)
            }
        }else{
            let res = await register(userData)
            if(res.success){
                toast.success(res.message)
                navigate('/')
            }else{
                setError(res.message)
            }
        }
    }
    
  return (
    <div className='register-login'>
        <form onSubmit={handleSubmit}>
            <h1>{status}</h1>
            {
                error &&
                <div className='error'>{error}</div>
            }
            {
                status === 'Sign Up' && 
                <input type="text" name='name' placeholder='Enter Your Name' onChange={handleChange} value={userData.name} />
            }
            <input type="email" name='email' placeholder='Enter Your Email' onChange={handleChange} value={userData.email} />
            <input type="password" name='password' placeholder='Enter Your Password' onChange={handleChange} value={userData.password} />
            <button>{status}</button>
            {
                status === 'Sign Up'
                ?
                <p>Already have an account? <span style={{color:'red'}} onClick={() => navigate('/login')}>Login</span></p>
                :
                <p> Don’t have an account? <span style={{color:'red'}} onClick={() => navigate('/register')}>Sign Up</span></p>

            }
        </form>
    </div>
    
  )
}

export default RegisterLogin