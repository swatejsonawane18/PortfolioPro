export function calculateSMA(data, period) {
  const smaData = [];
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j][4]; // Close price
    }
    const average = sum / period;
    smaData.push([data[i][0], average]); // [timestamp, sma_value]
  }
  
  return smaData;
}