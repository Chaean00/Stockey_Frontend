import React, { useRef, useState, useEffect } from 'react';
import CandleChart from './CandleChart';
import ChartData from './ChartData';

export default function ChartBox(props) {
  const containerRef = useRef(null); // 부모 컨테이너 참조
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize(); // 초기 크기 설정
    window.addEventListener('resize', handleResize); // 리사이즈 이벤트 리스너 등록
    return () => window.removeEventListener('resize', handleResize); // 정리
  }, []);

  const currData = props.chartData[props.chartData.length - 1];
  return (
    <div
      ref={containerRef} // 크기 참조를 위한 Ref
      className="flex flex-col border border-gray-300 items-center p-4 space-y-4"
    >
      <div className="w-full">
        {/* 부모 크기에 따라 CandleChart 크기 전달 */}
        <CandleChart chartData={props.chartData} width={dimensions.width} height={dimensions.height * 0.8} />
      </div>
      <div className="w-full">
        <ChartData stockInfo={currData} />
      </div>
    </div>
  );
}
