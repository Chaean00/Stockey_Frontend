import React, { useRef, useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import CandleChart from './CandleChart';
import CandleChartSimple from '../CandleChartSimple';
import ChartData from './ChartData';
import UserLike from './UserLike';
export default function ChartBox({
  chartData,
  setChartData,
  stockInfo,
  stockLikeList,
  bringStockChart,
  period,
  setPeriod,
}) {
  const containerRef = useRef(null); // 전체 컨테이너 참조
  const chartContainerRef = useRef(null); // CandleChart 상위 div 참조
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    bringStockChart(stockInfo.stock_code, setChartData, period);
  }, [period]);

  const moveToStock = (chart_period) => {
    setPeriod(chart_period);
  };

  // 전체 컨테이너 크기 측정
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CandleChart 상위 div 크기 측정
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const entry = entries[0];
        setChartDimensions({
          width: entry.contentRect.width * 0.98 || 600,
          height: entry.contentRect.height,
        });
      }
    });

    if (chartContainerRef.current) observer.observe(chartContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const currData = chartData[chartData.length - 1];

  return (
    <div ref={containerRef}>
      <div className={`flex flex-row space-x-4 items-start font-semibold`}>
        {/** chart box */}
        <div
          ref={chartContainerRef} // CandleChart 상위 div 참조
          className={`border-2 rounded-xl p-4 w-3/4`}
        >
          <Tabs id="period-tabs" activeKey={period} onSelect={moveToStock} className="mb-3">
            <Tab eventKey="D" title="일봉">
              {chartData ? (
                <CandleChart
                  chartData={chartData}
                  width={chartDimensions.width || 0} // 상위 div의 너비 전달
                  height={500} // 고정 비율로 높이 전달
                />
              ) : (
                <div className="animate-skeleton h-[500px] bg-gray-200"></div>
              )}
            </Tab>
            <Tab eventKey="W" title="주봉">
              {chartData ? (
                <CandleChart
                  chartData={chartData}
                  width={chartDimensions.width || 0} // 상위 div의 너비 전달
                  height={500} // 고정 비율로 높이 전달
                />
              ) : (
                <div className="animate-skeleton h-[500px] bg-gray-200"></div>
              )}
            </Tab>
            <Tab eventKey="M" title="월봉">
              {chartData ? (
                <CandleChartSimple
                  chartData={chartData}
                  width={chartDimensions.width || 0} // 상위 div의 너비 전달
                  height={500} // 고정 비율로 높이 전달
                />
              ) : (
                <div className="animate-skeleton h-[500px] bg-gray-200"></div>
              )}
            </Tab>
          </Tabs>
        </div>
        {/** data box */}
        <div className="w-1/4">
          <ChartData stockInfo={currData} />
          <UserLike stockLikeList={stockLikeList} />
        </div>
      </div>
    </div>
  );
}
