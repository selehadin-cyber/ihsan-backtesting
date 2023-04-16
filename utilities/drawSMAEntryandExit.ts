import * as d3 from "d3";
import { Data } from "../components/LineChart";
import { SmaData } from "./calculateSMA";


let transaction = "sell"

export function drawSMAEntryandExit(smaArray: SmaData[], transformedArray: Data[], svg: d3.Selection<any, unknown, null, undefined>, xScale: d3.ScaleTime<number, number, never>, yScale: d3.ScaleLinear<number, number, never>) {
  let previousDifference: number = 10000000;
  for (let i = 0; i < smaArray.length; i++) {
    let currentDifference = smaArray[i].sma -
      transformedArray.find((e) => e.date === smaArray[i].date)!.close;
    if (previousDifference > 0 && currentDifference < 0) {
      console.log("switch detected at", transformedArray.find((e) => e.date === smaArray[i].date)!.close);
      transaction = "buy";
      svg
        .append("circle")
        .attr("cx", xScale(new Date(smaArray[i].date)) as any)
        .attr(
          "cy",
          yScale(
            transformedArray.find((e) => e.date === smaArray[i].date)!.close
          )
        )
        .attr("r", 5)
        .style("fill", "green");

    } else if (previousDifference < 0 && currentDifference > 0) {
      console.log("switch (sell) detected at", transformedArray.find((e) => e.date === smaArray[i].date)!.close);
      transaction = "sell";
      svg
        .append("circle")
        .attr("cx", xScale(new Date(smaArray[i].date)) as any)
        .attr(
          "cy",
          yScale(
            transformedArray.find((e) => e.date === smaArray[i].date)!.close
          )
        )
        .attr("r", 5)
        .style("fill", "red");
    }
    //assign current difference as previous difference for the next loop
    previousDifference = currentDifference;
  }
}
