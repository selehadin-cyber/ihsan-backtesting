export interface TransformedData {
  date: string;
  close: number;
}

export interface RsiData {
  date: string;
  rsi: number;
}

export function calculateRSI(transformedArray: TransformedData[]): RsiData[] {
  const RSI_PERIOD = 14;
  const changes: number[] = [];
  let prevClose: number | null = null;

  transformedArray.forEach((item, i) => {
    if (i >= RSI_PERIOD) {
      const change = item.close - prevClose!;
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

  const rsiData: RsiData[] = [];

  transformedArray.slice(RSI_PERIOD).forEach((item, i) => {
    const change = changes[i];
    let avgGain: number | null = null;
    let avgLoss: number | null = null;

    if (change >= 0) {
      avgGain = (prevAvgGain * (RSI_PERIOD - 1) + change) / RSI_PERIOD;
      avgLoss = (prevAvgLoss * (RSI_PERIOD - 1)) / RSI_PERIOD;
    } else {
      avgGain = (prevAvgGain * (RSI_PERIOD - 1)) / RSI_PERIOD;
      avgLoss = (prevAvgLoss * (RSI_PERIOD - 1) - change) / RSI_PERIOD;
    }

    const rs = avgGain! / avgLoss!;
    const rsi = 100 - 100 / (1 + rs);

    rsiData.push({ date: item.date, rsi });

    prevAvgGain = avgGain;
    prevAvgLoss = avgLoss;
  });

  return rsiData;
}
