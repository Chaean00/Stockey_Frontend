import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../services/userApi';
import { useAuth } from '../utils/authContext';
import { FaBell } from 'react-icons/fa6';
import Alarm from './Alarm/Alarm';
import StockSearchModal from './StockSearchModal';
import KeywordSearchModal from './KeywordSearchModal';

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { nickname } = useAuth();
  const navigate = useNavigate();
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);

  const handleLogout = async () => {
    try {
      await userApi.logout();
      setIsLoggedIn(false);
      localStorage.removeItem('nickname');
      window.location.reload();
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  const handleBellClick = () => {
    setShowAlarmModal(true); // 벨 아이콘 클릭 시 모달 열기
  };

  const handleCloseAlarm = () => {
    setShowAlarmModal(false);
  };

  return (
    <div className="flex text-black_default justify-between p-3 items-center">
      {/** 로고 */}
      <div
        className="cursor-pointer"
        onClick={() => {
          navigate('/home');
        }}
      >
        <img src="/img/logo.jpg" alt="Logo" className="h-8 w-auto d-inline-block align-top" />
      </div>

      {/** 검색 버튼 */}
      <div className="flex gap-5 font-semibold">
        <div
          className="cursor-pointer hover:text-blue-200"
          onClick={() => {
            setShowKeywordModal(true);
          }}
        >
          키워드 찾아보기
        </div>
        <div
          className="cursor-pointer hover:text-blue-200"
          onClick={() => {
            setShowStockModal(true);
          }}
        >
          종목 찾아보기
        </div>
      </div>

      {/** 로그인/로그아웃/알림 버튼 */}
      {isLoggedIn ? (
        // 로그인된 상태
        <div className="flex gap-3">
          <button onClick={handleBellClick}>
            <FaBell className="text-blue-200 hover:text-blue-100 text-2xl" />
          </button>
          <button
            onClick={handleLogout}
            className="font-medium text-white bg-blue-200 hover:bg-blue-100 px-3 py-1 rounded-lg"
          >
            로그아웃
          </button>
        </div>
      ) : (
        // 로그인되지 않은 상태
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-white bg-blue-200 hover:bg-blue-100 px-3 py-1 rounded-lg"
          >
            로그인
          </button>
          <button
            onClick={() => navigate('/signUp')}
            className="font-medium text-white bg-blue-200 hover:bg-blue-100 px-3 py-1 rounded-lg"
          >
            회원가입
          </button>
        </div>
      )}

      {/* Alarm 모달을 showAlarmModal 상태에 따라 렌더링 */}
      {showAlarmModal && <Alarm show={showAlarmModal} handleClose={handleCloseAlarm} />}
      {showStockModal && <StockSearchModal show={showStockModal} setShow={setShowStockModal} />}
      {showKeywordModal && <KeywordSearchModal show={showKeywordModal} setShow={setShowKeywordModal} />}
    </div>
  );
}
