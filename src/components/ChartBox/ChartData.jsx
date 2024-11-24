import React from 'react';
import { Typography } from '@material-tailwind/react';

export default function ChartData(props) {
  // stockInfo가 undefined/null인 경우 기본값을 빈 객체로 설정
  const stockInfo = props.stockInfo || {};
  // 한국어 매핑을 위한 객체
  const keyMapping = {
    date: '현재 날짜',
    open: '시가',
    high: '고가',
    low: '저가',
    close: '종가',
    volume: '거래량',
    ema12: 'EMA 12',
    ema26: 'EMA 26',
    bullPower: 'Bull Power',
    bearPower: 'Bear Power',
  };

  // Object.entries로 속성(key-value) 쌍을 배열로 변환
  const stockInfoEntries = Object.entries(stockInfo).flatMap(([key, value]) => {
    if (key === 'elderRay') {
      // elderRay 내부 값 분해
      return Object.entries(value).map(([subKey, subValue]) => [subKey, subValue]);
    }
    return [[key, value]]; // 나머지 값은 그대로 반환
  });

  return (
    <div>
      {[...Array(Math.ceil(stockInfoEntries.length / 5))].map((_, tableIndex) => {
        // 현재 테이블에 포함될 5개의 요소 추출
        const tableEntries = stockInfoEntries.slice(tableIndex * 5, tableIndex * 5 + 5);

        return (
          <div key={tableIndex} className="border w-full border-gray-300 mb-3 pl-10 py-3 rounded-xl">
            <table>
              <tbody>
                {tableEntries.map(([key, value], index) => {
                  return (
                    <tr key={index}>
                      {/* 현재 속성 */}
                      <td className="py-2">
                        <Typography variant="small">
                          {keyMapping[key] || key} {/* 한국어로 매핑된 키 */}
                        </Typography>
                      </td>
                      <td className="pl-10 py-2">
                        <Typography variant="small" className="font-semibold">
                          {value}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
