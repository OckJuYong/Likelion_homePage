import React from 'react';
import{Link} from 'react-router-dom';
import './LikeLion.css';
import Headers from'./headers/headers'
import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from '../Main/header/MenuHeader';



function LinkLion() {
  return (
    <>
    <LogoHeader/>
    <MenuHeader/>

     
      <Headers state='LinkLion' />
      <hr className='line'></hr>
      <div className='container'>
      <div className='image_group'>
      <div className='group1'></div>
          <div className='group2'></div>
          <div className='group6'></div>
          <div className='group3'></div>
          <div className='group4'></div>
          <div className='group5'></div>
          <div className='group7'></div>
          <div className='group8'></div>
          <div className='group9'></div>

 </div>
     <div className='Introduce'><h2>Introduce</h2></div> 
      <div className='Introduce_box'></div>
      </div>



    

    </>
  );
}

export default  LinkLion;