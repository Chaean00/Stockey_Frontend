import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation(); // 현재 경로 추적

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 이동 시 스크롤을 상단으로 이동
  }, [location]); // location이 변경될 때마다 실행

  return null; // 컴포넌트는 아무것도 렌더링하지 않음
};

export default ScrollToTop;
