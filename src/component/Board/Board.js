import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Board.css';
import cookie from "react-cookies";

import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';

import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from "../Main/header/MenuHeader";


function Board() {
  const studentId = parseInt('20201111', 10);
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
        const response = await axios.get(`${address}/?student_id=${showMyPosts ? studentId : ''}`);
        setBoard(response.data);
      } catch (error) {
        console.error('게시판 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchBoardData();
  }, [showMyPosts, address, studentId]);

  //----------------------------------------

  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);
  
  const LoginAddress = "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";

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
        console.log(address);
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

  const handleSwiper = (swiper) => {
    if (swiper) {
      setTopSwiper(swiper);
      setBottomSwiper(swiper);
    }
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

  const [topSwiper, setTopSwiper] = useState(null);
  const [bottomSwiper, setBottomSwiper] = useState(null);

  const handleSliderPrev = () => {
    topSwiper.slidePrev();
    console.log("top-1");
    bottomSwiper.slidePrev();
    console.log("bottom-1");

  };

  const handleSliderNext = () => {
    topSwiper.slideNext();
    console.log("top-2");

    bottomSwiper.slideNext();
    console.log("bottom-2");

  };


  //---------------스와이퍼부분

  return (
    <>
      <LogoHeader />
      <MenuHeader />
      <div className='tum'></div>
      <div className='choice_button'>
        <div className='Board_main_header_container'>
          <span className='Board_Lion_title'>Lion</span>
          <span className="Board_title">{`${selectedBoard}게시판`}</span>
          <div className="Board_buttons">
            <button onClick={() => handleBoardTypeChange('qna')}>자유게시판</button>
            <button onClick={() => handleBoardTypeChange('free')}>QnA게시판</button>
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
            <div className="Board_table">
              <Swiper {...swiperSettings} onSwiper={setTopSwiper} spaceBetween={10} slidesPerView={3}>
                {board.map((post, index) => (
                  index % 2 === 0 && (
                  <SwiperSlide key={post.id} className='board_swiper_main_container'>
                    <div className="board_swiper_container" onClick={() => handlePostClick(post.id)}>
                      <div className='board_swiper_left'>
                        <div className='board_swiper_left_id'>{post.id}</div>
                        <div className='board_swiper_left_title'>{post.title}</div>
                      </div>
                      <div>{post.author ? post.author.name : '알 수 없는 작성자'}</div>
                    </div>
                  </SwiperSlide>
                  )
                ))}
              </Swiper>
              <Swiper {...swiperSettings} onSwiper={setBottomSwiper} spaceBetween={10} slidesPerView={3}>
                {board.map((post, index) => (
                  index % 2 === 1 && (
                  <SwiperSlide key={post.id} className='board_swiper_main_container'>
                    <div className="board_swiper_container" onClick={() => handlePostClick(post.id)}>
                      <div className='board_swiper_right'>
                      <div className='board_swiper_right_id'>{post.id}</div>
                        <div className='board_swiper_right_title'>{post.title}</div>
                      </div>
                      <div>{post.author ? post.author.name : '알 수 없는 작성자'}</div>
                    </div>
                  </SwiperSlide>
                  )
                ))}
              </Swiper>
            </div>
            <div className="slider_button_container">
              <button onClick={handleSliderPrev}>이전</button>
              <button onClick={handleSliderNext}>다음</button>
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