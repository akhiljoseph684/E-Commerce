import React, { useContext } from 'react';
import './ProductsDisplay.css'
import rating_star from './../../assets/rating_star.png'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';

function ProductsDisplay({item}) {

    const navigate = useNavigate()

    const {addToCart} = useContext(AuthContext)

    const {id, name, price, offer_price, rating, image} = item;
    const [imgSrc] = image;

    const handleCart = async () => {
        await addToCart(id)
    }

  return (
    <div className='product'>
        <div className="product-image" onClick={() => navigate('/product/' + id)}>
            <img src={imgSrc} alt="" />
        </div>
        <div className="product-details" onClick={() => navigate('/product/' + id)}>
            <h1>{name}</h1>
            <div className="price">
                <h3>₹{offer_price}</h3>
                <h5><s>₹{price}</s></h5>
            </div>
            <div className="rating">
                <p>{rating}</p>
                <img src={rating_star} alt="" />
            </div>
        </div>
        <button className='cart-btn' onClick={handleCart}>Add to Cart</button>
    </div>
  )
}

export default ProductsDisplay