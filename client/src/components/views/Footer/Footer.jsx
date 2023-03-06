import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div style={{ height: '100%', fontSize: '0.8rem ', textAlign: 'center' }}>
      <div>Copyright (c) A'LT.com All rights reserved.</div>
      <div>Contact us, alt_admin at gmail dot com</div>
      <div className='policy+privacy'>
        <Link to={'/policy'} style={{ color: 'blue' }} className='link'>
          이용약관
        </Link>
        <span style={{ width: '15px', margin: '5px' }}>|</span>
        <Link to={'/privacy'} style={{ color: 'blue' }} className='link'>
          개인정보취급방침
        </Link>
      </div>
      <h4> A'LT.com</h4>
    </div>
  );
}

export default Footer;
