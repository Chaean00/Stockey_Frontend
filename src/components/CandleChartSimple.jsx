import React from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import {
  elderRay,
  ema,
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  CurrentCoordinate,
  BarSeries,
  CandlestickSeries,
  ElderRaySeries,
  LineSeries,
  MovingAverageTooltip,
  OHLCTooltip,
  SingleValueTooltip,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize,
} from 'react-financial-charts';

const CandleChartSimple = ({ chartData, period }) => {
  const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => new Date(d.date));
  const height = 500;
  const width = 900;
  const margin = { left: 0, right: 48, top: 0, bottom: 24 };

  const ema12 = ema()
    .id(1)
    .options({ windowSize: 12 })
    .merge((d, c) => {
      d.ema12 = c;
    })
    .accessor((d) => d.ema12);

  const ema26 = ema()
    .id(2)
    .options({ windowSize: 26 })
    .merge((d, c) => {
      d.ema26 = c;
    })
    .accessor((d) => d.ema26);

  const elder = elderRay();
  
  // 주봉, 월봉 데이터를 처리하는 로직
  const aggregateData = (data, period) => {
    if (period === 'W') {
      // 주봉 데이터 처리 (각 주의 첫 번째 날짜로 집계)
      return data.reduce((acc, curr) => {
        const weekStart = new Date(curr.date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // 각 주의 첫 번째 날
        const weekKey = weekStart.toISOString().split('T')[0]; // 주 단위로 그룹화
        if (!acc[weekKey]) {
          acc[weekKey] = { ...curr, date: weekStart }; // 새로운 주 시작 시 데이터 초기화
        } else {
          acc[weekKey].high = Math.max(acc[weekKey].high, curr.high);
          acc[weekKey].low = Math.min(acc[weekKey].low, curr.low);
          acc[weekKey].close = curr.close; // 마지막 종가를 기록
          acc[weekKey].open = acc[weekKey].open || curr.open;
          acc[weekKey].volume += curr.volume; // 주간 거래량 합산
        }
        return acc;
      }, []);
    }
    if (period === 'M') {
      // 월봉 데이터 처리 (각 월의 첫 번째 날짜로 집계)
      return data.reduce((acc, curr) => {
        const monthStart = new Date(curr.date);
        monthStart.setDate(1); // 각 월의 첫 번째 날
        const monthKey = monthStart.toISOString().split('T')[0]; // 월 단위로 그룹화
        if (!acc[monthKey]) {
          acc[monthKey] = { ...curr, date: monthStart }; // 새로운 월 시작 시 데이터 초기화
        } else {
          acc[monthKey].high = Math.max(acc[monthKey].high, curr.high);
          acc[monthKey].low = Math.min(acc[monthKey].low, curr.low);
          acc[monthKey].close = curr.close; // 마지막 종가를 기록
          acc[monthKey].open = acc[monthKey].open || curr.open;
          acc[monthKey].volume += curr.volume; // 월간 거래량 합산
        }
        return acc;
      }, []);
    }
    return data; // 기본적으로 일봉
  };

  const aggregatedData = aggregateData(chartData, period);
  const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(aggregatedData);
  const pricesDisplayFormat = format('.2f');
  const max = xAccessor(data[data.length - 1]);
  const min = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [min, max + 5];

  const gridHeight = height - margin.top - margin.bottom;

  const elderRayHeight = 100;
  const elderRayOrigin = (_, h) => [0, h - elderRayHeight];
  const barChartHeight = gridHeight / 4;
  const barChartOrigin = (_, h) => [0, h - barChartHeight - elderRayHeight];
  const chartHeight = gridHeight - elderRayHeight;
  const yExtents = (data) => {
    return [data.high, data.low];
  };
  const dateTimeFormat = '%d %b';
  const timeDisplayFormat = timeFormat(dateTimeFormat);

  const barChartExtents = (data) => {
    return data.volume;
  };

  const candleChartExtents = (data) => {
    return [data.high, data.low];
  };

  const yEdgeIndicator = (data) => {
    return data.close;
  };

  const volumeColor = (data) => {
    return data.close > data.open ? 'rgba(49, 130, 246, 0.7)' : 'rgba(255, 98, 111, 0.7)';
  };

  const volumeSeries = (data) => {
    return data.volume;
  };

  const openCloseColor = (data) => {
    return data.close > data.open ? '#3182F6' : '#FF626F';
  };

  return (
    <ChartCanvas
      height={height}
      ratio={3}
      width={width}
      margin={margin}
      data={data}
      displayXAccessor={displayXAccessor}
      seriesName="Data"
      xScale={xScale}
      xAccessor={xAccessor}
      xExtents={xExtents}
      zoomAnchor={lastVisibleItemBasedZoomAnchor}
      useRequestAnimationFrame={false} // 애니메이션 프레임 요청 비활성화
      useHighPerformanceCanvas={true} // 고성능 캔버스 사용
    >
      <Chart id={2} height={barChartHeight} origin={barChartOrigin} yExtents={barChartExtents}>
        <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
      </Chart>
      <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
        <XAxis showGridLines showTickLabel={false} />
        <YAxis showGridLines tickFormat={pricesDisplayFormat} />
        <CandlestickSeries
          fill={(d) => (d.close > d.open ? '#3182F6' : '#FF626F')} // 양봉: 초록, 음봉: 빨강
          wickStroke={(d) => (d.close > d.open ? '#3182F6' : '#FF626F')} // 위아래 꼬리선 색상
        />
        <LineSeries yAccessor={ema26.accessor()} strokeStyle={ema26.stroke()} />
        <CurrentCoordinate yAccessor={ema12.accessor()} fillStyle={ema26.stroke()} />
        <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
        <CurrentCoordinate yAccessor={ema12.accessor()} fillStyle={ema12.stroke()} />
        <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} />
        <EdgeIndicator
          itemType="last"
          rectWidth={margin.right}
          fill={openCloseColor}
          lineStroke={openCloseColor}
          displayFormat={pricesDisplayFormat}
          yAccessor={yEdgeIndicator}
        />
        <MovingAverageTooltip
          origin={[8, 24]}
          options={[
            {
              yAccessor: ema26.accessor(),
              type: 'EMA',
              stroke: ema26.stroke(),
              windowSize: ema26.options().windowSize,
            },
            {
              yAccessor: ema12.accessor(),
              type: 'EMA',
              stroke: ema12.stroke(),
              windowSize: ema12.options().windowSize,
            },
          ]}
        />
        <ZoomButtons />
        <OHLCTooltip origin={[8, 16]} />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default CandleChartSimple;
