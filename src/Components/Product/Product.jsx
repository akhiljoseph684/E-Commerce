import React, { useContext, useEffect, useState } from 'react';
import './Product.css'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import rating_star from './../../assets/rating_star.png'

function Product() {

  const {getProductById, addToCart, setPayment, setBuyNow, username, setBuyNowProId, user} = useContext(AuthContext);
  const [product, setProduct] = useState({})
  const navigate = useNavigate()

  const {id} = useParams()
  useEffect(() => {
    async function check(){
      let pro = await getProductById(id)
      setProduct(pro)
    }
    check()
  }, [])
  const [imgSrcIndex, setImgSrcIndex] = useState(0)

  const imageIndex = (index) => {
    setImgSrcIndex(index)
  }

  const handleBuynow = (id) => {
    if(!user){
      navigate('/login')
      return;
    }
    setPayment(true)
    setBuyNow(true)
    setBuyNowProId(id)
    navigate('/payment');
    return;
  }
  return (
    !product ? <div className='no-data'>no data found</div> :  <div className='pro'>
      <div className="product-left">
          {
            product.image &&
            <>
            <div className="pro-image-small">
              <img src={`http://localhost:4000/uploads/${product.image[0]}`} className={imgSrcIndex === 0 ? "active-image" : ""} onMouseOver={() => imageIndex(0)} alt="" />
              <img src={`http://localhost:4000/uploads/${product.image[1]}`} className={imgSrcIndex === 1 ? "active-image" : ""} onMouseOver={() => imageIndex(1)} alt="" />
              <img src={`http://localhost:4000/uploads/${product.image[2]}`} className={imgSrcIndex === 2 ? "active-image" : ""} onMouseOver={() => imageIndex(2)} alt="" />
              <img src={`http://localhost:4000/uploads/${product.image[3]}`} className={imgSrcIndex === 3 ? "active-image" : ""} onMouseOver={() => imageIndex(3)} alt="" />
            </div>
            <img src={`http://localhost:4000/uploads/${product.image[imgSrcIndex]}`} alt="" />
            </>
          }
      </div>
      <div className="product-right">
        <h1>{product.name}</h1>
        <div className='pro-rating'>
          <img src={rating_star} alt="" />
          <p>({product.rating})</p>
        </div>
        <p>{product.description}</p>
        <div className="pro-price">
          <h3>₹{product.offer_price}</h3>
          <h5><s>₹{product.price}</s></h5>
        </div>
        <hr />
        <p style={{color: 'rgb(66, 65, 65)'}}>Color : {product.color}</p>
        <p style={{color: 'rgb(66, 65, 65)'}}>Brand : {product.brand}</p>
        <p style={{color: 'rgb(66, 65, 65)'}}>Category : {product.category}</p>
        <div className='btns'>
          <button onClick={() => addToCart(product._id)}>Add to Cart</button>
          <button className='buynow-btn' onClick={() => handleBuynow(product._id)}>Buy Now</button>
        </div>
      </div>
    </div>
  )
}

export default Product