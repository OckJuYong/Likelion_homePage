import "./main.css"
import Header from '../header/header';
import React, { useState, useEffect } from "react";
import cookie from "react-cookies";
import axios from "axios";
import likelionLogo from '../../images/LikeLion_Logo.png';
import MyInfoImg from '../../images/MyInfo.png';
import { useNavigate } from 'react-router-dom';
import LogoHeader from '../header/LogoHeader';

import MenuHeader from "../header/MenuHeader";

function Main() {
  const navigate = useNavigate();
  const LoginAddress =
  // "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";
  "http://15.164.190.171/login/";
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [userDivision, serUserDivision] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [userName, setUserName] = useState(null);

  const getAccessToken = async () => {
    try {
      const savedAccessToken = cookie.load("accessToken");
      const savedRefreshToken = cookie.load("refreshToken");
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);

      console.log("Trying to get access token...");

      const getAccessTokenResponse = await axios.post(
        `${LoginAddress}`,
        {
          access: savedAccessToken,
          refresh: savedRefreshToken,
        }
      );

      console.log("Get Access Token Response:", getAccessTokenResponse.data);
      
      // 상태를 업데이트하고 나서 값 확인
      setUserInfo(getAccessTokenResponse.data)
      serUserDivision(getAccessTokenResponse.data.division)
      setStudentId(getAccessTokenResponse.data.username)
      setUserName(getAccessTokenResponse.data.name)

      console.log("userInfo: ", userInfo);
      console.log(userDivision, studentId, userName);

      console.log("Access Token:", getAccessTokenResponse.data.access);

      cookie.save("accessToken", getAccessTokenResponse.data.access, {
        path: "/",
        expires: new Date(getAccessTokenResponse.data.access),
      });
    } catch (error) {
      console.error("Error checking access token:", error);
    }
  };

  // 최초 렌더링 시 또는 토큰이 있을 경우 한 번 호출
  useEffect(() => {
    getAccessToken();
  }, []);
  useEffect(() => {
    console.log("userInfo: ", userInfo);
    console.log("userDivision, studentId, userName: ", userDivision, studentId, userName);
    serUserDivision(userDivision)
    setStudentId(studentId)
    setUserName(userName)
  }, [userInfo, userDivision, studentId, userName]);

  const LogoutHeandler = () => {
    cookie.remove("accessToken", { path: "/" });
    cookie.remove("refreshToken", { path: "/" });

    // Clear state values
    setAccessToken(null);
    setRefreshToken(null);
    setUserInfo([]);
    serUserDivision(null);
    setStudentId(null);
    setUserName(null);

    navigate('/login');
  } 
    


//LikeLion 연한노란색   H 빨간색, B 남색, N 매우연한노란색, U 하늘색

  return (
    <div className="main_container">
      {/* <MenuHeader /> */}
      <LogoHeader />
      <div className="User__main__container">
        <div className="Lion__info__container">
          <span className="user__yellow">Lion </span>
          <span className="user__Info"> Info</span>
        </div>
        <div className="UserMainInfo">
          <span>School : HBNU</span>
          <span>Student_Number : {studentId}</span>
          <span>Name : {userName}</span>
          <span> Division : {userDivision}</span>
          <a href="http://localhost:3000/notice">
            <img src={MyInfoImg} alt="ImfoLofo" className="MyInfoImg" />
          </a>
        </div>
        <button className="Logout_button" onClick={LogoutHeandler}>
          {accessToken ? 'LOGOUT' : 'LOGIN'}
        </button>


        
      </div>
      <div className="main_header_container">
        <Header className="Header"/>
      </div>
    </div>
  );
}

export default Main;
