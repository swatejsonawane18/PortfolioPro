<script>
  let holdings = [
    {
      symbol: "AAPL",
      name: "Apple Inc",
      shares: 50,
      avgPrice: 175.3,
      currentPrice: 189.45,
      sector: "Technology",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp",
      shares: 25,
      avgPrice: 380.5,
      currentPrice: 412.78,
      sector: "Technology",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc",
      shares: 15,
      avgPrice: 2650.0,
      currentPrice: 2789.3,
      sector: "Technology",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc",
      shares: 20,
      avgPrice: 245.8,
      currentPrice: 234.56,
      sector: "Automotive",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp",
      shares: 10,
      avgPrice: 820.0,
      currentPrice: 875.43,
      sector: "Technology",
    },
  ];

  $: totalValue = holdings.reduce(
    (sum, holding) => sum + holding.shares * holding.currentPrice,
    0
  );
  $: totalCost = holdings.reduce(
    (sum, holding) => sum + holding.shares * holding.avgPrice,
    0
  );
  $: totalGainLoss = totalValue - totalCost;
  $: totalGainLossPercent = ((totalValue - totalCost) / totalCost) * 100;

  function getGainLoss(holding) {
    const currentValue = holding.shares * holding.currentPrice;
    const costBasis = holding.shares * holding.avgPrice;
    return currentValue - costBasis;
  }

  function getGainLossPercent(holding) {
    const gainLoss = getGainLoss(holding);
    const costBasis = holding.shares * holding.avgPrice;
    return (gainLoss / costBasis) * 100;
  }

  function getSectorAllocation() {
    const sectorTotals = {};
    holdings.forEach((holding) => {
      const value = holding.shares * holding.currentPrice;
      sectorTotals[holding.sector] =
        (sectorTotals[holding.sector] || 0) + value;
    });

    return Object.entries(sectorTotals).map(([sector, value]) => ({
      sector,
      value,
      percentage: (value / totalValue) * 100,
    }));
  }

  $: sectorAllocation = getSectorAllocation();
</script>

<div class="portfolio-container">
  <div class="portfolio-header">
    <h2>My Portfolio</h2>
    <div class="portfolio-summary">
      <div class="summary-item">
        <span class="label">Total Value</span>
        <span class="value">${totalValue.toLocaleString()}</span>
      </div>
      <div class="summary-item">
        <span class="label">Total Gain/Loss</span>
        <span
          class="value"
          class:positive={totalGainLoss > 0}
          class:negative={totalGainLoss < 0}
        >
          {totalGainLoss > 0 ? "+" : ""}${Math.abs(
            totalGainLoss
          ).toLocaleString()}
          ({totalGainLossPercent > 0 ? "+" : ""}{totalGainLossPercent.toFixed(
            2
          )}%)
        </span>
      </div>
    </div>
  </div>

  <div class="portfolio-content">
    <div class="holdings-section">
      <h3>Holdings</h3>
      <div class="holdings-table">
        <div class="table-header">
          <span>Symbol</span>
          <span>Shares</span>
          <span>Avg Price</span>
          <span>Current Price</span>
          <span>Market Value</span>
          <span>Gain/Loss</span>
        </div>
        {#each holdings as holding}
          <div class="table-row">
            <div class="stock-cell">
              <span class="symbol">{holding.symbol}</span>
              <span class="name">{holding.name}</span>
            </div>
            <span class="shares">{holding.shares}</span>
            <span class="avg-price">${holding.avgPrice.toFixed(2)}</span>
            <span class="current-price">${holding.currentPrice.toFixed(2)}</span
            >
            <span class="market-value"
              >${(holding.shares * holding.currentPrice).toLocaleString()}</span
            >
            <div
              class="gain-loss"
              class:positive={getGainLoss(holding) > 0}
              class:negative={getGainLoss(holding) < 0}
            >
              <span class="amount">
                {getGainLoss(holding) > 0 ? "+" : ""}${Math.abs(
                  getGainLoss(holding)
                ).toLocaleString()}
              </span>
              <span class="percent">
                ({getGainLossPercent(holding) > 0
                  ? "+"
                  : ""}{getGainLossPercent(holding).toFixed(2)}%)
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="allocation-section">
      <h3>Sector Allocation</h3>
      <div class="allocation-chart">
        {#each sectorAllocation as sector}
          <div class="sector-item">
            <div class="sector-info">
              <span class="sector-name">{sector.sector}</span>
              <span class="sector-value">${sector.value.toLocaleString()}</span>
            </div>
            <div class="sector-bar">
              <div class="bar-fill" style="width: {sector.percentage}%"></div>
            </div>
            <span class="sector-percent">{sector.percentage.toFixed(1)}%</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .portfolio-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-width: 100%;
  }

  .portfolio-header {
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .portfolio-header h2 {
    margin: 0 0 1rem 0;
    font-size: 2rem;
    font-weight: 600;
  }

  .portfolio-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .positive {
    color: #05f368;
  }

  .negative {
    color: #e74c3c;
  }

  .portfolio-content {
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .holdings-section h3,
  .allocation-section h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
    font-size: 1.25rem;
  }

  .holdings-table {
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1.5fr;
    gap: 1rem;
    padding: 1rem;
    align-items: center;
  }

  .table-header {
    background: #e9ecef;
    font-weight: 600;
    color: #495057;
    font-size: 0.9rem;
  }

  .table-row {
    border-bottom: 1px solid #dee2e6;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .stock-cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .symbol {
    font-weight: 700;
    color: #2c3e50;
  }

  .name {
    font-size: 0.85rem;
    color: #7f8c8d;
  }

  .gain-loss {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-weight: 600;
  }

  .allocation-chart {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .sector-item {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .sector-item:last-child {
    margin-bottom: 0;
  }

  .sector-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .sector-name {
    font-weight: 600;
    color: #2c3e50;
  }

  .sector-value {
    font-size: 0.85rem;
    color: #7f8c8d;
  }

  .sector-bar {
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #2980b9);
    transition: width 0.3s ease;
  }

  .sector-percent {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  }

  /* ========== RESPONSIVE ADJUSTMENTS ========== */

  @media (max-width: 1024px) {
    .table-header,
    .table-row {
      grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
    }

    .portfolio-summary {
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .portfolio-header h2 {
      font-size: 1.5rem;
    }

    .portfolio-summary {
      flex-direction: column;
      gap: 1rem;
    }

    .portfolio-content {
      grid-template-columns: 1fr;
    }

    .table-header {
      display: none;
    }

    .table-row {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
    }

    .stock-cell {
      flex-direction: row;
      justify-content: space-between;
    }

    .gain-loss {
      flex-direction: row;
      justify-content: space-between;
    }

    .sector-item {
      grid-template-columns: 1fr;
      text-align: left;
    }

    .sector-bar {
      margin: 0.5rem 0;
    }
  }
</style>
