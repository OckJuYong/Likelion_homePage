import React, { useState, useEffect } from 'react';
import Sidebar from 'react-sidebar';
import { Link } from 'react-router-dom';
import './MenuHeader.css';
import cookie from 'react-cookies';
import axios from 'axios';
import dj from './image 2.png';
import react from './image 1.png';
import menubar from './menubar.png';

import { useNavigate } from 'react-router-dom';


const MenuHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();


  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  const accessAddress = 'http://192.168.0.4:8080/api/';
  const LoginAddress = 
  // "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";
  "http://15.164.190.171/login/";

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);

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
        setUserName(getAccessTokenResponse.data.name);
        setUserDivision(getAccessTokenResponse.data.division);
        setStudent_Id(getAccessTokenResponse.data.username)
        console.log(getAccessTokenResponse.data.name);
        console.log(getAccessTokenResponse.data.username);
        console.log(getAccessTokenResponse.data.division);


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


      // Assuming fetchData is a function that you've defined elsewhere
      // await fetchData(accessAddress, savedAccessToken, savedRefreshToken, setAccessToken, setRefreshToken);
    };

    fetchDataWrapper();
  }, []);
  const Logout__button = () => {


    navigate('/login');
  } 

  return (
    <Sidebar
      sidebar={
        <div className='header_main_container'>
          <span className='close' onClick={() => onSetSidebarOpen(false)}>X</span>
          <div className='notice_container'>
            <div className='djImg'>
              {userDivision == "front" || userDivision == "fromt admin" ?<img className="front_react_img"src={react} alt = 'React Image'/> : <img src={dj} alt='DJ Image' />}
              
              
            </div>
            <div className='userInfo'>
              <span>{userName}'s </span>
              <span className='yellow'>Lion</span> 
              <span>님 반갑습니다</span>
            </div>
            <div className='ButtonContainer'>
              <button className='LogoutButton' onClick={Logout__button}>LOGOUT</button>
            </div>
          </div>
          <div className="link_header">
            <Link to="/Board" className="sidebar-link">
              게시판
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
        <img className="bugger_menu_bar" src={menubar}/>
      </button>
    </Sidebar>
  );
};

export default MenuHeader;