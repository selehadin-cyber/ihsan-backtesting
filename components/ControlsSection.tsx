import { Slider } from "@mui/material";
import tickers from "../tickers.json";
import { RsiBuyandSellPoints, Ticker } from "./LineChart";

export default function ControlsSection(
  search: string,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  clickedOnSuggestion: (e: Ticker) => void,
  capital: number,
  setCapital: React.Dispatch<React.SetStateAction<number>>,
  formatter: Intl.NumberFormat,
  balance: number,
  maxDrowDown: number,
  handleButtonClick: () => void,
  rsiBuyandSellPoints: RsiBuyandSellPoints,
  handleChange: (event: Event, newValue: number[]) => void,
  strategy: "SMA" | "RSI",
  setStrategy: React.Dispatch<React.SetStateAction<"SMA" | "RSI">>,
  handleStrategy: (event: any) => void
)
  
{
  
  console.log(strategy)
  return (
    <div className="right flex flex-col justify-self-stretch w-full lg:w-1/3 sm:w-full border rounded-lg shadow-xl p-3 my-[29px] lg:my-0 dark:text-white gap-3">
      <div className="searchBar relative">
        <h1>Search a Stock</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mr-3 pl-5 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
        {search !== "" ? (
          <div className="h-32 overflow-scroll absolute bg-white">
            {tickers
              .filter(
                (e) => e.name.toLowerCase().indexOf(search.toLowerCase()) > -1
              )
              .map((e: Ticker) => (
                <p
                  className="px-3 text-black text-start max-w-[200px] border-b border-black"
                  onClick={() => clickedOnSuggestion(e)}
                >
                  {e.name.length > 22 ? e.name.substring(0,20) + "..." : e.name}
                </p>
              ))}
          </div>
        ) : null}
      </div>
      <div className="strategy">
        <h2>Choose a strategy</h2>
        <label
          htmlFor="strategies"
          className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an option
        </label>
        <select
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={handleStrategy}
        >
          <option selected>Choose a stategy</option>
          <option value="SMA">SMA Intersection</option>
          <option value="RSI">RSI Range</option>
        </select>
      </div>
      <div className="capital">
        <h2>Inital investment capital</h2>
        <input
          type="number"
          name="capital"
          id="capital"
          value={capital}
          onChange={(e) => setCapital(parseInt(e.target.value))}
          className="w-full p-2 mr-3 pl-5 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex flex-col items-start">
        <p>Initial balance {formatter.format(capital)}</p>
        <p>Current Balance {formatter.format(balance)}</p>
        <p>Profit/Loss {formatter.format(balance - capital)}</p>
        <p>Maximum Drawdown {maxDrowDown.toFixed(2) + "%"}</p>
      </div>
      {strategy === "RSI" ? (
        <>
        <p>Rsi Buy and Sell Points</p>
        <label
          htmlFor="medium-range"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Default range
        </label>
        <Slider
          getAriaLabel={() => "Temperature range"}
          value={[rsiBuyandSellPoints.buy, rsiBuyandSellPoints.sell]}
          onChange={handleChange as any}
          valueLabelDisplay="auto"
        />
        </>
      ) : null}
      
      <button
        onClick={handleButtonClick}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 my-2 "
      >
        Run Backtesting
      </button>
    </div>
  );
}
