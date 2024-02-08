import React from 'react';
import{Link} from 'react-router-dom';
import './Manager.css';
import Headers from'./headers/headers'
import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from '../Main/header/MenuHeader';

function Manager() {
  return (
    <>
     <LogoHeader />
      <MenuHeader />
     <Headers state='Manager'/>
      <hr className='line'></hr>
    <div className='container'>
    <div className='Frontend_Manager'><h3>Frontend Manager</h3></div>
    <div className='Frontend_box'>
        <div className='Frontend_Reader'>Frontend Reader</div>
        <div className='ex1'><h3>옥주용 <br/> <p className='a'>컴퓨터공학과</p><br/>
        <p  className='b' >-관심 분야-</p> 
       <p className='c'>웹 앱 프론트앤드(HTNL,CSS,JS,React,ReactNative)</p> 
       <p className='d'>한밭대학교 멋사 12기 회장 및 프론트앤드장, 컴퓨터 공<br/>학과 학생회장, 소중봉사단 임원을 맡고 있는 옥주용 입<br/>니다 여러 직책들을 이용해 더 많은
        프로젝트와 기회를 <br/>제공하려는 발판을 마련하고 있습니다</p></h3></div>
        <div className='front_manager_box'>
        <div className='manager'>Frontend Manager</div>
        <div className='ex2'>
        <h3>정필성 <br/>정보통신공학과<br/><br/><br/>-관심분야-<br/>웹 앱 프론트앤드(HTNL,CSS,JS,React,ReactNative)<br/><br/><p className='show1'>한밭대학교 멋사12기 프론트앤드 임원을 맡은 정필성<br/> 입니다 현재 프론트앤드를 집중적으로 공부하고 열심히<br/> <p className='move'>나아가고 있습니다</p></p><></></h3>
        </div>
        </div>
    </div>
    <div className='Backend_Manager'>Backend Manager </div>
    <div className='Backend_box'>
        <div className='Backend_Reader'>Backend Reader</div>
        <div className='ex3'><h3>채성수 <br/><p className='e'>컴퓨터공학과</p><br/><p className='f'>-관심분야-</p><p className='g'>백앤드(DRF,Node.js), 보안(웹해킹, 시스템해킹), 디자인</p>
        <p className='h'>한밭대학교 멋사 12기 부회장 및 백앤드장을 맡고 있는<br/> 채성수입니다. 아주 쉽게 백앤드와 서버에 대해 알려주<br/>도록 하겠습니다.</p></h3></div>
        <div className='Backend_Manager_box1'>
        <div className='Backmanager1'>Backend Manager</div>
        <div className='ex4'><h3 className='i'>육종범 <p className='j'>컴퓨터공학과</p><p className='k'>-관심분야-</p><p className='l'>웹 백앤드(String,Django)</p>
        <p className='m'>한밭대학교 멋사 12기 백앤드 임원을 맡은 육종범입니다.<br/> 열정이 있는 전공자 비전공자 누구나 포트폴리오를 쌓도록<br/> <p className='move1'>도와 드리겠습니다</p></p ></h3></div>
        </div>
        <div className='Backend_Manager_box2'>
        <div className='Backmanager2'>Backend Manager</div>
        <div className='ex4'><h3 className='n'>서민재 <p className='j'>컴퓨터공학과</p><p className='p'>-관심분야-</p><p className='l'>네트워크 보안. 무선통신 보안, 웹보안</p>
        <p className='m'>한밭대학교 멋사 12기 백앤드 임원과 컴퓨터공학과 총무부장<br/>을 맡고 있는 서민재입니다. 소프트웨어봉사, 해외인텁쉽 등 여<br/><p className='move2'>러 활동으로 경험을 쌓아나고 있습니다.</p>   </p ></h3></div>
        </div>
        </div>
        </div>
       
    

    

    </>
  );
}

export default  Manager;