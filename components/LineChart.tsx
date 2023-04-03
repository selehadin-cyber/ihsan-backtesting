import React, { useRef, useEffect, useState, useMemo } from "react";
import tickers from "../tickers.json";
import { calculateRSI } from "../utilities/calculateRSI";
import drawGraph from "../utilities/drawGraph";

export interface Data {
  date: string;
  close: number;
}

interface Ticker {
  symbol: string;
  name: string;
}

interface RsiData {
  date: string;
  rsi: number;
}

export type Transaction = "buy" | "sell";
interface Transformed {
  date: string;
  close: number;
}

const LineChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [ticker, setTicker] = useState("AAPL");
  const [search, setSearch] = useState("");
  const [fetchedData, setFetchedData] = useState<string>();
  const [transformedArray, setTransformedArray] = useState<Transformed[]>([]);
  const [rsiArray, setRsiArray] = useState<RsiData[]>([]);
  const [capital, setCapital] = useState(100000);
  const [currentCapital, setCurrentCapital] = useState(0);
  const [maxDrowDown, setMaxDrowDown] = useState(0);
  let transaction = "sell" as Transaction;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const BuyOrSale = () => {
    if (transformedArray.length !== 0 && rsiArray.length !== 0) {
      let stockAtHand = 0;
      let lowestPoint: number = 1000000;
      let highestPoint = 0;
      let drawDown = 0;
      let maxDrawDown = maxDrowDown;
      for (let item of rsiArray) {
        if (transaction === "buy") {
          const price = transformedArray.find(
            (e) => e.date === item.date
          )!.close;

          if (price > highestPoint) {
            highestPoint = price;
          } else if (price < lowestPoint!) {
            lowestPoint = price;
          }
          console.log("highp", highestPoint, "lowp", lowestPoint!);
          let currentDrawDown =
            ((lowestPoint! - highestPoint) / highestPoint) * 100;
          console.log(currentDrawDown);
          drawDown = Math.min(drawDown, currentDrawDown); // update the current drawdown
          maxDrawDown = Math.min(maxDrawDown, currentDrawDown); // update the max drawdown
          setMaxDrowDown(maxDrawDown);
        }
        if (item.rsi < 35 && transaction === "sell") {
          transaction = "buy";
          const stockPrice = transformedArray.find(
            (e) => e.date === item.date
          )!.close;
          stockAtHand = capital / stockPrice;
          console.log("cap divided by price", capital / stockPrice);
          //setCapital(0); // Empty the capital
          setCurrentCapital(stockAtHand * stockPrice); // Update the capital with the bought stocks
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
           */ setCurrentCapital(stockAtHand * stockPrice); // Update the capital with the sold stocks
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
    const rsi = calculateRSI(transformedArray);
    setRsiArray(rsi)
  }, [transformedArray]);

  console.log("rsi", rsiArray);
  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    } as RequestInit;

    fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=ICV6WZMUWQ7GJRGV`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setFetchedData(result);
        const initial = JSON.parse(result)["Time Series (Daily)"];
        const newArray = [] as Data[];
        for (const [key, value] of Object.entries(initial)) {
          newArray.push({
            date: key,
            close: parseInt(initial[key]["4. close"]),
          });
        }
        setTransformedArray(newArray.reverse());
      })
      .catch((error) => console.log("error", error));
  }, [ticker]);



  useEffect(() => {
    if (transformedArray.length === 0 || rsiArray.length === 0) return;

    drawGraph(transformedArray, rsiArray, svgRef);
  }, [transformedArray, rsiArray]);

  const clickedOnSuggestion = (e: Ticker) => {
    setTicker(e.symbol);
    setSearch("");
  };

  return (
    <>
      <div className="container flex flex-row-reverse items-center justify-center">
        <div className="right">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div>
            {search
              ? tickers
                  .filter(
                    (e) => e.name.toLowerCase().indexOf(search.toLowerCase()) > -1
                  )
                  .map((e: Ticker) => (
                    <p onClick={() => clickedOnSuggestion(e)}>{e.name}</p>
                  ))
              : null}
          </div>
          <p>Initial balance {formatter.format(capital)}</p>
          <p>Current Balance {formatter.format(currentCapital)}</p>
          <p>Profit/Loss {formatter.format(currentCapital - capital)}</p>
          <p>Maximum Drawdown {maxDrowDown.toFixed(2)+"%"}</p>
          <button onClick={handleButtonClick}>run backtesting</button>
        </div>
        <div className="border border-black rounded-lg p-1">
          <svg ref={svgRef} />
        </div>
      </div>
      {/* <div>{JSON.stringify(transformedArray)}</div> */}
    </>
  );
};

export default LineChart;
