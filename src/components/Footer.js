import React from 'react'
import big_logo from '../assets/images/big_logo.png'

function Footer() {
  return (
    <div id='footer' className='d-flex flex-column align-items-center justify-content-between py-5'>
        <div className='my-4'>
            <img src={big_logo} style={{width: "350px"}} className='mb-2'/>
        </div>
        <div className='mt-4 mb-1'>
          <a href='#' id='text' className='mx-4' style={{textDecoration: 'none'}}><i className="bi bi-facebook"></i> GameVault</a>
          <a href='#' id='text' className='mx-4' style={{textDecoration: 'none'}}><i className="bi bi-instagram"></i> game_vault</a>
          <a href='#' id='text' className='mx-4' style={{textDecoration: 'none'}}><i className="bi bi-twitter-x"></i> gamevault</a>
        </div>
        <div className='mt-5'>
          <p className='text-center' id='footer-text'>© 2024 Valve Corporation. All rights reserved. All trademarks are property of their respective <br /> owners in the US and other countries. VAT included in all prices where applicable.</p>
        </div>
    </div>
  )
}

export default Footer