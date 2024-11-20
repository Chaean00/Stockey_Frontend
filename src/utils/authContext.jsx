import React, { createContext, useState, useEffect, useContext } from 'react';

// Context 생성
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState(() => localStorage.getItem('nickname'));

  // component가 마운트되었을때 한 번,
  // localStorage에서 username을 조회하여 값이 있으면 username state업데이트 , login 상태도 true로

  useEffect(() => {
    if (nickname && nickname !== '익명') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [nickname]);

  const login = (nickname) => {
    // 로그인 처리 후 상태 업데이트
    setIsLoggedIn(true);
    localStorage.setItem('nickname', nickname);
    setNickname(nickname);
  };

  return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, nickname, login }}>{children}</AuthContext.Provider>;
};

// 커스텀 훅
export const useAuth = () => useContext(AuthContext);

export { AuthProvider };
