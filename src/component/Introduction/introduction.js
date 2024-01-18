// Introduction.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import IntroductionEdit from './introductionEdit'; 
import cookie from 'react-cookies';
import './introduction.css';

import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper/core';

import HeaderMenu from '../Main/header/MenuHeader';
import HeaderLogo from '../Main/header/LogoHeader';



function Introduction() {
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app/";
  const accessAddress = "http://192.168.0.4:8080/api/";

  const [notices, setNotices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [studentInfo, setStudentInfo] = useState(null);
  const student_id = "20201776";

  const setEditingIdInLocalStorage = (id) => {
    localStorage.setItem('editingId', id);
  };
  
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedAccessToken = cookie.load("accessToken");
        const savedRefreshToken = cookie.load("refreshToken");

        setAccessToken(savedAccessToken);
        setRefreshToken(savedRefreshToken);

        const getAccessTokenResponse = await axios.post(
          `${accessAddress}token/verify/`,
          { token: savedAccessToken }
        );
        const studentId = getAccessTokenResponse.data.student_id;
        setStudentInfo(studentId);
        console.log('Server Response:', getAccessTokenResponse);
        console.log('Student ID:', studentId);
      } catch (error) {
        try {
          const refreshTokenResponse = await axios.post(
            `${accessAddress}token/refresh/`,
            { refresh: refreshToken }
          );

          cookie.save("accessToken", refreshTokenResponse.data.access, {
            path: "/",
          });
          setAccessToken(refreshTokenResponse.data.access);

          const refreshedStudentInfoResponse = await axios.post(
            `${accessAddress}token/verify/`,
            { token: refreshTokenResponse.data.access }
          );

          setStudentInfo(refreshedStudentInfoResponse.data.student_id);
          console.log(
            "Refreshed Student Info Response:",
            refreshedStudentInfoResponse.data
          );

          const validateRefreshToken = await axios.post(
            `${accessAddress}token/`,
            {
              refresh: refreshToken,
            }
          );
          console.log(
            "Validate Refresh Token Response:",
            validateRefreshToken.data
          );
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
    };

    fetchData();
  }, [accessAddress]);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${address}notice/`);
      setNotices(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const formatNoticeTime = (rawTime) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return new Date(rawTime).toLocaleDateString('ko-KR', options);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting ID:", id);
    try {
      await axios.delete(`${address}notice/${id}/`, { data: { student_id }});
      fetchNotices();
      navigate('/introduction');
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchNotice = async () => {
        try {
          const response = await axios.get(`${address}notice/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
          setFile(response.data.file || null);
          setEditingId(id);
        } catch (error) {
          console.error('Error fetching notice:', error);
        }
      };
      fetchNotice();
    }
  }, [id]);

  const openModal = async (data) => {
    setModalData(data);
    setIsModalOpen(true);

    if (data.file) {
      try {
        setModalData((prevData) => ({
          ...prevData,
          fileUrl: data.file,
        }));
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const swiperSettings = {
    spaceBetween: 50,
    slidesPerView: 2,
    onSlideChangeTransitionEnd: (swiper) => {
      // 모든 Swiper 인스턴스에 같은 슬라이드 인덱스를 설정하여 동기화
      topSwiper.slideTo(swiper.activeIndex);
      bottomSwiper.slideTo(swiper.activeIndex);
    },
    onSwiper: (swiper) => console.log(swiper)
  };

  // 상단 슬라이더와 하단 슬라이더에 대한 인스턴스 생성
  const [topSwiper, setTopSwiper] = useState(null);
  const [bottomSwiper, setBottomSwiper] = useState(null);

  const handleSliderPrev = () => {
    topSwiper.slidePrev();
    bottomSwiper.slidePrev();
  };

  const handleSliderNext = () => {
    topSwiper.slideNext();
    bottomSwiper.slideNext();
  };

  return (
    <div className='parent-div'>
      {/* ... (기존 코드 생략) */}
      <HeaderMenu />
      <HeaderLogo />

      <div className='introduction_main_container'>
        <div className='intro'>
          <span className='Lion'>Lion </span>
          <span>공지사항</span>
        </div>
        <hr />
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {/* 상단 슬라이더 */}
            <Swiper {...swiperSettings} onSwiper={setTopSwiper}>
              {notices.map((notice, index) => (
                index % 2 === 0 && (
                  <SwiperSlide key={notice.id} className='main_introduction' onClick={() => openModal(notice)}>
                    <div className='sub_introduction'>
                      <span>{notice.notice_title}</span>
                      <span>{formatNoticeTime(notice.notice_time)}</span>
                    </div>
                    <Link
                      to={`/edit-notice/${notice.id}`}
                      onClick={() => setEditingIdInLocalStorage(notice.id)}
                    >
                      수정하기
                    </Link>
                    <button onClick={() => handleDelete(notice.id)}>삭제하기</button>
                  </SwiperSlide>
                )
              ))}
            </Swiper>
          </div>
        </div>
        
        <div className="swiper-container">
          <div className="swiper-wrapper">
            {/* 하단 슬라이더 */}
            <Swiper {...swiperSettings} onSwiper={setBottomSwiper}>
              {notices.map((notice, index) => (
                index % 2 === 1 && (
                  <SwiperSlide key={notice.id} className='main_introduction' onClick={() => openModal(notice)}>
                    <div className='sub_introduction'>
                      <span>{notice.notice_title}</span>
                      <span>{formatNoticeTime(notice.notice_time)}</span>
                    </div>
                    <Link
                      to={`/edit-notice/${notice.id}`}
                      onClick={() => setEditingIdInLocalStorage(notice.id)}
                    >
                      수정하기
                    </Link>
                    <button onClick={() => handleDelete(notice.id)}>삭제하기</button>
                  </SwiperSlide>
                )
              ))}
            </Swiper>
          </div>
        </div>

        <div className="button-container">
          <Link to="/IntroductionWrite">새로운 공지 작성</Link>
        </div>
        <div className="slider_button_container">
          <button onClick={handleSliderPrev}>이전</button>
          <button onClick={handleSliderNext}>다음</button>
        </div>


        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{modalData.notice_title}</h3>
              <p>{modalData.notice_comment}</p>
              {modalData.fileUrl && (
                <div>
                  {modalData.fileUrl.endsWith('.pdf') ? (
                    <embed src={modalData.fileUrl} type="application/pdf" width="600" height="400" />
                  ) : (
                    <img src={modalData.fileUrl} alt="File" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                  )}
                </div>
              )}
              <button onClick={closeModal}>닫기</button>
            </div>
          </div>
        )}
        {editingId && <IntroductionEdit />}
      </div>
    </div>
  );
}

export default Introduction;