import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Main/header/header';
import './Task.css';
// import { useAuth } from '../Login/AuthContext';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';

import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from '../Main/header/MenuHeader';



const Task = () => {
  // const { loginInfo, setLoginInfo } = useAuth();

  const student_id = 20201776;
  const userCount = 2;

  const [weekCount, setWeekCount] = useState();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [weekList, setWeekList] = useState([]);
  const accessAddress = "http://192.168.0.4:8080/api/";
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app";

  const [newAssignmentData, setNewAssignmentData] = useState({
    student_id: 20201776,
    weeks: '',
    assignment_title: '',
    assignment_type: 'C',
    deadline: '', // 합쳐진 deadline 값
  });
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [studentInfo ,setStudentInfo] = useState(null);


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
        
        setWeekCount(Math.ceil(response.data.length / userCount)); // 올림으로 변경
  
        const loggedInUserRole = 'admin';
        setIsAdmin(loggedInUserRole === 'admin');
        
      } catch (error) {
        console.error('Error fetching week list:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <>
      <LogoHeader />
      <MenuHeader />
      <div className='task_main_container'>
        <h1>과제 목록</h1>

        {/* weekCount를 이용한 반복문으로 주차게시판 생성 */}
        <ul>
          {[...Array(weekCount).keys()].map((weekIndex) => (
            <li key={weekIndex + 1}>
              {/* 주차게시판 제목 형식에 맞게 수정 필요 */}
              <Link to={`/Assignment/${weekIndex + 1}`} onClick={() => handleWeekCount(weekIndex + 1)}>{`${weekIndex + 1}주차 과제 목록`}</Link>
              <button onClick={() => handleDeleteAssignment(weekIndex+1)}>과제 삭제</button>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <Link to="/TaskWrite">
            과제 생성 버튼
          </Link>
        )}
      </div>
    </>
  );
};

export default Task;
