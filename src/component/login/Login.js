import React, { useState, useEffect } from "react";
import cookie from "react-cookies";
import axios from "axios";
import Header from "../Main/header/header";
import { useAuth } from "./AuthContext";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const address = "http://192.168.0.4:8080/api/";
  const LoginAddress =
    // "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";
    "http://15.164.190.171/login/";
  const { setLoginInfo } = useAuth();
  const expires = new Date();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [isRequesting, setIsRequesting] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

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


      // setAccessToken(getAccessTokenResponse.data.access);

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

  const FormEvent = async (event) => {
    event.preventDefault();

    if (isRequesting) {
      console.log("Login request is already in progress. Ignoring.");
      return;
    }

    setIsRequesting(true);

    try {
      const loginResponse = await axios.post(
        `${LoginAddress}`,
        {
          username: userData.username,
          password: userData.password,
        }
      );

      setAccessToken(loginResponse.data.access);
      setRefreshToken(loginResponse.data.refresh);

      cookie.save("accessToken", loginResponse.data.access, {
        path: "/",
        expires: new Date(loginResponse.data.access),
      });

      cookie.save("refreshToken", loginResponse.data.refresh, {
        path: "/",
        expires: new Date(loginResponse.data.refresh),
      });

      navigate('/');

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const changeId = (value) => {
    setUserData({ ...userData, username: value });
  };

  const changePw = (value) => {
    setUserData({ ...userData, password: value });
  };

  return (
    <>
  
      
      <div className="login_Border">
     <div className="login_title">
      <h2>LIKE LION</h2>
      <h3>12TH</h3>
      <h4> <span>with</span> Hanbat Univ</h4>
     </div>
        <div className="login_state">
          {/* 폼 제출 시 FormEvent 함수 호출 */}
          <h2 className="title">LOGIN</h2>
          <form onSubmit={FormEvent}>
            <label htmlFor="id">ID</label>
            {/* 사용자 ID 입력 필드 */}
            <input
              type="text"
              id="id"
              name="id"
              value={userData.student_id}
              onChange={(e) => changeId(e.target.value)}
              placeholder="Student number"
            />

            <label htmlFor="pw">Password</label>
            {/* 사용자 비밀번호 입력 필드 */}
            <input
              type="password"
              id="pw"
              name="pw"
              value={userData.password}
              onChange={(e) => changePw(e.target.value)}
              placeholder="Password"
            />
            <hr className="line"/>  
          
            {/* 로그인 버튼 */}
            <div className="login_Button">
              <button type="submit">LOGIN</button>
            </div>
          </form>
        </div>
        
      </div>
      <div className="bottom">This page copyrighted to <span>Hanbat University Lion</span> management</div>
    </>
  );
}

export default Login;