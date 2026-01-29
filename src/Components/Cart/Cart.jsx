import React, { useContext, useEffect, useState } from 'react';
import './Cart.css'
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const {getCartData, addToCart, removeFromCart, cartTotal, setIsCartPage, cartChange, setPayment, currentUser, blockPage, setBlockPage} = useContext(AuthContext)
  const [cartData, setcartData] = useState([])
  const [error, seterror] = useState('')
  const [total, setTotal] = useState(0)

  const navigate = useNavigate()
  const [user, setUser] = useState({})
  
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

  useEffect(() => {
    setIsCartPage(false)
    return () => {
      setIsCartPage(true)
    }
  }, [])

  useEffect(() => {
    seterror('')
    async function load(){
    let res = await getCartData()
    if(!res.success){
      seterror(res.message)
      return;
    }
    setcartData(res.data)
    let t = cartTotal(res.data)
    setTotal(t)
    return;
  }
  load()
  }, [cartChange])
  const handleCheckout = () => {
    setPayment(true)
    navigate('/payment');
  }
  let cartDot = document.getElementById('cart-dot')
  if(cartDot)cartDot.classList.remove('dot')
  return (
    <div className='cart'>
      {
        error ? <p className='cart-error'>{error}</p> :
        <>
          <h1>Cart items</h1>
        <table>
         <thead>
          <tr>
        <th>Image</th>
        <th>name</th>
        <th>price</th>
        <th>Action</th>
        </tr>
        </thead>
         <tbody>
    {
      cartData.map(({product, quantity}, index) => (
        <tr key={index}>
          <td className='table-img'>
            <img src={product.image[0]} alt="" />
          </td>
          <td>{product.name}</td>
          <td>₹{product.offer_price}</td>
          <td className='action'>
            <button onClick={() => removeFromCart(product.id)}>-</button>
            <p>{quantity}</p>
            <button onClick={() => addToCart(product.id)}>+</button>
          </td>
        </tr>
      ))
    }
    <tr>
      <td></td>
      <td className='total'><p>Total</p></td>
      <td className='total'><p>₹{total}</p></td>
      <td className='total'><button onClick={handleCheckout}>Please Checkout</button></td>
    </tr>
  </tbody>
  </table>
  </>   
      }
    </div>
  )
}

export default Cart