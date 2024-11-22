import React from 'react';
import CandleChart from './CandleChart';
import ChartData from './ChartData';
export default function ChartBox(props) {
  const currData = props.chartData[props.chartData.length - 1];
  return (
    <div className="flex flex-col border border-gray-300 items-center p-4 border- space-y-4">
      <div>
        <CandleChart chartData={props.chartData} />
      </div>
      <div className="w-full">
        <ChartData stockInfo={currData} />
      </div>
    </div>
  );
}
