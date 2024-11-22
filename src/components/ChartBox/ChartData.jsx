import React from 'react';
import { Card, Typography } from '@material-tailwind/react';

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
      <Card className="h-full w-full ">
        <table className="w-full min-w-max table-auto text-left border-collapse border border-gray-200">
          <tbody>
            {stockInfoEntries.map(([key, value], index) => {
              // 짝수 인덱스일 때 한 줄에 두 개의 속성을 렌더링
              if (index % 2 === 0) {
                const nextEntry = stockInfoEntries[index + 1];
                return (
                  <tr key={index}>
                    {/* 현재 속성 */}
                    <td className="border-y border-gray-200 px-4 py-2 ">
                      <Typography variant="small">
                        {keyMapping[key] || key} {/* 한국어로 매핑된 키 */}
                      </Typography>
                    </td>
                    <td className="border-y border-gray-200 px-4 py-2">
                      <Typography variant="small" className="font-semibold">
                        {value}
                      </Typography>
                    </td>
                    {/* 다음 속성, 없으면 빈 셀 */}
                    {nextEntry ? (
                      <>
                        <td className="border-y border-gray-200 px-4 py-2">
                          <Typography variant="small">
                            {keyMapping[nextEntry[0]] || nextEntry[0]} {/* 한국어로 매핑된 다음 키 */}
                          </Typography>
                        </td>
                        <td className="border-y border-gray-200 px-4 py-2">
                          <Typography variant="small" className="font-semibold">
                            {nextEntry[1]}
                          </Typography>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border border-gray-200 px-4 py-2"></td>
                        <td className="border border-gray-200 px-4 py-2"></td>
                      </>
                    )}
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
