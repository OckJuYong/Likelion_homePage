import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';



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
    for (let i = 1; i < weekCount + 1; i++) {
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

  

  console.log(assignment);
  return (
    <>
      <div>과제 제출페이지</div>
      <Link to={`/TaskEdit/${urlNumber}`}>과제 제출하기</Link>
      <div>
        <h2>Assignment Information</h2>
        <ol>
          {assignment.map((outerItem, outerIndex) => (
            <li key={outerIndex}>
              <h3>{outerItem.assignment_title}</h3>
              <p>file: {outerItem.file}</p>
              <p>Submission Status: {outerItem.submission_time}</p>
            </li>
          ))}
        </ol>
        <button onClick={() => assignmentdelte()}>과제 삭제하기</button>
      </div>
    </>
  );
};

export default Assignment;
