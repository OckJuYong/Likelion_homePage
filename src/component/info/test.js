// Board.js
import React, { useState, useEffect, useLocation } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../Main/header/header';
import axios from 'axios';
import cookie from 'react-cookies';
import './Board.css';

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
  const [address, setAddress] = useState('http://13.124.78.53/qna/questions');
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

  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);

  const LoginAddress = 'https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/';

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedAccessToken = cookie.load('accessToken');
        const savedRefreshToken = cookie.load('refreshToken');
        setRefreshToken(savedRefreshToken);
        setAccessToken(savedAccessToken);

        console.log('Trying to get access token...');

        const getAccessTokenResponse = await axios.post(`${LoginAddress}`, {
          access: savedAccessToken,
          refresh: savedRefreshToken,
        });

        console.log('Get Access Token Response:', getAccessTokenResponse.data);
        setUserName(getAccessTokenResponse.data.name);
        setUserDivision(getAccessTokenResponse.data.division);
        setStudent_Id(getAccessTokenResponse.data.username);
        console.log(getAccessTokenResponse.data.name, getAccessTokenResponse.data.division, getAccessTokenResponse.data.username);

        console.log('Access Token:', getAccessTokenResponse.data.access);
        cookie.save('accessToken', getAccessTokenResponse.data.access, {
          path: '/',
          expires: new Date(getAccessTokenResponse.data.expires),
        });
      } catch (error) {
        console.error('Error checking access token:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataWrapper = async () => {
      const savedAccessToken = await cookie.load('accessToken');
      const savedRefreshToken = await cookie.load('refreshToken');

      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);

      console.log('Access Token from Cookie:', savedAccessToken);
      console.log('Refresh Token from Cookie:', savedRefreshToken);
    };

    fetchDataWrapper();
  }, []);

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
      setSelectedPost(null);
    } catch (error) {
      setIsModalOpen(false);
      if (error.response && error.response.status === 500) {
      
        alert('삭제 권한이 없습니다.');
      } 
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

  const closeModal = () => {
    setIsModalOpen(false);
    setPostDetails(null);
    setIsEditMode(false);
  };

  const handleWriteButtonClick = () => {
    navigate('/boardWrite', { state: { selectedBoard } });
  };
  const navigateToEditPage = (postId) => {
    navigate(`/boardEdit/${postId}`, { state: { selectedBoard } });
  };


  return (
    <>
      <Header />
      <div className='tum'></div>
      <h1 className='Board_title'>
        <span>Lion</span>자유게시판
      </h1>
      <div className='choice_button'>
        <div className='Board_buttons'>
          <button onClick={() => handleBoardTypeChange('qna')}>자유게시판</button>
          <button onClick={() => handleBoardTypeChange('free')}>QnA게시판</button>
          <label>
            <input type='checkbox' checked={showMyPosts} onChange={handleMyPostsCheckboxChange} />
            내가 쓴 글
          </label>
        </div>
        <button onClick={handleWriteButtonClick} className='write_button'>
          글 작성
        </button>
      </div>
      <div className='Board_content'>
        {board.length > 0 && (
          <>
            <h2>{`${selectedBoard} 게시판`}</h2>
            <table className='Board_table'>
              <thead>
                <tr className='ttl'>
                  <th>ID</th>
                  <th>이름</th>
                  <th>제목</th>
                </tr>
              </thead>
              <tbody>
                {board.map((post) => (
                  <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                    <td>{post.id}</td>
                    <td>{post.author ? post.author.name : '알 수 없는 작성자'}</td>
                    <td>{post.title}</td>
                    <td>
                      <button onClick={(event) => deletePost(event)}>삭제</button>
                      <button onClick={() => navigateToEditPage(post.id)}>수정</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedPost && board.find((post) => post.id === selectedPost) && isModalOpen && (
              <>
                <div className='overlay' onClick={closeModal}></div>
                <div className='modal'>
                  <h3>{`게시물 ID: ${selectedPost}`}</h3>
                  {!isEditMode ? (
                    <>
                      <div>{`게시물 제목: ${postDetails ? postDetails.title : '불러오는 중...'}`}</div>
                      <div>{`게시물 내용: ${postDetails ? postDetails.content : '불러오는 중...'}`}</div>
                    </>
                  ) : (
                    <>
                      <input
                        type='text'
                        placeholder='제목'
                        value={editedPost.title}
                        onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                      />
                      <textarea
                        placeholder='내용'
                        value={editedPost.content}
                        onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                      />
                    </>
                  )}
                  <div>
                    <h3>댓글</h3>
                    <ul>
                      {answers.map((answer) => (
                        <li key={answer.id}>
                          {answer.id}:{answer.content}
                          <button onClick={() => deleteAnswer(answer.id)}>삭제</button>
                          <button onClick={() => editevent(answer.id)}>수정</button>
                        </li>
                      ))}
                    </ul>
                    <textarea placeholder='댓글을 입력하세요' value={comment} onChange={handleCommentChange} />
                    <button onClick={addAnswer}>댓글 작성</button>
                  </div>
                  {!isEditMode && <button onClick={editComment}>수정 완료</button>}
                  <button onClick={closeModal}>닫기</button>
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