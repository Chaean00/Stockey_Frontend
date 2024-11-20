import React from 'react';

export default function KeywordChartPage() {
  return (
    <div>
      {/** header */}
      <div>
        <h2>영업이익(keyword_name)</h2>
        <input placeholder="원하는 종목을 검색해보세요" />
      </div>
      {/** main */}
      <div>
        <div>주식 차트</div>
        <div>주식 차트의 info</div>
      </div>
    </div>
  );
}
