import React from "react";
import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import { useData } from "../Context/DataContext";
import useLocalStoragehook from "../hooks/useLocalstorage";

export default function Linegraph() {
  // const [data,setdata]=useState([20,25,30,40,99,90])
  const svgref = useRef();
  const { dataforline, fetchdata, setline } = useData();

  // const [data]=useState([20,25,30,40,99,90])
  // const [data2]=useState([22,25,35,45,99,95])

  const [selectedRelevance, setSelectedRelevance] = useState("All");
  const [selectedintensity, setSelectedintensity] = useState("All");

  useEffect(() => {
    if (!svgref.current) return;
    setTimeout(() => {
      drawline();
    }, 2000);
  }, [dataforline, selectedRelevance, selectedintensity]);

  async function drawline() {
    const filteredData = await dataforline.filter((entry) => {
      const date = entry.published;
      const intthreeshold =
        selectedintensity === "All" ? 100 : selectedintensity;
      const relthreeshold =
        selectedRelevance === "All" ? 100 : selectedRelevance;
      return (
        date >= Date.parse("2016-01-01") &&
        date <= Date.parse("2018-12-31") &&
        entry.intensity <= intthreeshold &&
        entry.relevance <= relthreeshold
      );
    });

    // console.log("here is the filtred data here ---");

    // console.log(filteredData)

    const width = 600;
    const height = 300;
    const svg = d3
      .select(svgref.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "none")
      .style("margin-top", "50")
      .style("margin-left", "50")
      .style("overflow", "visible");

    //Set up scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.published))
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(filteredData, (d) => Math.max(d.intensity, d.relevance)),
      ])
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => xScale(d.published))
      .y((d) => yScale(d.intensity));

    const line2 = d3
      .line()
      .x((d) => xScale(d.published))
      .y((d) => yScale(d.relevance));

    // Append the line to the SVG
    svg
      .append("path")
      .data([filteredData])
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "blue");

    svg
      .append("path")
      .data([filteredData])
      .attr("class", "line2")
      .attr("d", line2)
      .attr("fill", "none")
      .attr("stroke", "black");

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeMonth.every(3))
          .tickFormat(d3.timeFormat("%b %Y"))
      );

    // Append y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    //color bar

    const colorScale = d3
      .scaleOrdinal()
      .domain(["Intensity", "Relevance"])
      .range(["steelblue", "gray"]);

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 10}, 20)`);

    legend
      .selectAll("rect")
      .data(colorScale.domain())
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 80 + 10)
      .attr("y", 20)
      .attr("width", 20)
      .attr("height", 10)
      .style("margin-left", "50px")
      .style("fill", (d) => colorScale(d));

    legend
      .selectAll("text")
      .data(colorScale.domain())
      .enter()
      .append("text")
      .attr("x", (d, i) => i * 80 + 30)
      .attr("y", 30)
      .style("margin-right", "20px")
      .text((d) => d);
  }

  return (
    <>
      <div className="flex">
        <svg ref={svgref}></svg>

        <label
          for="Intensity"
          className="block mb-2 text-sm font-medium text-gray dark:text-white"
        >
          filter Intensity
        </label>
        <select
          onChange={(e) => setSelectedintensity(e.target.value)}
          id="intesityfilter"
          className="flex h-2 w-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected>Choose an Option</option>
          <option value="5">less than 5</option>
          <option value="5">less than 10</option>
          <option value="5">less than 50</option>
          <option value="5">Less than 70</option>
        </select>
        <label
          for="Intensity"
          className="block mb-2 text-sm font-medium text-gray dark:text-white"
        >
          filter Relevance
        </label>

        <select
          onChange={(e) => setSelectedRelevance(e.target.value)}
          id="relevancefilter"
          className="flex h-2 w-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected>Choose an Option</option>
          <option value="5">less than 5</option>
          <option value="5">less than 10</option>
          <option value="5">less than 50</option>
          <option value="5">Less than 70</option>
        </select>
      </div>
    </>
  );
}
