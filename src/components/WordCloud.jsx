import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const SimpleWordCloud = ({ data, width, height }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const fontSizeScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.weight), d3.max(data, (d) => d.weight)])
      .range([14, 80]);

    // Custom color palette for vibrant but not fluorescent colors
    const colorPalette = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Sky Blue
      '#FFA07A', // Light Salmon
      '#98D8C8', // Mint
      '#F7DC6F', // Yellow
      '#BB8FCE', // Light Purple
      '#82E0AA', // Light Green
    ];

    const colorScale = d3.scaleOrdinal(colorPalette);

    const layout = cloud()
      .size([width, height])
      .words(data.map((d) => ({ text: d.keyword, size: fontSizeScale(d.weight) })))
      .padding(5)
      .rotate(() => 0) // Set rotation to 0 for better readability of Korean text
      .font('Noto Sans KR')
      .fontSize((d) => d.size)
      .on('end', (words) => {
        svg
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`)
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', (d) => `${d.size}px`)
          .style('font-weight', 'bold')
          .style('font-family', 'Noto Sans KR, sans-serif')
          .style('fill', (d, i) => colorScale(i))
          .attr('text-anchor', 'middle')
          .attr('transform', (d) => `translate(${d.x},${d.y})`)
          .text((d) => d.text);
      });

    layout.start();
  }, [data, width, height]);

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-100">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default SimpleWordCloud;
