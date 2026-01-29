import React, { useContext, useState } from 'react'
import { AuthContext } from '../../AuthContext'
import { useNavigate } from 'react-router-dom';

function AdminLogin() {

  const {adminLogin} = useContext(AuthContext);

  const navigate = useNavigate()

  const [error, setError] = useState('');
  const [admin, setAdmin] = useState({});



  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await adminLogin(admin);
    if(!res.success){
      setError(res.message)
      return;
    }
    navigate('add-products')
    return;
  }

  const handleChange = (e) => {
    setError('')
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value
    })

  }

  return (
    <div className='register-login admin-login'>
        <form onSubmit={handleSubmit}>
            <h1>Admin Login</h1>
            {
                error &&
                <div className='error'>{error}</div>
            }
            <input type="email" name='email' placeholder='Enter Your Email' onChange={handleChange} value={admin.email} />
            <input type="password" name='password' placeholder='Enter Your Password' onChange={handleChange} value={admin.password} />
            <button>Login</button>
        </form>
    </div>
  )
}

export default AdminLogin