import React, { createContext, useContext, useState, useEffect } from 'react';
import { findInitialLikeKeyword } from './likeFunction';

const LikeContext = createContext();

// Context Provider
export const LikeProvider = ({ children }) => {
  const [keywordLikeList, setKeywordLikeList] = useState([]);
  const [isLiked, setIsLiked] = useState(false); // 초기 좋아요 상태
  const [keywordData, setKeywordData] = useState('');
  const [stockInfo, setStockInfo] = useState({});

  // 즐겨찾기 목록 가져오기
  useEffect(() => {
    if (stockInfo.stock_id) {
      // keywordData.keyword
      findInitialLikeKeyword(keywordData.keyword, setIsLiked, setKeywordLikeList);
    }
  }, [stockInfo]);

  return (
    <LikeContext.Provider
      value={{
        keywordLikeList,
        setKeywordLikeList,
        isLiked,
        setIsLiked,
        keywordData,
        setKeywordData,
        stockInfo,
        setStockInfo,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};

// Context를 사용하는 커스텀 Hook
export const useLikeContext = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error('useLikeContext must be used within a LikeProvider');
  }
  return context;
};
