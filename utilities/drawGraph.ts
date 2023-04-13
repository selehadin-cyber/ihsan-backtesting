import * as d3 from "d3";
import { curveCardinal } from "d3";
import {
  Data,
  RsiBuyandSellPoints,
  Transaction,
} from "../components/LineChart";
import { SmaData } from "./calculateSMA";
import { responsivefy } from "./responsivefy";
let transaction = "sell";

const drawGraph = (
  transformedArray: Data[],
  rsiArray: { date: string; rsi: number }[],
  smaArray: SmaData[],
  ref: any,
  /* transaction: Transaction */
  rsiBuyandSellPoints: RsiBuyandSellPoints
) => {
  const h = 400;
  const w = 640;
  const p = 27;
  const svg = d3
    .select(ref.current)
    .attr("width", w)
    .attr("height", h)
    .call(responsivefy)
    .style("background", "white")
    .style("padding-inline", "4px")
    .style("margin-top", "4px");

  // Remove all child elements of the SVG
  svg.selectAll("*").remove();

  const xMin = d3.min(transformedArray, (d) => {
    return new Date(d.date);
  });

  const xMax = d3.max(transformedArray, (d) => {
    return new Date(d.date);
  });
  const yMin = 0;
  const yMax = d3.max(transformedArray, (d) => d.close);
  console.log("xmin", xMin);

  const xScale = d3
    .scaleTime()
    .domain([xMin, xMax] as Date[])
    .range([0 + p, w - p]);
  const yScale = d3
    .scaleLinear()
    .domain([0, yMax] as any[])
    .range([h - p, 0]);

  const yScale2 = d3
    .scaleLinear()
    .domain([0, d3.max(rsiArray, (d) => d.rsi)] as any[])
    .range([h - p, h / 2]);

  const line = d3
    .line()
    .x((d: any) => xScale(new Date(d.date)) as any)
    .y((d: any) => yScale(d.close))
    .curve(curveCardinal);

  const rsiLine = d3
    .line()
    .x((d: any) => xScale(new Date(d.date)) as any)
    .y((d: any) => yScale2(d.rsi))
    .curve(curveCardinal);

  const smaLine = d3
    .line()
    .x((d: any) => xScale(new Date(d.date)) as any)
    .y((d: any) => yScale(d.sma))
    .curve(curveCardinal);

  svg
    .append("path")
    .attr("d", line(transformedArray as any))
    .attr("fill", "none")
    .attr("stroke", "steelblue");

    svg
    .append("path")
    .attr("d", smaLine(smaArray as any))
    .attr("fill", "none")
    .attr("stroke", "green");
  
  svg
    .append("path")
    .attr("d", rsiLine(rsiArray as any))
    .attr("fill", "none")
    .attr("stroke", "red");

  // Create the x and y axes
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(d3.timeMonth.every(1))
    .tickFormat(d3.timeFormat("%b %Y") as any)
    .tickSizeOuter(0);
  const yAxis = d3.axisRight(yScale).ticks(h / 50);
  const yAxis2 = d3.axisRight(yScale2).ticks(h / 50);

  // Append the axes to the SVG
  d3.select(ref.current)
    .append("g")
    .attr("transform", `translate(0, ${h - p})`)
    .call(xAxis);

  d3.select(ref.current)
    .append("g")
    .attr("transform", `translate(${w - p}, 0)`)
    .call(yAxis2);

  d3.select(ref.current)
    .append("g")
    .attr("transform", `translate(${p},${-0})`)
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", w - p - p)
        .attr("stroke-opacity", 0.1)
    )
    .call((g) =>
      g
        .selectAll(".tick text")
        .attr("x", -20)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
    );

  rsiArray.forEach((d) => {
    if (d.rsi < rsiBuyandSellPoints.buy && transaction == "sell") {
      transaction = "buy";
      svg
        .append("circle")
        .attr("cx", xScale(new Date(d.date)) as any)
        .attr(
          "cy",
          yScale(transformedArray.find((e) => e.date === d.date)!.close)
        )
        .attr("r", 5)
        .style("fill", "green");
    } else if (d.rsi > rsiBuyandSellPoints.sell && transaction == "buy") {
      transaction = "sell";
      svg
        .append("circle")
        .attr("cx", xScale(new Date(d.date)) as any)
        .attr(
          "cy",
          yScale(transformedArray.find((e) => e.date === d.date)!.close)
        )
        .attr("r", 5)
        .style("fill", "red");
    }
  });

  const tooltip = svg
    .append("g")
    .attr("class", "tooltip")
    .style("display", "none");
  tooltip.append("circle").attr("r", 5).style("fill", "blue");
  tooltip.append("text").attr("x", 15).attr("dy", ".31em");
  tooltip.append("line").attr("id", "Yline").style("stroke", "steelblue");
  tooltip.append("line").attr("id", "Xline").style("stroke", "steelblue");
  svg
    .on("mouseover", () => tooltip.style("display", null))
    .on("mouseout", () => tooltip.style("display", "none"))
    .on("mousemove", function (event) {
      const bisectDate = d3.bisector((d: any) => new Date(d.date)).left;
      const x0 = xScale.invert(d3.pointer(event, this)[0]) as any;
      const i = bisectDate(transformedArray, x0, 1) as any;
      const d0 = transformedArray[i - 1] as any;
      const d1 = transformedArray[i] as any;
      if (d1) {
        const d =
          x0 - new Date(d0.date).valueOf() > new Date(d1.date).valueOf() - x0
            ? d1
            : d0;

        tooltip
          .select("text")
          .text(`${d.close}`)
          .attr("x", xScale(new Date(d.date)) + 5)
          .attr("y", yScale(d.close) - 5);
        tooltip
          .select("rect")
          .attr("x", xScale(new Date(d.date)))
          .attr("y", 0);
        tooltip
          .select("#Yline")
          .attr("y1", yScale(d.close))
          .attr("y2", yScale(d.close))
          .attr("x1", xScale(xMin as Date))
          .attr("x2", xScale(xMax as Date));
        tooltip
          .select("#Xline")
          .attr("y1", 0)
          .attr("y2", yMax as number)
          .attr("x1", xScale(new Date(d.date)))
          .attr("x2", xScale(new Date(d.date)));
        tooltip
          .select("circle")
          .attr("cx", xScale(new Date(d.date)))
          .attr("cy", yScale(d.close));
      }
    });
};

export default drawGraph;
