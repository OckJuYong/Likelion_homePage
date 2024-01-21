import React, { useState, useEffect }from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';
import likelionLogo from '../../images/LikeLion_Logo.png';
import MyInfoImg from '../../images/MyInfo.png';
import { useNavigate } from 'react-router-dom';



function Header() {
  const location = useLocation();

  const isLinkActive = (path) => {
    //현재 링크 표시
    return location.pathname === path;
  };


  return (
    <div className='header_main_container'>
      <h1 className='header_menubar'>Quick Menu</h1>
      <div className="header_header">
        <Link to="/Board" className="board" >
          게시판
        </Link>
        <Link to="/Introduction" className="introduction">
          공지사항
        </Link>
        <Link to="/Notice" className="notice">
          소개
        </Link>
        <Link to="/Task" className="task">
          과제 제출 게시판
        </Link>
      </div>
    </div>
  );
}

export default Header;