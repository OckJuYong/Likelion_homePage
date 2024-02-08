import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../Main/header/header';
import './Task.css';
// import { useAuth } from '../Login/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from '../Main/header/MenuHeader';

import leftButton from '../Board/left.png';
import rightButton from '../Board/right.png';



const Task = () => {
  // const { loginInfo, setLoginInfo } = useAuth();

  const student_id = 20201776;
  const userCount = 2;

  const sliderRef = useRef(null);
  const [weekCount, setWeekCount] = useState();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [weekList, setWeekList] = useState([]);
  const accessAddress = "http://192.168.0.4:8080/api/";
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app";
  const navigate = useNavigate();

  const [newAssignmentData, setNewAssignmentData] = useState({
    student_id: 20201776,
    weeks: '',
    assignment_title: '',
    assignment_type: 'C',
    deadline: '', // 합쳐진 deadline 값
  });
  const [studentInfo ,setStudentInfo] = useState(null);

  
  // ----------------------------------------------------------------

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

  // ----------------------------------------------------------------


  const handleAssignmentClick = async (weeks) => {
    try {
      const response = await axios.get(`${address}/week/${weeks}/`);
      setSelectedAssignment(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
    }
  };
  
  const setEditingIdInLocalStorage = (id) => {
    localStorage.setItem('editingId', id);
  };

  const handleWeekCount = (id) => {
    console.log(id);
  }

  const TaskWriteButton = () => {
    navigate('/TaskWrite')
  }
  
  const handleDeleteAssignment = async (id) => {
    try {
      const response = await axios.delete(`${address}/week/${id}/`, { data: { student_id } });
      // 성공 응답을 처리하는 부분 (필요하면)
      console.log('과제가 성공적으로 삭제되었습니다:', response.data);
    } catch (error) {
      // 과제 ID 출력 전에 유효성 확인
      if (id) {
        console.log('과제 ID:', id);
      }
      console.error('과제 삭제 중 오류 발생:', error);
  
      // 추가: 오류 응답 내용 출력
      if (error.response) {
        console.error('오류 응답 내용:', error.response.data);
      }
    }
  };
  

  // front admin, back admin, front, back / division

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${address}/week/`, student_id);
        setWeekList(response.data);
        console.log(response.data);
        console.log(response.data[0].deadline);
        console.log(response.data.weeks);
        
        setWeekCount(Math.ceil(response.data.length / userCount)); // 올림으로 변경
  
        const loggedInUserRole = 'front admin';
        setIsAdmin(loggedInUserRole === 'front admin');
        
      } catch (error) {
        console.error('Error fetching week list:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleSliderPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleSliderNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const Task_slickSettings = {
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    slidesPerRow: 4, 
    arrows: false, 
    infinite: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <LogoHeader />
      <MenuHeader />
      <div className='tum'></div>
      <div className='task__main__container'>
        <div className='task__header__main__container'>
          <div>
            <span className='Task_Lion_title'>Lion</span>
            <span className="Task__title">{`${userName}'s 과제`}</span>
          </div>
          <div>
            {/* {userDivision == "front admin" && ( */}
                <button onClick={TaskWriteButton} className='task__create__button__y'>+</button>
            {/* )} */}
          </div>
        </div>
        <div className='task__header__line'></div>

        {/* weekCount를 이용한 반복문으로 주차게시판 생성 */}
        <div className="slider__container">
          <div className="slider_button_container">
              <button onClick={handleSliderPrev}><img className="slider__left__button" src={leftButton} alt="Left Button" /></button>
              <button onClick={handleSliderNext}><img src={rightButton} alt="Right Button" /></button>
            </div>
          <Slider {...Task_slickSettings} ref={sliderRef}>
            {[...Array(weekCount).keys()].map((weekIndex) => (
              <div className="week_slide">
                <div key={weekIndex + 1} >
                  {/* 주차게시판 제목 형식에 맞게 수정 필요 */}
                  <Link to={`/Assignment/${weekIndex}`} onClick={() => handleWeekCount(weekIndex + 1)}>
                    {`${weekIndex + 1}주차 과제 목록`}
                  </Link>
                </div>
                {weekList == '' ? '' : <span className='task__deadline__yo'>{weekList[weekIndex + 1].deadline.split('T')[0]}</span>}
                
                <div>
                  <button onClick={() => handleDeleteAssignment(weekIndex + 1)} className="task__del__button">X</button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Task;
