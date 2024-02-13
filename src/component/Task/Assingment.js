import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';

import taskImg from './image 8.png';

import MenuHeader from '../Main/header/MenuHeader';
import LogoHeader from '../Main/header/LogoHeader';

import './Assingment.css';


// 파일(file), 제출시간(submission_time), 
const Assignment = () => {
  const [urlNumber, setUrlNumber] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const params = new URLSearchParams();
  const [userTaskData, setUserTaskData] = useState([]);
  const [paarms, setParms] = useState({
    student_id: 20201816,
    weeks: 0,
  });
  const [assignment, setAssignments] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [weekCount, setWeekCount] = useState([]);
  const [myWeekList, setMyWeekList] = useState([]);
  const userCount = 2;
  const student_id = 20201816

  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app";

  const currentPath = window.location.pathname;

//전체과제 가져오는부분
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${address}/week/`, student_id);
      setWeekList(response.data);
      setWeekCount(Math.ceil(response.data.length / userCount)); // 올림으로 변경
    } catch (error) {
      console.error('Error fetching week list:', error);
    }
  };

  fetchData();
}, []);

useEffect(() => {
  console.log("weekList:", weekList); // weekList 출력
  if (weekList.length > 0) {
    console.log("weekList[0].assignment:", weekList[0].assignment); // weekList의 첫 번째 요소의 assignment 출력
  }
  for (let j = 0; j < weekList.length; j++) {
    for (let k = 0; k < weekList[j].assignment.length; k++) {
      console.log(j, k, weekList[j].assignment[k]);
      if (weekList[j].assignment[k].student_id == student_id) {
        setMyWeekList(prevList => [...prevList, weekList[j].assignment[k]]);
      }
    }
  }
}, [weekList]);


console.log(myWeekList);

useEffect(() => {
  const fetchData = async () => {
    for (let i = 1; i < (weekCount + 1)/2; i++) {
      try {
        const response = await axios.get(`${address}/users/${i}/`);
        console.log(`${address}/users/${i}/`);
        console.log(response.data);

        const { week } = response.data;
        setUserTaskData(week)
        console.log(response.data);
        console.log(i);
      } catch (error) {
        console.error(error);
        console.log(i);
      }
    }
  };
  fetchData();
}, [weekCount]);
console.log("유저정보",userTaskData);

  const assignmentdelte = async () => {
      try {
        // Send a DELETE request to delete the notice
        await axios.delete(`${address}/assignment/${id+1}/`, { data: { student_id }});
        navigate('/assignment'); // 삭제 후 다시 공지사항 페이지로 이동
      } catch (error) {
        console.error('Error deleting notice:', error);
      }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${address}/assignment/${id+1}/`, {
          params: params+1,
        });
        setAssignments(response.data);
        // 이하 코드 생략
      } catch (error) {
        console.error('Error fetching week list:', error);
      }
    };
    if (urlNumber !== undefined) {
      fetchData();
    }
  }, [urlNumber, id]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/(\d+)\/?$/);

    if (match) {
      const number = parseInt(match[1], 10);
      setUrlNumber(number);
    }
  }, []);


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

  

  console.log(assignment);
  const uniqueItems = myWeekList.filter((item, index, self) =>
  index === self.findIndex(t => (
    t.assignment_title === item.assignment_title && t.file === item.file
  ))
);

const weekNumber = urlNumber + 1; // 가져오고자 하는 week의 번호
console.log(weekNumber);



return (
  <>
    <MenuHeader />
    <LogoHeader/>
    <div className='assingment__title'></div>
    <div>
      <h1 className='assingment__title__week__header'>{urlNumber + 1} 주차</h1>
      <Link className="assingment__plus__button" to={`/TaskEdit/${urlNumber}`}>과제 제출하기</Link>
      <div className='task__header__line'></div>
      <ul>
        {uniqueItems.map((item, index) => (
          <li key={index} className='Assingment__weeks__main__container'>
            <img className="Assingment__img__yo" src={taskImg}></img>
            <div className='Assingment__li__main__container'>
              <p>File: {student_Id}.{item.file.split('/').pop().split('.').pop()}</p>
              <p>{item.submission_time.split("T")[0].replace(/-/g, ".")}</p>
            </div>
            <button className="assingment__del__button" onClick={() => assignmentdelte(item.assignment_id)}>과제 삭제하기</button>
          </li>
        ))}
      </ul>
    </div>
  </>
);


  
  
    
};

export default Assignment;
