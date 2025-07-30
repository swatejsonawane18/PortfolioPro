<script>
  import { onMount } from 'svelte';

  let marketData = [
    { symbol: 'SPY', name: 'S&P 500 ETF', price: 445.67, change: 2.34, changePercent: 0.53 },
    { symbol: 'QQQ', name: 'NASDAQ 100 ETF', price: 378.92, change: -1.45, changePercent: -0.38 },
    { symbol: 'DIA', name: 'Dow Jones ETF', price: 356.78, change: 0.89, changePercent: 0.25 },
    { symbol: 'VTI', name: 'Total Stock Market', price: 234.56, change: 1.23, changePercent: 0.53 }
  ];

  let topMovers = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.43, change: 45.67, changePercent: 5.51 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 234.56, change: -12.34, changePercent: -5.00 },
    { symbol: 'AAPL', name: 'Apple Inc', price: 189.45, change: 3.21, changePercent: 1.72 },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 412.78, change: -2.45, changePercent: -0.59 }
  ];

  let marketStats = {
    totalValue: 125430.67,
    dayChange: 2340.45,
    dayChangePercent: 1.90
  };
</script>

<div class="market-overview">
  <div class="overview-header">
    <h2>Market Overview</h2>
    <div class="market-time">
      <span class="status live">● LIVE</span>
      <span class="time">Market Open • EST 9:30 AM - 4:00 PM</span>
    </div>
  </div>

  <div class="market-grid">
    <div class="market-indices">
      <h3>Major Indices</h3>
      <div class="indices-grid">
        {#each marketData as index}
          <div class="index-card">
            <div class="index-header">
              <span class="symbol">{index.symbol}</span>
              <span class="name">{index.name}</span>
            </div>
            <div class="index-price">${index.price.toFixed(2)}</div>
            <div class="index-change" class:positive={index.change > 0} class:negative={index.change < 0}>
              {index.change > 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent > 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="portfolio-summary">
      <h3>Portfolio Summary</h3>
      <div class="summary-card">
        <div class="total-value">
          <span class="label">Total Portfolio Value</span>
          <span class="value">${marketStats.totalValue.toLocaleString()}</span>
        </div>
        <div class="day-change" class:positive={marketStats.dayChange > 0} class:negative={marketStats.dayChange < 0}>
          <span class="change-amount">
            {marketStats.dayChange > 0 ? '+' : ''}${Math.abs(marketStats.dayChange).toLocaleString()}
          </span>
          <span class="change-percent">
            ({marketStats.dayChangePercent > 0 ? '+' : ''}{marketStats.dayChangePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="top-movers">
    <h3>Top Movers</h3>
    <div class="movers-grid">
      {#each topMovers as stock}
        <div class="mover-card">
          <div class="stock-info">
            <span class="symbol">{stock.symbol}</span>
            <span class="name">{stock.name}</span>
          </div>
          <div class="stock-price">${stock.price.toFixed(2)}</div>
          <div class="stock-change" class:positive={stock.change > 0} class:negative={stock.change < 0}>
            {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .market-overview {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .overview-header {
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .overview-header h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .market-time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .status.live {
    color: #2ecc71;
    font-weight: 600;
  }

  .time {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .market-grid {
    padding: 2rem;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }

  .indices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .index-card, .summary-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    border-left: 4px solid #3498db;
  }

  .index-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .symbol {
    font-weight: 700;
    font-size: 1.1rem;
    color: #2c3e50;
  }

  .name {
    font-size: 0.85rem;
    color: #7f8c8d;
  }

  .index-price, .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .index-change, .day-change {
    font-weight: 600;
  }

  .positive {
    color: #27ae60;
  }

  .negative {
    color: #e74c3c;
  }

  .portfolio-summary h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  .total-value {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .label {
    font-size: 0.9rem;
    color: #7f8c8d;
  }

  .top-movers {
    padding: 0 2rem 2rem;
  }

  .top-movers h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  .movers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .mover-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stock-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stock-price {
    font-weight: 700;
    color: #2c3e50;
  }

  @media (max-width: 768px) {
    .market-grid {
      grid-template-columns: 1fr;
    }

    .overview-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .indices-grid {
      grid-template-columns: 1fr;
    }
  }
</style>