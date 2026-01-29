import React, { useContext, useEffect, useState } from 'react';
import './Users.css'
import { AuthContext } from '../../AuthContext';

function Users() {

    const {findAllUser, saveUser} = useContext(AuthContext);
    const [users, setUsers] = useState([])
    const [render, setRender] = useState(false)

    useEffect(() => {
        async function check(){
            let u = await findAllUser()
            u = JSON.parse(u) || []
            setUsers(u)
        }
        check()
    }, [])

    const changeOption = async (user) => {
        user.block = !user.block;
        let res = await saveUser(user.email, user)
        setRender(!render)
    }

  return (
    <div className='users'>
        {
            users.length && 
            <h1>View All Users</h1>
        }
        {
            users.length &&
            users.map((user) => {
                return (
                    <div className="user-div">
                        <div className="user-details">
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                        </div>
                        <div className="block-option">
                            <p onClick={() => changeOption(user)}>{user.block ? 'UnBlock' : 'Block'}</p>
                        </div>
                    </div>
                )
            })
        }
    </div>
  )
}

export default Users