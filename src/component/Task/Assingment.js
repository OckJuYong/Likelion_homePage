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
  const [paarms, setParms] = useState({
    student_id: 20201776,
    weeks: 0,
     
  });
  const [assignment, setAssignments] = useState([]);
  const student_id = 20201761

  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app";

  const currentPath = window.location.pathname;
  console.log(currentPath.split('/')[2]);
  console.log(params);

  const assignmentdelte = async () => {
      try {
        // Send a DELETE request to delete the notice
        await axios.delete(`${address}/assignment/${id}/`, { data: { student_id }});
        navigate('/assignment'); // 삭제 후 다시 공지사항 페이지로 이동
      } catch (error) {
        console.error('Error deleting notice:', error);
      }
  }
  useEffect(() => {
    console.log('urlNumber changed:', urlNumber);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${address}/assignment/${id}/`, {
          params: params,
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
