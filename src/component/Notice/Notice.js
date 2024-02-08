import React from 'react';
import Header from '../Main/header/header';
import './Notice.css';
import Django from './Django.png';
import DRF from './DRF.png';
import python from './pyton.png';
import { Link } from 'react-router-dom';
import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from '../Main/header/MenuHeader';


function Notice() {
  const headers = new Headers();
  return (
    <>
      <LogoHeader />
      <MenuHeader />
     <Headers state='Curriculum'/>
      <hr className='line'></hr>

      <div className='main_container'>
        <div className='Common_main_container'>
          <h2 className='common'>Common</h2>
          <div className='common-box'>
            <h4 className='CSS'>CSS</h4>
            <h4 className='HTML'>HTML</h4>
            <h4 className='JS'>JS(기초)</h4>
          </div>
        </div>
        <div className='notice__line__contaner'>
          
          <div>
            <div className='line__2'> </div>
            <div className='line__2_1'>   </div>
            <div className='line__2_2'>   </div>
            <div className='v'></div>

            <div className='line__3'>   </div>
            <div className='line__3_1'>   </div>
            <div className='line__3_2'>   </div>
            <div className='v1'></div>
          </div>
        </div>

        <div className='right'>
          
          <h2 className='Back-End'>Back End</h2>
          <div className='Back-End-box'>
          <div className="Back-End-image1"></div>
          <div className="Back-End-image2"></div>
         <div className="Back-End-image3"></div>
              <h4 className='Python'>Python</h4>
              <h4 className='Django'>Django</h4>
              <h4 className='DRF'>DRF</h4>
            
          </div>
          <h2 className='Front-End'>Front End</h2>
          <div className='Front-End-box'>
            <h4 className='js심화'>JS(심화)</h4>
            <h4 className='react'>React</h4>
            <h4 className='type'>TypeScript</h4>
          </div>
        </div>
      </div> 
    </>
  );
}

export default Notice;