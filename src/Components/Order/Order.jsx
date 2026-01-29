import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../AuthContext';
import './Order.css'

function Order() {

    const {getAllOrders, findAllUser} = useContext(AuthContext);
        const [orders, setOrders] = useState([])
        const [sort, setSort] = useState('')
        const [search, setSearch] = useState('')
    
        useEffect(() => {
            async function check() {
                let res = await getAllOrders()
                if(res){
                    setOrders(res)
                }
            }
            check()
        }, [])

        if(sort === 'latest'){
            orders.reverse()
        }

        const sortedProducts = orders ? [...orders].sort((a, b) => {
        switch (sort) {
          case "low":
            return a.product.offer_price - b.product.offer_price;
          case "high":
            return b.product.offer_price - a.product.offer_price;
          default:
            return a.id - b.id;
        }
      }) : []
        const dropDownChange = async (value, id) => {
            let email = '';

            let obj = orders.map(x => {
                    if(x.id === id){
                        email = x.user.email
                        return {...x, ['status']: 'Delivered'}
                    }
                    return x;
                })
            let users = await findAllUser()
            users = JSON.parse(users)
            users = users.map(u => {
                if(u.email === email){
                    u.order = u.order.map((x) => {
                        if(x.id === id){
                            x.status = 'Delivered'
                            return x
                        }
                        return x
                    })
                    return u
                }
                return u
            })
            await localStorage.setItem('user', JSON.stringify(users))
            await localStorage.setItem('order', JSON.stringify(obj))
            setOrders(obj)
        }
  return (
    <div className="orders">
      {
        sortedProducts.length ? 
        <>
        <h1>View All Orders</h1>
        <div className="filter">
          <input type="search" placeholder='Search Products...' onChange={(e) => setSearch(e.target.value)} />
          <div className='sort'>
            <i className={`fa-solid fa-sort ${sort && 'active-sort'}`}></i>
            <select onChange={(e) => setSort(e.target.value)}>
              <option value="">Sort</option>
              <option value="latest">Latest</option>
              <option value="low">Price low to high</option>
              <option value="high">Price High to Low</option>
            </select>
          </div>
        </div>
        </>
         : ''
      }  
            {
            sortedProducts.filter(x => search.toLowerCase() === '' ? x : x.product.name.toLowerCase().includes(search) || x.user.name.toLowerCase().includes(search)).map((order, index) => (
                <div className='order' key={index}>
                    <div className="top">
                    <div className="left">
                        <img src={order.product.image[0]} alt="" />
                    </div>
                    <div className="right">
                        <h3>{order.product.name}</h3>
                        <h4>Price: {order.product.offer_price}</h4>
                        <h4>Quaantity: {order.quantity}</h4>
                        <h4>Total: {order.product.offer_price * order.quantity}</h4>
                        {
                            order.status === 'Delivered' ?
                            <h4 style={{color: 'green'}}>Delivered</h4>
                            :
                            <select style={{color: 'red'}} onChange={(e) => dropDownChange(e.target.value, order.id)}>
                                <option value="">Pending</option>
                                <option style={{color: 'green'}} value="Delivered">Delivered</option>
                            </select>
                        }
                        
                    </div>
                    </div>
                    <hr />
                    <div className="bottom">
                        <p>User: {order.user.email}</p>
                        <p>Address: {order.address}</p>
                        <p>{order.date}</p>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default Order