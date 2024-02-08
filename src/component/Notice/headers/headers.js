import React,{useState} from 'react';
import{Link} from 'react-router-dom';
import './headers.css'



function Headers({state}) {
 /* const [event,setevent]=useState(null);

  const handleClick=(index)=>{
    setevent(index)
  }
*/

  return (
    <>
    <div className='notice-title'>
  <Link to='/Notice' className={`notice-link ${state === 'Curriculum' ? 'active' : ''}`} style={{ marginRight: '280px', marginTop: '-26px', marginLeft: '-20pxx' }}>
    <h3>Curriculum</h3>
  </Link>
  <Link to='/LikeLion' className={`notice-link ${state === 'LinkLion' ? 'active' : ''}`} style={{ marginRight: '10px', marginTop: '-26px', marginLeft: '24px' }}>
    <h3>LikeLion</h3>
  </Link> 
  <Link to='/Manager' className={`notice-link ${state === 'Manager' ? 'active' : ''}`} style={{ marginRight: '30px', marginTop: '-26px', marginLeft: '309px' }}>
    <h3>Manager</h3>
  </Link>
</div>
    </>
  );
}

export default  Headers;