import React from 'react';
import KeywordBox from './KeywordBox';
import StockBox from './StockBox';

export default function LandingPage() {
  return (
    <div className="w-full">
      {/**키워드에 대한 랭킹 및 차트 */}
      <div>
        <KeywordBox />
      </div>

      {/**종목에 대한 랭킹 및 차트 */}
      <div>
        <StockBox />
      </div>
    </div>
  );
}
