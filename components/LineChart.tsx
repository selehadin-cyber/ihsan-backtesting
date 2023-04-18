import React, { useRef, useEffect, useState, useMemo } from "react";
import Slider from "@mui/material/Slider";
import tickers from "../tickers.json";
import { calculateRSI } from "../utilities/calculateRSI";
import drawGraph from "../utilities/drawGraph";
import controlsSection from "./ControlsSection";
import { SmaData, calculateSMA } from "../utilities/calculateSMA";
import TransactionsList from "./transactionsList";

export interface Data {
  date: string;
  close: number;
}
export interface Transactions {
  stock: string;
  date: string;
  quantity: number;
  type: string;
  price: number;
  balance: number;
}
export interface Ticker {
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

export interface RsiBuyandSellPoints {
  buy: number;
  sell: number;
}

const LineChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [ticker, setTicker] = useState("AAPL");
  const [search, setSearch] = useState("");
  const [fetchedData, setFetchedData] = useState<string>();
  const [transformedArray, setTransformedArray] = useState<Transformed[]>([]);
  const [rsiArray, setRsiArray] = useState<RsiData[]>([]);
  const [smaArray, setSmaArray] = useState<SmaData[]>([]);
  const [strategy, setStrategy] = useState<"SMA" | "RSI">("SMA");
  const [capital, setCapital] = useState(100000);
  const [balance, setBalance] = useState(100000);
  const [transactionsList, setTransactionsList] = useState<Transactions[]>([]);
  const [maxDrowDown, setMaxDrowDown] = useState(0);
  const [rsiBuyandSellPoints, setRsiBuyandSellPoints] =
    useState<RsiBuyandSellPoints>({ buy: 30, sell: 70 });

  const handleChange = (event: Event, newValue: number[]) => {
    setRsiBuyandSellPoints({
      buy: newValue[0],
      sell: newValue[1],
    } as RsiBuyandSellPoints);
  };

  const handleStrategy = (event: any) => {
    setStrategy(event.target!.value);
  };

  console.log(rsiBuyandSellPoints);

  let transaction = "sell" as Transaction;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const BuyOrSaleSMA = () => {
    if (transformedArray.length !== 0 && smaArray.length !== 0) {
      let stockAtHand = 0;
      let lowestPoint: number = 1000000;
      let highestPoint = 0;
      let drawDown = 0;
      let maxDrawDown = maxDrowDown;
      let previousDifference: number = 10000000;
      let localbalance: number = balance; // <-- initialize with current balance

      for (let item of smaArray) {
        // calculate drawdown
        const price = transformedArray.find((e) => e.date === item.date)!.close;

        if (stockAtHand > 0) {
          if (price > highestPoint) {
            highestPoint = price;
          } else if (price < lowestPoint!) {
            lowestPoint = price;
          }
          let currentDrawDown =
            ((lowestPoint! - highestPoint) / highestPoint) * 100;
          drawDown = Math.min(drawDown, currentDrawDown); // update the current drawdown
          maxDrawDown = Math.min(maxDrawDown, currentDrawDown); // update the max drawdown
          setMaxDrowDown(maxDrawDown);
        }

        // start trading
        let currentDifference =
          item.sma - transformedArray.find((e) => e.date === item.date)!.close;
        if (
          previousDifference > 0 &&
          currentDifference < 0 &&
          stockAtHand === 0
        ) {
          // buy stock
          console.log(
            "switch detected at",
            transformedArray.find((e) => e.date === item.date)!.close
          );
          stockAtHand = localbalance / price;
          setTransactionsList((e) =>
            e.concat({
              stock: ticker,
              date: item.date,
              quantity: stockAtHand,
              type: "buy",
              price: transformedArray.find((e) => e.date === item.date)!.close,
              balance: localbalance,
            })
          );

          localbalance = 0;
          console.log("balance divided by price", localbalance / price);
          setBalance(stockAtHand * price); // Update the capital with the bought stocks
          console.log("buy command", item.date, "at a price point of", price);
          console.log(
            "current balance(after buy)",
            stockAtHand * price,
            "aka",
            balance
          );
        } else if (
          previousDifference < 0 &&
          currentDifference > 0 &&
          stockAtHand > 0
        ) {
          // sell stock
          console.log(
            "switch (sell) detected at",
            transformedArray.find((e) => e.date === item.date)!.close
          );
          localbalance = stockAtHand * price;
          stockAtHand = 0;
          setTransactionsList((e) =>
            e.concat({
              stock: ticker,
              date: item.date,
              quantity: stockAtHand,
              type: "sell",
              price: transformedArray.find((e) => e.date === item.date)!.close,
              balance: localbalance,
            })
          );
          setBalance(localbalance); // Update the capital with the sold stocks
          console.log("sell command", item.date, "at a price point of", price);
          console.log(
            "current balance(after sell)",
            localbalance,
            "aka",
            balance
          );
        }
        previousDifference = currentDifference;
      }
    }
  };

  const BuyOrSaleRSI = () => {
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
          let currentDrawDown =
            ((lowestPoint! - highestPoint) / highestPoint) * 100;
          console.log(currentDrawDown);
          drawDown = Math.min(drawDown, currentDrawDown); // update the current drawdown
          maxDrawDown = Math.min(maxDrawDown, currentDrawDown); // update the max drawdown
          setMaxDrowDown(maxDrawDown);
        }
        if (item.rsi < rsiBuyandSellPoints.buy && transaction === "sell") {
          transaction = "buy";
          const stockPrice = transformedArray.find(
            (e) => e.date === item.date
          )!.close;
          stockAtHand = capital / stockPrice;
          console.log("cap divided by price", capital / stockPrice);
          //setCapital(0); // Empty the capital
          setBalance(stockAtHand * stockPrice); // Update the capital with the bought stocks
          console.log(
            "buy command",
            item.date,
            "at a price point of",
            stockPrice
          );
        } else if (
          item.rsi > rsiBuyandSellPoints.sell &&
          transaction === "buy"
        ) {
          transaction = "sell";
          const stockPrice = transformedArray.find(
            (e) => e.date === item.date
          )!.close;
          /*           setCapital(0); // Empty the capital
           */ setBalance(stockAtHand * stockPrice); // Update the capital with the sold stocks
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
    if (strategy === "RSI") {
      BuyOrSaleRSI();
    } else {
      BuyOrSaleSMA();
    }
  };

  useEffect(() => {
    const rsi = calculateRSI(transformedArray);
    setRsiArray(rsi);
  }, [transformedArray]);

  useEffect(() => {
    const sma = calculateSMA(transformedArray);
    setSmaArray(sma);
    console.log("smaData", smaArray);
  }, [transformedArray]);

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

    drawGraph(
      transformedArray,
      rsiArray,
      smaArray,
      svgRef,
      rsiBuyandSellPoints,
      strategy
    );
  }, [transformedArray, rsiArray, rsiBuyandSellPoints, strategy]);

  const clickedOnSuggestion = (e: Ticker) => {
    setTicker(e.symbol);
    setSearch("");
  };

  return (
    <>
      <div className=" flex-col-reverse flex lg:flex-row-reverse sm:flex-col-reverse h-fit items-stretch justify-stretch gap-3">
        {controlsSection(
          search,
          setSearch,
          clickedOnSuggestion,
          capital,
          setCapital,
          formatter,
          balance,
          maxDrowDown,
          handleButtonClick,
          rsiBuyandSellPoints,
          handleChange,
          strategy,
          setStrategy,
          handleStrategy
        )}
        <div className="border max-w-[100vw] w-full rounded-lg p-1.5 shadow-xl">
          <div>
            <svg ref={svgRef} />
          </div>
        </div>
      </div>
      <TransactionsList transactionsList={transactionsList} />
      {/* <div>{JSON.stringify(transformedArray)}</div> */}
    </>
  );
};

export default LineChart;
