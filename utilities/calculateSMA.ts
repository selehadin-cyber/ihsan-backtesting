export interface TransformedData {
  date: string;
  close: number;
}

export interface SmaData {
  date: string;
  sma: number;
}

export function calculateSMA(transformedArray: TransformedData[]): SmaData[] {
  const SmaPeriod = 20;
  let smaSum = 0;
  let smaData: SmaData[] = [];

  for (let i = 0; i < transformedArray.length; i++) {
    smaSum += transformedArray[i].close;

    if (i >= SmaPeriod - 1) {
      const smaValue = smaSum / SmaPeriod;
      const smaDate = transformedArray[i].date;
      smaData.push({ date: smaDate, sma: smaValue });

      smaSum -= transformedArray[i - SmaPeriod + 1].close;
    }
  }

  return smaData;
}
