import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

function UserOrder() {

    const {userOrder, blockPage, setBlockPage, currentUser} = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState({})

  const navigate = useNavigate()

  useEffect(()  => {
    async function check () {
      let res = await currentUser()
      if(!res){
        navigate('/login')
        return;
      }
      if(res.block && !blockPage){
          setBlockPage(!blockPage)
          navigate('/blocked')
      }
      setUser(res)
    }
    check()
  })

    useEffect(() => {
        async function check() {
            let order = await userOrder()
            setOrders(order)
        }
        check()
    }, [])

  return (
    <div className='cart'>
      {
        
        <>
          <h1>Ordered items</h1>
        <table>
         <thead>
          <tr>
        <th>Image</th>
        <th>Product Name</th>
        <th>Price (quantity)</th>
        <th>Date</th>
        <th>Status</th>
        </tr>
        </thead>
         <tbody>
    {
      orders.map((order, index) => (
        <tr key={index}>
          <td className='table-img'>
            <img src={order.product.image[0]} alt="" />
          </td>
          <td>{order.product.name}</td>
          <td>₹{`${order.product.offer_price * order.quantity} (${order.quantity})`}</td>
          <td>{order.date}</td>
          <td style={{color: order.status === 'Pending' ? 'red' : 'green'}}>{order.status}</td>
        </tr>
      ))
    }
  </tbody>
  </table>
  </>   
      }
    </div>
  )
}

export default UserOrder