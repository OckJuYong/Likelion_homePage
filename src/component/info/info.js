import React, { useState, useEffect } from 'react';
import Header from '../Main/header/header';
import cookie from 'react-cookies';
import axios from 'axios';

function MyInfo() {
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
    <>
      <Header />
      <h1>여긴 내정보 페이지</h1>
    </>
  );
}

export default MyInfo;
