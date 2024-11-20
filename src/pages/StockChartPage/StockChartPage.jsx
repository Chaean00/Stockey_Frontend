import React, { useEffect, useState } from 'react';
import SidebarStock from '../../components/SidebarStock';
import {CandleChart} from '../../components/CandleChart';
import stockApi from '../../services/stockApi';

export default function StockChartPage() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stockInfo, setStockInfo] = useState({
    stock_id: 11, //db에서 직접 가져와서 나중에 수정해야 함
    stock_name: '신한지주',
    stock_code: '055550',
  });

  useEffect(() => {
    bringStockChart();
  }, []);

  const searchStock = async () => {
    try {
      const response = await stockApi.searchStock(search);
      setSearchResult(response.data);
    } catch (error) {
      console.error('종목 검색 실패:', error.response?.data?.message || error.message);
      alert('종목 검색에 실패했습니다...');
    }
  };

  const bringStockChart = async () => {
    try {
      const response = await stockApi.getStockChart(stockInfo);
      setChartData(response.data);
    } catch (error) {
      console.error('차트 조회 실패:', error.response?.data?.message || error.message);
      alert('차트 조회에 실패했습니다...');
    }
  };

  return (
    <div>
      {/** header */}
      <div>
        <h2>{stockInfo.stock_name}</h2>
        <div>
          <div>
            <input placeholder="원하는 키워드를 검색해보세요" onChange={(e) => setSearch(e.target.value)} />
            <button onClick={searchStock}>검색</button>
          </div>
          <ul>
            {searchResult?.map((el, i) => {
              return (
                <li
                  key={i}
                  onClick={() => {
                    setStockInfo(el);
                    bringStockChart();
                  }}
                >
                  <div>{el.stock_name}</div>
                  <div>{el.stock_code}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/** sidebar */}
      <div>
        <SidebarStock stockInfo={stockInfo} />
      </div>
      {/** main */}
      <div>
        <CandleChart stockInfo={stockInfo} chartData={chartData} />
      </div>
    </div>
  );
}
