import * as d3 from "d3";
import { curveCardinal } from "d3";
import { Data, Transaction } from "../components/LineChart";
let transaction = "sell"

const drawGraph = (
    transformedArray: Data[],
    rsiArray: { date: string; rsi: number }[],
    ref: any,
    /* transaction: Transaction */
  ) => {
    const h = 400;
    const w = 640;
    const p = 27;
    const svg = d3
      .select(ref.current)
      .attr("width", w)
      .attr("height", h)
      .style("background", "white")
      .style("margin-top", "50px");

    // Remove all child elements of the SVG
    svg.selectAll("*").remove();

    const xMin = d3.min(transformedArray, (d) => {
      return new Date(d.date);
    });

    const xMax = d3.max(transformedArray, (d) => {
      return new Date(d.date);
    });
    console.log("xmin", xMin);

    const xScale = d3
      .scaleTime()
      .domain([xMin, xMax] as Date[])
      .range([0 + p, w - p]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(transformedArray, (d) => d.close)] as any[])
      .range([h, 0]);

    const yScale2 = d3
      .scaleLinear()
      .domain([0, d3.max(rsiArray, (d) => d.rsi)] as any[])
      .range([h, 0]);

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
    
    svg
      .append("path")
      .attr("d", line(transformedArray as any))
      .attr("fill", "none")
      .attr("stroke", "steelblue");

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
      if (d.rsi < 35 && transaction == "sell") {
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
      } else if (d.rsi > 60 && transaction == "buy") {
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
  };

  export default drawGraph