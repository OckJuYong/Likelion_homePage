import React, { useState, useEffect } from 'react';
import Sidebar from 'react-sidebar';
import { Link } from 'react-router-dom';
import './MenuHeader.css';
import cookie from 'react-cookies';
import axios from 'axios';
import dj from './image 2.png';
import menubar from './menubar.png';

const MenuHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  const accessAddress = 'http://192.168.0.4:8080/api/';
  const LoginAddress = "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedAccessToken = cookie.load("accessToken");
        const savedRefreshToken = cookie.load("refreshToken");
        setRefreshToken(savedRefreshToken);
        setAccessToken(savedAccessToken);

        console.log("Trying to get access token...");

        const getAccessTokenResponse = await axios.post(
          `${LoginAddress}`,
          {
            access: savedAccessToken,
            refresh: savedRefreshToken,
          }
        );

        console.log("Get Access Token Response:", getAccessTokenResponse.data);

        console.log("Access Token:", getAccessTokenResponse.data.access);
        cookie.save("accessToken", getAccessTokenResponse.data.access, {
          path: "/",
          expires: new Date(getAccessTokenResponse.data.expires),
        });
      } catch (error) {
        console.error("Error checking access token:", error);
      }
    };

    // Call fetchData function
    fetchData();
  }, []); // Empty dependency array for the initial render only

  useEffect(() => {
    const fetchDataWrapper = async () => {
      const savedAccessToken = await cookie.load('accessToken');
      const savedRefreshToken = await cookie.load('refreshToken');

      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);

      console.log('Access Token from Cookie:', savedAccessToken);
      console.log('Refresh Token from Cookie:', savedRefreshToken);

      // Assuming fetchData is a function that you've defined elsewhere
      // await fetchData(accessAddress, savedAccessToken, savedRefreshToken, setAccessToken, setRefreshToken);
    };

    fetchDataWrapper();
  }, []);

  return (
    <Sidebar
      sidebar={
        <div className='header_main_container'>
          <span className='close' onClick={() => onSetSidebarOpen(false)}>X</span>
          <div className='notice_container'>
            <div className='djImg'>
              <img src={dj} alt='DJ Image' />
            </div>
            <div className='userInfo'>
              <span>주용's </span>
              <span className='yellow'>Lion</span> 
              <span>님 반갑습니다</span>
            </div>
            <div className='ButtonContainer'>
              <button className='LogoutButton'>LOGOUT</button>
            </div>
          </div>
          <div className="link_header">
            <Link to="/Board" className="sidebar-link">
              게시판
            </Link>
            <Link to="/info" className="sidebar-link">
              내정보
            </Link>
            <Link to="/Introduction" className="sidebar-link">
              공지사항
            </Link>
            <Link to="/Notice" className="sidebar-link">
              소개
            </Link>
            <Link to="/Task" className="sidebar-link">
              과제 제출 게시판
            </Link>
          </div>
        </div>
      }
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      pullRight={true}  // 우측으로 이동
      styles={{ sidebar: { background: 'white' } }}
    >
      <button
        className="sidebar-toggle-button"
        onClick={() => onSetSidebarOpen(true)}
      >
        <img src={menubar}/>
      </button>
    </Sidebar>
  );
};

export default MenuHeader;