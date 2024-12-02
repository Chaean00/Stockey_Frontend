import React from 'react';
import KeywordBox from './KeywordBox';
import StockBox from './StockBox';
import NewsBox from './NewsBox';

export default function LandingPage() {
  return (
    <div className="w-full">
      {/**키워드에 대한 랭킹 및 차트 */}
      <div className="w-full">
        <KeywordBox />
      </div>

      {/**종목에 대한 랭킹 및 차트 */}
      <div className="w-full ">
        <StockBox />
      </div>

      {/* '키워드 + 종목' 뉴스 카드 */}
      <div className="w-full ">
        <NewsBox />
      </div>
    </div>
  );
}
