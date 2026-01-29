import React from 'react';
import './Banner.css';
import bannerLarge from './../../assets/banner-large.png'
import bannerSmall from './../../assets/banner-small.png'

function Banner() {
  return (
    <div className='banner'>
      <a href="#products" className='banner-large'>
        <img src={bannerLarge} alt="" />
      </a>
      <a href="#products" className='banner-small'>
        <img src={bannerSmall} alt="" />
      </a>
    </div>
  )
}

export default Banner