import React, { useState, useEffect } from 'react';
import './board_test.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import cookie from "react-cookies";
import './Board_write.css';

import MenuHeader from '../Main/header/MenuHeader';
import LogoHeader from '../Main/header/LogoHeader';



function Board_Write() {
  const navigate = useNavigate();
  const location = useLocation();

  const [movieContent, setMovieContent] = useState({
    student_id: 20201738,
    title: '',
    content: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);

  const selectedBoard = location.state?.selectedBoard || 'qna';
  console.log("주소입력", selectedBoard);

  const targetBoard = selectedBoard === 'qna' ? 'qna' : 'free';
    console.log("주소확인", targetBoard);

  const apiAddresses = {
    qna: 'http://13.124.78.53/qna/questions/',
    free: 'http://13.124.78.53/free/questions/',
  };

  const address = apiAddresses[targetBoard];
  console.log(address);

  const handleTitleChange = (e) => {
    setMovieContent({
      ...movieContent,
      title: e.target.value,
    });
  };

  const handleContentChange = (e, editor) => {
    const content = editor.getData();
    setMovieContent({
      ...movieContent,
      content: content,
    });
  };

  //-----------------------------------
  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);

  useEffect(() => {
    setMovieContent({
      student_id: student_Id,  // 변수로 직접 사용, 중괄호 제거
      title: '',
      content: '',
    });
  }, [student_Id]);
  console.log(setMovieContent.student_Id);
  
  const LoginAddress = 
  // "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";
  "http://15.164.190.171/login/";

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
        setUserName(getAccessTokenResponse.data.name);
        setUserDivision(getAccessTokenResponse.data.division);
        setStudent_Id(getAccessTokenResponse.data.username)
        console.log(getAccessTokenResponse.data.name, getAccessTokenResponse.data.division, getAccessTokenResponse.data.username);
        setMovieContent((prevContent) => ({
          ...prevContent,
          student_id: parseInt(getAccessTokenResponse.data.username, 10),
        }));
        console.log(movieContent);
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

  //-----------------------------------

  const handleCreatePost = async () => {
    try {
      const response = await axios.post(address, {
        student_id: movieContent.student_id,
        title: movieContent.title,
        content: movieContent.content,
      });
      console.log(movieContent);
      console.log(response.data);

      setIsEditMode(false);
      setEditingPostId(null);
      navigate('/Board');

    } catch (error) {
      console.error('게시물 등록 또는 수정 중 오류 발생:', error);
      console.log("여기가 문제여");
      console.log(movieContent);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingPostId(null);
    setMovieContent({
      student_id: {student_id},
      title: '',
      content: '',
    });
  };

  const handleSubmit = () => {
    if (isEditMode) {
      console.log('handleEditPost 함수가 정의되지 않았습니다.');
      // handleEditPost();
      navigate('/Board');
    } else {
      handleCreatePost();
    }
  };

  return (
    <>
      <MenuHeader />
      <LogoHeader />
      <div className='tum'></div>
        <div className='board__write__main__container'>
          <div className='board__write__title__container'>
            <h1 className="Board_title"><span>Lion</span>게시판 제목</h1>
            <div className="write_content">
              <input
                type="text"
                value={movieContent.title}
                onChange={handleTitleChange}
                className='board__write__title'
              />
          </div>
          <h1 className="Board_write_content"><span>Lion</span>게시판 내용</h1>
          <textarea
          value={movieContent.content}
          onChange={(e) => handleContentChange(e, { getData: () => e.target.value })}
          className='board__write__content'
        />
          {/* <CKEditor
            editor={ClassicEditor}
            data={movieContent.content}
            onChange={handleContentChange}
            className="custom-ckeditor-style"
          /> */}
          <div className="buttons">
            <button className="board_edit_button" onClick={handleSubmit}>{isEditMode ? 'ADD' : 'ADD'}</button>
            {isEditMode && (
              <button className="board_edit_button_del" onClick={handleCancelEdit}>수정 취소</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Board_Write;