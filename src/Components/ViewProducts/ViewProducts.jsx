import React, { useContext, useEffect, useState } from 'react';
import './ViewProducts.css'
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

function ViewProducts() {

    const {getAllProducts, deleteProductById} = useContext(AuthContext);
    const [products, setProducts] = useState([])
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        async function check() {
            let res = await getAllProducts()
            setProducts(res)
        }
        check()
    }, [])
    const sortedProducts = products ? [...products].sort((a, b) => {
        switch (sort) {
          case "low":
            return a.offer_price - b.offer_price;
          case "high":
            return b.offer_price - a.offer_price;
          default:
            return a.id - b.id;
        }
      }) : []

      const handleDelete = async (id) => {
        let res = await deleteProductById(id)
        setProducts(res)
      }
  return (
    <div className="view-products">
           {
            !sortedProducts.length ?
            <div className="product-empty">
                <p>Product is Empty</p>
            </div> :
            <>
            
            <h1>View All Products</h1>
            <div className="filter">
          <input type="search" placeholder='Search Products...' onChange={(e) => setSearch(e.target.value)} />
          <div className='sort'>
            <i className={`fa-solid fa-sort ${sort && 'active-sort'}`}></i>
            <select onChange={(e) => setSort(e.target.value)}>
              <option value="">Sort</option>
              <option value="low">Price low to high</option>
              <option value="high">Price High to Low</option>
            </select>
          </div>
        </div>
        <table>
        {
            sortedProducts.filter(product => product.name.includes(search)).map((product) => (
                <tr key={product.id}>
                    <td><img src={product.image[0]} alt="" /></td>
                    <td>{product.name}</td>
                    <td className='mobile-hide'>{product.brand}</td>
                    <td>{product.offer_price}</td>
                    <td><button className='edit-btn' onClick={() => navigate(`/admin/add-products/${product.id}`)}>Edit</button></td>
                    <td><button className='delete-btn' onClick={() => handleDelete(product.id)}>Delete</button></td>
                </tr>
            ))
        }
        </table>
            </>
        }
        
    </div>
  )
}

export default ViewProducts