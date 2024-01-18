import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

import './TaskWrite.css';

import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from '../Main/header/MenuHeader';


const TaskWrite = () => {
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app";
  const navigate = useNavigate();
  const [newAssignmentData, setNewAssignmentData] = useState({
    student_id: 20201776,
    weeks: '',
    assignment_title: '',
    assignment_type: 'C',
    deadline: '', // 합쳐진 deadline 값
  });

  const handleCreateAssignment = () => {
    // deadlineDate와 deadlineTime을 합쳐서 deadline으로 설정
    const combinedDeadline = `${newAssignmentData.deadlineDate} ${newAssignmentData.deadlineTime}`;

    
    // 서버에 과제 생성 요청 보내기
    axios.post(`${address}/week/`, { ...newAssignmentData, deadline: combinedDeadline })
      .then(response => {
        console.log('Assignment created successfully:', response.data);
        navigate('/Task');
        // 생성 후 필요한 작업 수행
      })
      .catch(error => {
        console.error('Error creating assignment:', error);
        // 에러 처리
      });
  };

  return (
    <div>
      <LogoHeader />
      <MenuHeader />
      <div className='task__write__main__container'>
        <form>
          <label>주차</label>
            <input
              className='task__write__weeks'
              type="text"
              value={newAssignmentData.weeks || ''}
              onChange={(e) => setNewAssignmentData({ ...newAssignmentData, weeks: e.target.value })}
            />
          <label>과제 제목</label>
            <input
              className='task__write__title'
              type="text"
              value={newAssignmentData.assignment_title || ''}
              onChange={(e) => setNewAssignmentData({ ...newAssignmentData, assignment_title: e.target.value })}
            />
            <label>분반</label>
            <select
              className='task__write__taskType'
              value={newAssignmentData.assignment_type || 'C'}
              onChange={(e) => setNewAssignmentData({ ...newAssignmentData, assignment_type: e.target.value })}
            >
              <option className="option_C" value="C">공통</option>
              <option value="F">프론트엔드</option>
              <option value="B">백엔드</option>
            </select>
            <div className='task__write__deadline'>
              <label>마감 날짜:</label>
                <input
                  type="date"
                  value={newAssignmentData.deadlineDate || ''}
                  onChange={(e) => setNewAssignmentData({ ...newAssignmentData, deadlineDate: e.target.value })}
                />
              <label>마감 시간:</label>
                <input
                  type="time"
                  value={newAssignmentData.deadlineTime || ''}
                  onChange={(e) => setNewAssignmentData({ ...newAssignmentData, deadlineTime: e.target.value })}
                />
            </div>
        </form>
        <button className='task__create__button' onClick={handleCreateAssignment}>ADD</button>
      </div>
    </div>
  );
};

export default TaskWrite;
