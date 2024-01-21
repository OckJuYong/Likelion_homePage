import React, { useState, useEffect, useRef  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Board/Board.css';
import cookie from "react-cookies";

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from "../Main/header/MenuHeader";

import leftButton from '../Board/left.png';
import rightButton from '../Board/right.png';


function Board() {

  const sliderRef = useRef(null);
  let studentId = parseInt('20201111', 10);
  let [jjinStudentId, setJjinStudentId] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState('qna');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [board, setBoard] = useState([]);
  const [postDetails, setPostDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: '', content: '' });
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [address, setAddress] = useState('http://13.124.78.53/qna/questions'); // 초기 주소 설정
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get(`${address}/?student_id=${showMyPosts ? student_Id : ''}&ordering=-id`);
        setBoard(response.data);
      } catch (error) {
        console.error('게시판 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchBoardData();
  }, [showMyPosts]);

  //----------------------------------------

  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);
  studentId = parseInt(student_Id, 10)
  setJjinStudentId = studentId;
  
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
  
        setUserName(getAccessTokenResponse.data.name);
        setUserDivision(getAccessTokenResponse.data.division);
        setStudent_Id(getAccessTokenResponse.data.username)
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
  //----------------------------------------

  const setBoardType = (type) => {
    setSelectedBoard(type);
  };

  const handleBoardTypeChange = (type) => {
    setBoardType(type);
    setAddress(`http://13.124.78.53/${type}/questions`);
  };

  const handleMyPostsCheckboxChange = () => {
    setShowMyPosts(!showMyPosts);
  };

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get(`${address}/`);
        setBoard(response.data);
      } catch (error) {
        console.error('게시판 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchBoardData();
  }, [address]);

  const fetchPostDetails = async (postId) => {
    try {
      const response = await axios.get(`${address}/${postId}/`);
      setPostDetails(response.data);

      const answerResponse = await axios.get(`${address}/${postId}/answers/`);
      setAnswers(answerResponse.data);
    } catch (error) {
      console.error('게시물 상세 정보를 불러오는 중 오류 발생:', error);
    }
  };

  const handlePostClick = async (postId) => {
    setAnswers([]); // 답변 목록 초기화
    if (board && board.find((post) => post.id === postId)) {
      setAnswers([]);
      setSelectedPost(postId);
      setIsModalOpen(true);
      setIsEditMode(false);
      fetchPostDetails(postId);
    } else {
      setSelectedPost(null);
      setIsModalOpen(false);
      setPostDetails(null);
      setAnswers([]);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const addAnswer = async () => {
    if (selectedPost && comment.trim() !== '') {
      try {
        await axios.post(`${address}/${selectedPost}/answers/`, {
          student_id: studentId,
          content: comment,
        });
        const response = await axios.get(`${address}/${selectedPost}/answers/`);
        const getanswerdata = response.data;

        setAnswers(getanswerdata);

        setIsModalOpen(true);
      } catch (error) {
        console.error('댓글 추가 중 오류 발생:', error);
      }
    }
  };

  const deleteAnswer = async (answerId) => {
    try {
      await axios.delete(`${address}/${selectedPost}/answers/${answerId}/?student_id=${studentId}`);
      const updatedAnswers = answers.filter((answer) => answer.id !== answerId);
      setAnswers(updatedAnswers);
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  const editComment = async () => {
    try {
      const commentToUpdate = answers.find((comment) => comment.id === selectedCommentId);
      console.log(commentToUpdate);

      await axios.put(`${address}/${selectedPost}/answers/${selectedCommentId}/`, {
        student_id: studentId,
        content: comment,
      });

      const updatedAnswerResponse = await axios.get(`${address}/${selectedPost}/answers/`);
      setAnswers(updatedAnswerResponse.data);
      const updatedComment = updatedAnswerResponse.data.find((comment) => comment.id === selectedCommentId);
      if (updatedComment) {
        setComment(updatedComment.content);
      }
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
    }
  };

  const editevent = async (commentId) => {
    try {
      const commentToUpdate = answers.find((comment) => comment.id === commentId);
      setComment(commentToUpdate.content);
      setSelectedCommentId(commentId);

      setIsModalOpen(true);
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
    }
  };

  const deletePost = async () => {
    try {
      await axios.delete(`${address}/${selectedPost}/?student_id=20201738`);
      const updatedBoard = board.filter((post) => post.id !== selectedPost);
      setBoard(updatedBoard);
      setIsModalOpen(false);
      setPostDetails(null);
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생:', error);
      setIsModalOpen(false);
    }
  };

  const handleEditClick = (event) => {
    event.stopPropagation(); // 이벤트 전파 방지
    if (postDetails) {
      setIsEditMode(true);
      setEditedPost({
        title: postDetails.title || '',
        content: postDetails.content || '',
      });
      setIsModalOpen(true);
    }
  };

  const navigateToEditPage = (postId) => {
    navigate(`/boardEdit/${postId}`);
  };

  const editPost = async () => {
    try {
      await axios.put(`${address}/${selectedPost}/answers/`, editedPost);
      const response = await axios.get(`${address}/${selectedPost}/`);
      const updatedPost = response.data;

      setPostDetails(updatedPost);

      const boardResponse = await axios.get(`${address}/`);
      const updatedBoard = boardResponse.data;

      setBoard(updatedBoard);

      setIsModalOpen(false);

      navigateToEditPage(selectedPost);
    } catch (error) {
      console.error('게시물 수정 중 오류 발생:', error);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostDetails(null);
    setIsEditMode(false);
  };

  const handleWriteButtonClick = () => {
    // 여기서 선택된 게시판 정보를 state로 넘겨줍니다.
    navigate('/boardWrite', { state: { selectedBoard } });
  };

  //---------------스와이퍼부분

  

  // 상단 슬라이더와 하단 슬라이더에 대한 인스턴스 생성

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

  const slickSettings = {
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    slidesPerRow: 4, 
    arrows: true, 
    infinite: true,
    infinite: false,
    dots: true,
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
  //---------------스와이퍼부분

  return (
    <>
      <div  className="board__logoHeader">
        <LogoHeader />
        <MenuHeader />
      </div>
      <div className='tum'></div>
      <div className='choice_button'>
        <div className='Board_main_header_container'>
          <span className='Board_Lion_title'>Lion</span>
          <span className="Board__title">{`${selectedBoard}게시판`}</span>
          <div className="Board_buttons">
            <button className="board__qna__button" onClick={() => handleBoardTypeChange('qna')}>QnA게시판</button>
            <button className="board__free__button" onClick={() => handleBoardTypeChange('free')}>자유게시판</button>
            {/* <label>
              <input
                type="checkbox"
                checked={showMyPosts}
                onChange={handleMyPostsCheckboxChange}
              />
              내가 쓴 글
            </label> */}
          </div>
        </div>
        <button onClick={handleWriteButtonClick} className='write_button'>+</button>
      </div>
      <hr className='board_line'/>
      <div className="Board_content">
        {board.length > 0 && (
          <>
            <div className="slider_button_container">
              <button onClick={handleSliderPrev}><img className="slider__left__button" src={leftButton} alt="Left Button" /></button>
              <button onClick={handleSliderNext}><img src={rightButton} alt="Right Button" /></button>
            </div>
            <div className="Board_table">
              <Slider {...slickSettings} ref={sliderRef}>
                {board[0].id > board[1].id ?
                  board.map((post, index) => (
                    <div key={post.id} className='board_swiper_main_container'>
                      <div className="board_swiper_container" onClick={() => handlePostClick(post.id)}>
                        <div className='board_swiper_left'>
                          <div className='board_swiper_left_id'>{post.id}</div>
                          <div className='board_swiper_left_title'>{post.title}{post.content}</div>
                        </div>
                        <div className='board__write__name'>
                          {userDivision == "admin" ? post.author.name : ''}
                          <div className='board__write__time'>
                            {post.created_at.split('T')[0]}
                          </div>
                        </div>
                        <div>
                          <div className='board__del__edit__button'>
                            {userDivision === "admin" ? (
                              <button className="board__admin__del__button" onClick={(event) => deletePost(event)}>
                                ❌
                              </button>
                            ) : (
                              null
                            )}
                          </div>
                          <div>
                            {userDivision === "admin" || post.author.student_id === student_Id ? (
                              <button className="board__admin__edit__button" onClick={() => navigateToEditPage(post.id)}>
                                🔨
                              </button>
                            ) : (
                              null
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : 
                  board.reverse().map((post, index) => (
                    <div key={post.id} className='board_swiper_main_container'>
                      <div className="board_swiper_container" onClick={() => handlePostClick(post.id)}>
                        <div className='board_swiper_left'>
                          <div className='board_swiper_left_id'>{post.id}</div>
                          <div className='board_swiper_left_title'>{post.title}{post.content}</div>
                        </div>
                        <div className='board__write__name'>
                          {userDivision == "admin" ? post.author.name : '알 수 없는 작성자'}
                          <div className='board__write__time'>
                            {post.created_at.split('T')[0]}
                            {userDivision}
                          </div>
                        </div>
                        <div>
                          <div className='board__del__edit__button'>
                            {userDivision === "admin" ? (
                              <button className="board__admin__del__button" onClick={(event) => deletePost(event)}>
                                ❌
                              </button>
                            ) : (
                              null
                            )}
                          </div>
                          <div>
                            {userDivision === "admin" || post.author.student_id === student_Id ? (
                              <button className="board__admin__edit__button" onClick={() => navigateToEditPage(post.id)}>
                                🔨
                              </button>
                            ) : (
                              null
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </Slider>
            </div>

  
            {selectedPost && board.find((post) => post.id === selectedPost) && isModalOpen && (
              <>
                <div className="overlay" onClick={closeModal}></div>
                <div className="modal"  style={{ width: '50%', height: "80%"}}>
                  <h3 className='modal__title'>{`${postDetails ? postDetails.title : '불러오는 중...'}`}</h3>
                  <span></span>
                  <div className='modal__day__line'></div>
                  {!isEditMode ? (
                    <>
                      <div>{` ${postDetails ? postDetails.content : '불러오는 중...'}`}</div>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="제목"
                        value={editedPost.title}
                        onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                      />
                      <textarea
                        placeholder="내용"
                        value={editedPost.content}
                        onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                      />
                    </>
                  )}
                  <div>
                    <h3 className='modal__answer__main'>댓글</h3>
                    <div className='modal__answer__liner'></div>
                      {answers.map((answer) => (
                        <>
                        <span className='madal__userInfo'>{answer.id}</span>
                        <li key={answer.id} className='modal__answer__answer_main'>
                          <span className='modal__answer__answer'>{answer.content}</span>
                          <div>
                            <button className="modal__answer__edit" onClick={() => editevent(answer.id)}>수정</button>
                            <button className="modal__answer__del" onClick={() => deleteAnswer(answer.id)}>-</button>
                          </div>
                        </li>
                        </>
                      ))}
                      <div className='modal__answer__container'>
                        <div className='modal__answer__input__container'>
                          <span className='modal__answer__input__main'>댓글 작성</span>
                          <textarea
                            placeholder="댓글을 입력하세요"
                            value={comment}
                            onChange={handleCommentChange}
                            className='modal__answer__input'
                          />
                        </div>
                        <div className='modal__plusAndChange'>
                          <button className="modal__add__button" onClick={addAnswer}>ADD</button>
                          {!isEditMode && (
                            <button className="modal__edit__button"onClick={editComment}>EDIT</button>
                          )}
                        </div>
                        </div>
                      </div>
                    <button className="modal__close-button" onClick={closeModal}>X</button>
                    </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Board;