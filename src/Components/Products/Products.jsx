import React, { useContext, useEffect, useState } from 'react';
import './Products.css';
import ProductsDisplay from '../ProductsDisplay/ProductsDisplay';
import { AuthContext } from '../../AuthContext';


function Products() {

  const [products, setProducts] = useState([])

  const { search, setSearch, getAllProducts } = useContext(AuthContext);

useEffect(() => {

  async function check() {

    const product = await getAllProducts();

    setProducts(product);

  }

  check();

}, []);
  const [sort, setSort] = useState('')

  const sortedProducts = [...products].sort((a, b) => {
    switch (sort) {
      case "low":
        return a.offer_price - b.offer_price;
      case "high":
        return b.offer_price - a.offer_price;
      case "rating":
        return b.rating - a.rating;
      default:
        return a._id - b._id;
    }
  });


  return (
    <div className='products-display'>
      <div className="nav" id='products'></div>
       <div className="products-headline">
        <h1>Popular Products</h1>
       </div>
       <div className="filter">
          <input type="search" placeholder='Search Products...' onChange={(e) => setSearch(e.target.value)} />
          <div className='sort'>
            <i className={`fa-solid fa-sort ${sort && 'active-sort'}`}></i>
            <select onChange={(e) => setSort(e.target.value)}>
              <option value="">Sort</option>
              <option value="rating">Rating</option>
              <option value="low">Price low to high</option>
              <option value="high">Price High to Low</option>
            </select>
          </div>
        </div>
       <div className='products'>
        
        {
          sortedProducts.filter(item => search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search)).map((item, index) => {
            return(
              <ProductsDisplay key={index} item={item} /> 
            )
          })
        }
       </div>
    </div>
  )
}

export default Products