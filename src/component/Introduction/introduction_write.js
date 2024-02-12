// IntroductionWrite.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Main/header/header';
import { useParams, useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './IntroductionWrite.css'; 
import File_img from './image 3.png';
// import { useAuth } from '../Login/AuthContext';

import MenuHeader from '../Main/header/MenuHeader';
import LogoHeader from '../Main/header/LogoHeader';



function IntroductionWrite() {
  const student_id = 20201776;
  const address = 
  "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app/";
  
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [notice_time, setNoticeTime] = useState(new Date().toISOString().split('.')[0] + 'Z'); 
  function removeHtmlTags(input) {
    return input.replace(/<[^>]*>?/gm, ''); // 정규식을 사용해 HTML 태그 제거
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // FormData 생성
    const formData = new FormData();
    // 각 필드를 FormData에 추가
    formData.append('student_id', student_id);
    const sanitizedTitle = removeHtmlTags(title);
    formData.append('notice_title', sanitizedTitle);
    const sanitizedContent = removeHtmlTags(content);
    formData.append('notice_comment', sanitizedContent);
    formData.append('notice_time', notice_time);
    formData.append('file', file);
  
    try {
      if (id) {
        setNoticeTime(new Date().toISOString().split('.')[0] + 'Z');
        // axios로 PUT 요청 시 FormData 전송
        await axios.put(`${address}notice/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
      } else {
        // axios로 POST 요청 시 FormData 전송
        await axios.post(`${address}notice/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      navigate('/introduction'); // 작성 완료 후 /introduction 페이지로 이동
    } catch (error) {
      console.error('Error submitting notice:', error.response?.data); // 에러 응답 메시지 확인
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${address}notice/${id}/`);
      navigate('/introduction');
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };
  const handleFileUpload = () => {
    // 파일 업로드를 실행하는 로직을 추가합니다.
    // 예를 들어, 클릭 시 input[type="file"] 엘리먼트를 클릭하는 방식을 사용할 수 있습니다.
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  };

  

  return (
    <>    
    <MenuHeader />
    <LogoHeader />
    <div className="introduction-write-container">
      {/* <Header /> */}
      <form onSubmit={handleSubmit} className='introduction__write__container'>
        <label className='introduction_title_write_name'>공지사항 제목</label>
        <input className="introduction_title_write" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label className='introduction_content_write_name'>공지사항 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className='introduction_content_write'
          rows={10} // 원하는 높이로 조절
        />

        <div className="file-upload-container">
          <div className='file_container'>
            <img className="file_img" src={File_img} onClick={handleFileUpload} />
            <span className='FIle_name'>FILE</span>
          </div>
          <input
            id="fileInput"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </div>
        
        <div className="button-container">
          <button type="submit" className="submit-button">
            {id ? 'Edit' : 'Create'}
          </button>
          {id && (
            <button type="button" className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
    </>
  );
}

export default IntroductionWrite;
