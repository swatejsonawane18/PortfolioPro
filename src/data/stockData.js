// Sample stock data - in production, this would come from an API
// Format: [timestamp, open, high, low, close, volume]

function generateStockData(symbol, startPrice, volatility = 0.02, trend = 0.0001) {
  const data = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date();
  const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  let price = startPrice;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const open = price;
    const change = (Math.random() - 0.5) * volatility * price + trend * price;
    const close = Math.max(0.01, price + change);
    
    const dayRange = Math.random() * 0.05 * price;
    const high = Math.max(open, close) + dayRange * Math.random();
    const low = Math.min(open, close) - dayRange * Math.random();
    
    const volume = Math.floor(Math.random() * 50000000 + 10000000);
    
    data.push([
      date.getTime(),
      parseFloat(open.toFixed(2)),
      parseFloat(high.toFixed(2)),
      parseFloat(low.toFixed(2)),
      parseFloat(close.toFixed(2)),
      volume
    ]);
    
    price = close;
  }
  
  return data;
}

export const stockData = {
  AAPL: generateStockData('AAPL', 150, 0.025, 0.0002),
  GOOGL: generateStockData('GOOGL', 2800, 0.03, 0.0001),
  MSFT: generateStockData('MSFT', 300, 0.02, 0.0003),
  TSLA: generateStockData('TSLA', 200, 0.05, -0.0001)
};