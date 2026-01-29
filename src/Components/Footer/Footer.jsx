import React, { useContext } from 'react';
import './Footer.css'
import { AuthContext } from '../../AuthContext';

function Footer() {

    const {isLoginPage, admin} = useContext(AuthContext)

  return (
    !isLoginPage && !admin && 
    <div className="footer">
        <div className='footer-contents'>
            <div className="left">
                <h1><i>Smart Buy</i></h1>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            <hr className='medium'/>
            <div className="middle">
                <h1>Company</h1>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <hr className='medium'/>
            <div className="right">
                <h1>Get in Touch</h1>
                <ul>
                    <li>91+ 9544810427</li>
                    <li>akhiljozeph10@gamil.com</li>
                </ul>
            </div>
        </div>
        <div className='copyright'>
            <hr />
            <p>Copyright 2025 © Smart Buy All Right Reserved.</p>
        </div>
        
        
    </div>
  )
}

export default Footer