import * as d3 from "d3";
import {
  Data,
  RsiBuyandSellPoints
} from "../components/LineChart";
let transaction = "sell";

export function drawRSIEntryandExit(rsiArray: { date: string; rsi: number; }[], rsiBuyandSellPoints: RsiBuyandSellPoints, svg: d3.Selection<any, unknown, null, undefined>, xScale: d3.ScaleTime<number, number, never>, yScale: d3.ScaleLinear<number, number, never>, transformedArray: Data[]) {
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
}
