import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Main from './component/Main/main/main';
import Board from './component/Board/Board';  
import Introduction from './component/Introduction/introduction';
import IntroductionId from './component/Introduction/introduction_id';
import IntroductionWrite from './component/Introduction/introduction_write';
import IntroductionEdit from './component/Introduction/introductionEdit';

import Login from './component/Login/Login';
import { AuthProvider } from './component/Login/AuthContext';

import Info from './component/info/info';
import Notice from './component/Notice/Notice';

import Task from './component/Task/Task';
import TaskWrite from './component/Task/TaskWrite';
import TaskEdit from './component/Task/TaskEdit';
import Assignment from './component/Task/Assingment';

import BoardWrite from './component/Board/Board_write';

import Test from './component/Board/Board_test';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main />} />
                    
                    <Route path="/Board" element={<Board />} />
                    <Route path="/BoardWrite" element={<BoardWrite />} />

                    <Route path="/Introduction" element={<Introduction />} />
                    <Route path='/IntroductionWrite' element={<IntroductionWrite />} />
                    <Route path='/IntroductionId' element={<IntroductionId />} /> 
                    <Route path="/edit-notice/:id" element={<IntroductionEdit />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/info" element={<Info />} />
                    <Route path="/Notice" element={<Notice />} />

                    <Route path="/Task" element={<Task />} />
                    <Route path="/TaskWrite" element={<TaskWrite />} />
                    <Route path='/TaskEdit/:id' element={<TaskEdit />} />
                    <Route path='/Assignment/:id' element={<Assignment />} />


                    <Route path='/test' element={<Test />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
