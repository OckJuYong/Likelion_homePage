import React, {useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import likelionLogo from '../../images/LikeLion_Logo.png';
import MyInfoImg from '../../images/MyInfo.png';
import '../main/main.css';


function LogoHeader()  {
    const navigate = useNavigate();
    const LoginAddress =
    "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [userDivision, serUserDivision] = useState(null);
    const [studentId, setStudentId] = useState(null);
    const [userName, setUserName] = useState(null);
  
    const getAccessToken = async () => {
      try {
        const savedAccessToken = cookie.load("accessToken");
        const savedRefreshToken = cookie.load("refreshToken");
        setAccessToken(savedAccessToken);
        setRefreshToken(savedRefreshToken);
  
        console.log("Trying to get access token...");
  
        const getAccessTokenResponse = await axios.post(
          `${LoginAddress}`,
          {
            access: savedAccessToken,
            refresh: savedRefreshToken,
          }
        );
  
        console.log("Get Access Token Response:", getAccessTokenResponse.data);
        
        // 상태를 업데이트하고 나서 값 확인
        setUserInfo(getAccessTokenResponse.data)
        serUserDivision(getAccessTokenResponse.data.division)
        setStudentId(getAccessTokenResponse.data.username)
        setUserName(getAccessTokenResponse.data.name)
  
        console.log("userInfo: ", userInfo);
        console.log(userDivision, studentId, userName);
  
        console.log("Access Token:", getAccessTokenResponse.data.access);
  
        cookie.save("accessToken", getAccessTokenResponse.data.access, {
          path: "/",
          expires: new Date(getAccessTokenResponse.data.access),
        });
      } catch (error) {
        console.error("Error checking access token:", error);
      }
    };
  
    // 최초 렌더링 시 또는 토큰이 있을 경우 한 번 호출
    useEffect(() => {
      getAccessToken();
    }, []);
    useEffect(() => {
      serUserDivision(userDivision)
      setStudentId(studentId)
      setUserName(userName)
    }, [userInfo, userDivision, studentId, userName]);
  
    const LogoutHeandler = () => {
      cookie.remove("accessToken", { path: "/" });
      cookie.remove("refreshToken", { path: "/" });
  
      // Clear state values
      setAccessToken(null);
      setRefreshToken(null);
      setUserInfo([]);
      serUserDivision(null);
      setStudentId(null);
      setUserName(null);
  
      navigate('/login');
    } 
    return(
      <div className="background-image">
        <Link to="/"> {/* Add anchor tag here */}
          <img src={likelionLogo} alt="Lion Logo" className="lion-logo" />
        </Link>
        <div className="Logo_userName">
          <span>{userName ? `${userName}'s` : 'Like`s'} </span>
          <span className="yellow">Lion</span>
        </div>
        <span className="Logo_bottom">
          <span className="yellow">LikeLion</span>
          <span> x </span>
          <span className="red">H</span>
          <span className="blue">B</span>
          <span className="dark-blue">N</span>
          <span className="very-light-yellow">U</span>
        </span>
      </div>
    )
}

export default LogoHeader;