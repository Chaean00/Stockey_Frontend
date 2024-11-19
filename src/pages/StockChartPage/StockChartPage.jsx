import React from 'react';

export default function StockChartPage() {
  return (
    <div>
      {/** header */}
      <div>
        <h2>삼성전자(stock_name)</h2>
        <input placeholder="원하는 키워드를 검색해보세요" />
      </div>
      {/** main */}
      <div>
        <div>주식 차트</div>
        <div>주식 차트의 info</div>
      </div>
    </div>
  );
}
