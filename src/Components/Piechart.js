import React from "react";
import { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { useData } from "../Context/DataContext";

export default function Piechart() {
  const { sectorCounts, dataforpie, getcountforpie } = useData();

  const svgRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      makepiechrt();
      createLegend();
    }, 2000);
  }, [dataforpie]);

  function makepiechrt() {
    const width = 400;
    const height = 150;
    const radius = 150 / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "#d3d3d3")
      .style("margin-top", "50px")
      .style("margin-left", "10px")
      .style("overflow", "visible")
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie()
      .value((d) => d.count)
      .padAngle(0);

    const path = d3.arc().outerRadius(radius).innerRadius(0);

    const arc = svg.selectAll("arc").data(pie(dataforpie)).enter().append("g");

    arc
      .append("path")
      .attr("d", path)
      .attr("fill", (d, i) => color(i));
  }

  function createLegend() {
    const width = 100;
    const height = 100;

    const legend = d3
      .select(svgRef.current)
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0, 20)`)
      .attr("width", width)
      .attr("height", height)
      .style("margin-right", "10px");

    const legendRectSize = 10;
    const legendSpacing = 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const sectors = dataforpie.map((d) => d.sector);

    const legendItems = legend
      .selectAll(".legend-item")
      .data(sectors)
      .enter()
      .append("g");

    legendItems
      .append("rect")
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .attr("y", (d, i) => i * (legendRectSize + legendSpacing))
      .style("fill", (d, i) => color(i))
      .style("stroke", (d, i) => color(i));

    legendItems
      .append("text")
      .attr("x", legendRectSize + legendSpacing)
      .attr("y", (d, i) => i * (legendRectSize + legendSpacing))
      .text((d) => d)
      .style("font-size", 10)
      .style("fill", "#333")
      .style("margin-right", "10px")
      .attr("alignment-baseline", "middle")
      .style("fill", "#333")
      .attr("dy", "0.8em")
      .style("font-size", 5);
  }

  return (
    <>
      <svg ref={svgRef}></svg>

      {/* <PieChart  data={xyz} outerRadius={200} innerRadius={200}/>? */}
    </>
  );
}
