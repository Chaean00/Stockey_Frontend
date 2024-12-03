import React from 'react';
import KeywordBox from './KeywordBox';
import StockBox from './StockBox';
import NewsBox from './NewsBox';
import { useState } from 'react';

export default function LandingPage() {
  const [keywordData, setKeywordData] = useState(''); // 키워드 정보

  return (
    <div className="w-full animate-fadeIn">
      {/**키워드에 대한 랭킹 및 차트 */}
      <div className="w-full mb-20">
        <KeywordBox keywordData={keywordData} setKeywordData={setKeywordData} />
      </div>

      {/* 키워드에 대한 뉴스 카드 */}
      <div className="w-full mb-20">
        <NewsBox keywordData={keywordData} />
      </div>

      {/**종목에 대한 랭킹 및 차트 */}
      <div className="w-full mb-16">
        <StockBox />
      </div>
    </div>
  );
}
