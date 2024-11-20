import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../services/userApi';
import { useAuth } from '../utils/authContext';

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { nickname } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userApi.logout();
      setIsLoggedIn(false);
      localStorage.removeItem('nickname');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  return (
    <div>
      <div
        onClick={() => {
          navigate('/');
        }}
      >
        logo
      </div>
      {isLoggedIn ? (
        // 로그인된 상태
        <div>
          <p>환영합니다, {nickname && nickname}님</p>
          <button>알림 설정</button>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        // 로그인되지 않은 상태
        <div>
          <button onClick={() => navigate('/login')}>로그인</button>
          <button onClick={() => navigate('/signUp')}>회원가입</button>
        </div>
      )}
    </div>
  );
}
