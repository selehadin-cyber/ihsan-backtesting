import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { curveCardinal } from "d3";

interface Data {
  date: string;
  close: number;
}

type Transaction = "buy" | "sell";
interface Transformed {
  date: string;
  close: number;
}

const LineChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [fetchedData, setFetchedData] = useState<string>();
  const [transformedArray, setTransformedArray] = useState<Transformed[]>([]);
  const [rsiArray, setRsiArray] = useState<any[]>([]);
  const [capital, setCapital] = useState(100000);
  /*   const [stockAtHand, setStockAtHand] = useState(0)
   */ let transaction = "sell" as Transaction;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const BuyOrSale = () => {
    if (transformedArray.length !== 0 && rsiArray.length !== 0) {
      let stockAtHand = 0;
      for (let item of rsiArray) {
        if (item.rsi < 30 && transaction === "sell") {
          transaction = "buy";
          const stockPrice = transformedArray.find(
            (e) => e.date === item.date
          )!.close;
          stockAtHand = capital / stockPrice;
          console.log("cap divided by price", capital / stockPrice);
          setCapital(0); // Empty the capital
          setCapital(stockAtHand * stockPrice); // Update the capital with the bought stocks
          console.log(
            "buy command",
            item.date,
            "at a price point of",
            stockPrice
          );
        } else if (item.rsi > 60 && transaction === "buy") {
          transaction = "sell";
          const stockPrice = transformedArray.find(
            (e) => e.date === item.date
          )!.close;
          /*           setCapital(0); // Empty the capital
           */ setCapital(stockAtHand * stockPrice); // Update the capital with the sold stocks
          console.log(
            "stocks available",
            stockAtHand,
            "capital",
            stockAtHand * stockPrice
          );
          console.log(
            "sell command",
            item.date,
            "at a price point of",
            stockPrice
          );
        }
      }
    }
  };

  const handleButtonClick = () => {
    BuyOrSale();
  };

  useEffect(() => {
    const calculateRSI = () => {
      const RSI_PERIOD = 14;
      const changes = [];
      let prevClose = null;

      transformedArray.forEach((item, i) => {
        if (i >= RSI_PERIOD) {
          const change = item.close - prevClose;
          changes.push(change);
        }
        prevClose = item.close;
      });

      let gainSum = 0;
      let lossSum = 0;

      for (let i = 0; i < RSI_PERIOD; i++) {
        const change = changes[i];
        if (change >= 0) {
          gainSum += change;
        } else {
          lossSum -= change;
        }
      }

      let prevAvgGain = gainSum / RSI_PERIOD;
      let prevAvgLoss = lossSum / RSI_PERIOD;

      const newRsiArray = [];

      transformedArray.slice(RSI_PERIOD).forEach((item, i) => {
        const change = changes[i];
        let avgGain = null;
        let avgLoss = null;

        if (change >= 0) {
          avgGain = (prevAvgGain * (RSI_PERIOD - 1) + change) / RSI_PERIOD;
          avgLoss = (prevAvgLoss * (RSI_PERIOD - 1)) / RSI_PERIOD;
        } else {
          avgGain = (prevAvgGain * (RSI_PERIOD - 1)) / RSI_PERIOD;
          avgLoss = (prevAvgLoss * (RSI_PERIOD - 1) - change) / RSI_PERIOD;
        }

        prevAvgGain = avgGain;
        prevAvgLoss = avgLoss;

        const rs = prevAvgGain / prevAvgLoss;
        const rsi = 100 - 100 / (1 + rs);

        newRsiArray.push({ date: item.date, rsi });
      });

      setRsiArray(newRsiArray);
    };
    calculateRSI();
  }, [transformedArray]);
  console.log("rsi", rsiArray);
  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    } as RequestInit;

    fetch(
      "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=AAPL&apikey=ICV6WZMUWQ7GJRGV",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setFetchedData(result);
        const initial = JSON.parse(result)["Time Series (Daily)"];
        const newArray = [] as any[];
        for (const [key, value] of Object.entries(initial)) {
          newArray.push({
            date: key,
            close: parseInt(initial[key]["4. close"]),
          });
        }
        setTransformedArray(newArray);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const drawGraph = (
    transformedArray: Data[],
    rsiArray: { date: string; rsi: number }[]
  ) => {
    const h = 400;
    const w = 640;
    const p = 27;
    const svg = d3
      .select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .style("background", "#d3d3d3")
      .style("margin-top", "50px");

    const xMin = d3.min(transformedArray, d => {
      return new Date(d.date);
    });

    const xMax = d3.max(transformedArray, d => {
      return new Date(d.date);
    });
    console.log("xmin", xMin)

    const xScale =d3.scaleTime()
      .domain([xMin, xMax])
      .range([0 + p, w - p]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(transformedArray, (d) => d.close + 20)])
      .range([h, 0]);

    const line = d3
      .line()
      .x((d: any) => xScale(new Date(d.date)) as any)
      .y((d: any) => yScale(d.close))
      .curve(curveCardinal);

    svg
      .append("path")
      .attr("d", line(transformedArray))
      .attr("fill", "none")
      .attr("stroke", "steelblue");

    // Create the x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Append the axes to the SVG
    d3.select(svgRef.current)
      .append("g")
      .attr("transform", `translate(0, ${h - p})`)
      .call(xAxis);

    d3.select(svgRef.current)
      .append("g")
      .attr('transform',`translate(${p},${-p})`)
      .call(yAxis);

    rsiArray.forEach((d) => {
      if (d.rsi < 30 && transaction == "sell") {
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

  useEffect(() => {
    if (transformedArray.length === 0 || rsiArray.length === 0) return;

    drawGraph(transformedArray, rsiArray);
  }, [transformedArray, rsiArray]);

  return (
    <>
      <p>total balance {formatter.format(capital)}</p>
      <button onClick={handleButtonClick}>run backtesting</button>
      <svg ref={svgRef} />
      <div>{JSON.stringify(transformedArray)}</div>
    </>
  );
};

export default LineChart;
