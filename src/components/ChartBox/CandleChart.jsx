import React from 'react';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { Spinner } from 'react-bootstrap';
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

const CandleChart = (props) => {
  if (!props.chartData || props.chartData.length === 0) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  //const { width, height } = props;
  if (!props.chartData || props.chartData.length === 0) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => new Date(d.date));
  const height = props.height;
  const width = props.width;
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

  const calculatedData = elder(ema26(ema12(props.chartData || [])));
  const filteredData = calculatedData.filter(d => d.ema12 != null || d.ema26 != null);
  console.log("filter",filteredData)
  // const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(props.chartData);
  const { data, xScale, xAccessor, displayXAccessor } = ScaleProvider(filteredData);
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
        <YAxis showGridLines tickFormat={pricesDisplayFormat} fontSize={15} />
        <CandlestickSeries
          fill={(d) => (d.close > d.open ? '#3182F6' : '#FF626F')} // 양봉: 초록, 음봉: 빨강
          wickStroke={(d) => (d.close > d.open ? '#3182F6' : '#FF626F')} // 위아래 꼬리선 색상
        />
        {/* <LineSeries yAccessor={(d) => (d.ema26 !== null ? ema26.accessor()(d) : null)} strokeStyle={ema26.stroke()} /> */}
        <LineSeries yAccessor={(d) => (d.ema26 != null ? ema26.accessor()(d) : undefined)} strokeStyle={ema26.stroke()} />
        <CurrentCoordinate
          // yAccessor={(d) => (d.ema26 !== null ? ema26.accessor()(d) : null)}
          yAccessor={(d) => d && d.ema26 != null ? d.ema26 : undefined}
          fillStyle={ema26.stroke()}
        />
        {/* <LineSeries yAccessor={(d) => (d.ema12 !== null ? ema12.accessor()(d) : null)} strokeStyle={ema12.stroke()} /> */}
        <LineSeries yAccessor={(d) => (d.ema12 != null ? ema12.accessor()(d) : undefined)} strokeStyle={ema12.stroke()} />
        <CurrentCoordinate
          // yAccessor={(d) => (d.ema12 !== null ? ema12.accessor()(d) : null)}
          yAccessor={(d) => d && d.ema12 != null ? d.ema12 : undefined}
          fillStyle={ema12.stroke()}
        />
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
          origin={[8, 32]}
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
          fontSize={12}
        />

        <ZoomButtons />
        <OHLCTooltip origin={[8, 16]} fontSize={15} />
      </Chart>
      <Chart
        id={4}
        height={elderRayHeight}
        yExtents={[0, elder.accessor()]}
        origin={elderRayOrigin}
        padding={{ top: 8, bottom: 8 }}
      >
        <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" fontSize={15} />
        <YAxis ticks={4} tickFormat={pricesDisplayFormat} fontSize={15} />

        <MouseCoordinateX displayFormat={timeDisplayFormat} />
        <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} />

        <ElderRaySeries
          yAccessor={elder.accessor()}
          fillStyle={{
            bearPower: 'rgba(255, 98, 111, 0.7)',
            bullPower: 'rgba(49, 130, 246, 0.7)',
          }}
        />

        <SingleValueTooltip
          yAccessor={elder.accessor()}
          yLabel="Elder Ray"
          yDisplayFormat={(d) => `${pricesDisplayFormat(d.bullPower)}, ${pricesDisplayFormat(d.bearPower)}`}
          origin={[8, 16]}
          fontSize={15}
        />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default CandleChart;
