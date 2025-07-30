<script>
  import { onMount } from "svelte";
  import Highcharts from "highcharts/highstock";
  import { stockData } from "../data/stockData.js";
  import { calculateSMA } from "../utils/indicators.js";

  let chartContainer;
  let chart;
  let selectedStock = "AAPL";
  let selectedPeriod = "1Y";
  let customStartDate = "";
  let customEndDate = "";
  let useCustomDates = false;

  // Comparison feature
  let compareMode = false;
  let compareStock = "MSFT";
  let compareStocks = [];

  // Alerts feature
  let showAlerts = false;
  let alerts = [
    { symbol: "AAPL", type: "above", price: 200, active: true },
    { symbol: "TSLA", type: "below", price: 220, active: true },
  ];
  let newAlert = { symbol: "AAPL", type: "above", price: 0 };

  // Save feature
  let savedCharts = JSON.parse(localStorage.getItem("savedCharts") || "[]");
  let showSaveDialog = false;
  let chartName = "";

  // SMA settings
  let smaSettings = {
    20: { enabled: false, color: "#2196F3" },
    50: { enabled: true, color: "#4CAF50" },
    100: { enabled: false, color: "#FF9800" },
    200: { enabled: false, color: "#9C27B0" },
  };

  // Current price display
  let currentPrices = {
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    date: "",
  };

  const periods = {
    "1M": 30,
    "3M": 90,
    "6M": 180,
    "1Y": 365,
    "2Y": 730,
    "5Y": 1825,
  };

  function getFilteredData() {
    const data = stockData[selectedStock];
    if (!data) return [];

    let filteredData = [...data];

    if (useCustomDates && customStartDate && customEndDate) {
      const startTime = new Date(customStartDate).getTime();
      const endTime = new Date(customEndDate).getTime();
      filteredData = data.filter(
        (point) => point[0] >= startTime && point[0] <= endTime
      );
    } else if (periods[selectedPeriod]) {
      const daysBack = periods[selectedPeriod];
      const cutoffTime = Date.now() - daysBack * 24 * 60 * 60 * 1000;
      filteredData = data.filter((point) => point[0] >= cutoffTime);
    }

    return filteredData;
  }

  function createChart() {
    if (!chartContainer) return;

    const data = getFilteredData();
    const ohlcData = data.map((point) => [
      point[0],
      point[1],
      point[2],
      point[3],
      point[4],
    ]);
    const volumeData = data.map((point) => [point[0], point[5]]);

    const series = [
      {
        type: "candlestick",
        name: selectedStock,
        data: ohlcData,
        color: "#f44336",
        upColor: "#4caf50",
        lineColor: "#f44336",
        upLineColor: "#4caf50",
      },
      {
        type: "column",
        name: "Volume",
        data: volumeData,
        yAxis: 1,
        color: "rgba(0,0,0,0.3)",
      },
    ];

    // Add comparison stocks
    compareStocks.forEach((compareSymbol, index) => {
      const compareData = stockData[compareSymbol];
      if (compareData) {
        const filteredCompareData = compareData.filter((point) => {
          return data.some(
            (mainPoint) =>
              Math.abs(mainPoint[0] - point[0]) < 24 * 60 * 60 * 1000
          );
        });

        const compareCloseData = filteredCompareData.map((point) => [
          point[0],
          point[4],
        ]);
        const colors = ["#FF5722", "#9C27B0", "#607D8B", "#795548"];

        series.push({
          type: "line",
          name: compareSymbol,
          data: compareCloseData,
          color: colors[index % colors.length],
          lineWidth: 2,
        });
      }
    });

    // Add SMA series
    Object.entries(smaSettings).forEach(([period, settings]) => {
      if (settings.enabled) {
        const smaData = calculateSMA(data, parseInt(period));
        series.push({
          type: "line",
          name: `SMA(${period})`,
          data: smaData,
          color: settings.color,
          lineWidth: 2,
        });
      }
    });

    chart = Highcharts.stockChart(chartContainer, {
      chart: {
        height: 600,
        backgroundColor: "#ffffff",
      },
      title: {
        text: `${selectedStock} Stock Price${compareStocks.length > 0 ? " vs " + compareStocks.join(", ") : ""}`,
      },
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      xAxis: {
        type: "datetime",
      },
      yAxis: [
        {
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: "Price",
          },
          height: "70%",
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: "Volume",
          },
          top: "75%",
          height: "25%",
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
        formatter: function () {
          const points = this.points;
          let tooltip = `<b>${Highcharts.dateFormat("%A, %b %e, %Y", this.x)}</b><br/>`;

          points.forEach((point) => {
            if (point.series.name === selectedStock) {
              tooltip += `<br/><span style="color:${point.color}">●</span> ${point.series.name}<br/>`;
              tooltip += `Open: <b>${point.point.open.toFixed(2)}</b><br/>`;
              tooltip += `High: <b>${point.point.high.toFixed(2)}</b><br/>`;
              tooltip += `Low: <b>${point.point.low.toFixed(2)}</b><br/>`;
              tooltip += `Close: <b>${point.point.close.toFixed(2)}</b><br/>`;
            } else if (point.series.name === "Volume") {
              tooltip += `<br/><span style="color:${point.color}">●</span> Volume: <b>${(point.y / 1000000).toFixed(1)}M</b>`;
            } else {
              tooltip += `<br/><span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y.toFixed(2)}</b>`;
            }
          });

          return tooltip;
        },
      },
      plotOptions: {
        candlestick: {
          lineColor: "#404048",
        },
        series: {
          point: {
            events: {
              mouseOver: function () {
                if (this.series.name === selectedStock) {
                  // Find volume data point safely
                  const volumeSeries = this.series.chart.series.find(
                    (s) => s.name === "Volume"
                  );
                  const volumePoint = volumeSeries
                    ? volumeSeries.data.find((d) => d.x === this.x)
                    : null;

                  currentPrices = {
                    open: this.open || 0,
                    high: this.high || 0,
                    low: this.low || 0,
                    close: this.close || 0,
                    volume: volumePoint ? volumePoint.y : 0,
                    date: Highcharts.dateFormat("%b %e, %Y", this.x),
                  };
                }
              },
            },
          },
        },
      },
      series: series,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 800,
            },
            chartOptions: {
              chart: {
                height: 400,
              },
            },
          },
        ],
      },
    });

    // Set initial current prices to latest data point
    if (ohlcData.length > 0) {
      const latest = ohlcData[ohlcData.length - 1];
      const latestVolume = volumeData[volumeData.length - 1];
      currentPrices = {
        open: latest[1],
        high: latest[2],
        low: latest[3],
        close: latest[4],
        volume: latestVolume[1],
        date: Highcharts.dateFormat("%b %e, %Y", latest[0]),
      };
    }
  }

  function updateChart() {
    if (chart) {
      chart.destroy();
    }
    createChart();
  }

  function toggleSMA(period) {
    smaSettings[period].enabled = !smaSettings[period].enabled;
    updateChart();
  }

  function handlePeriodChange() {
    useCustomDates = false;
    updateChart();
  }

  function handleCustomDateChange() {
    if (customStartDate && customEndDate) {
      useCustomDates = true;
      updateChart();
    }
  }

  // Compare functionality
  function toggleCompare() {
    compareMode = !compareMode;
    if (!compareMode) {
      compareStocks = [];
      updateChart();
    }
  }

  function addCompareStock() {
    if (
      compareStock &&
      !compareStocks.includes(compareStock) &&
      compareStock !== selectedStock
    ) {
      compareStocks = [...compareStocks, compareStock];
      updateChart();
    }
  }

  function removeCompareStock(stock) {
    compareStocks = compareStocks.filter((s) => s !== stock);
    updateChart();
  }

  // Alerts functionality
  function toggleAlerts() {
    showAlerts = !showAlerts;
  }

  function addAlert() {
    if (newAlert.price > 0) {
      alerts = [...alerts, { ...newAlert, active: true, id: Date.now() }];
      newAlert = { symbol: selectedStock, type: "above", price: 0 };
    }
  }

  function removeAlert(alertId) {
    alerts = alerts.filter((alert) => alert.id !== alertId);
  }

  function toggleAlert(alertId) {
    alerts = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, active: !alert.active } : alert
    );
  }

  // Save functionality
  function toggleSaveDialog() {
    showSaveDialog = !showSaveDialog;
    if (showSaveDialog) {
      chartName = `${selectedStock} - ${new Date().toLocaleDateString()}`;
    }
  }

  function saveChart() {
    if (chartName.trim()) {
      const chartConfig = {
        id: Date.now(),
        name: chartName,
        stock: selectedStock,
        period: selectedPeriod,
        smaSettings: { ...smaSettings },
        compareStocks: [...compareStocks],
        customStartDate,
        customEndDate,
        useCustomDates,
        savedAt: new Date().toISOString(),
      };

      savedCharts = [...savedCharts, chartConfig];
      localStorage.setItem("savedCharts", JSON.stringify(savedCharts));
      showSaveDialog = false;
      chartName = "";
    }
  }

  function loadChart(config) {
    selectedStock = config.stock;
    selectedPeriod = config.period;
    smaSettings = { ...config.smaSettings };
    compareStocks = [...config.compareStocks];
    customStartDate = config.customStartDate;
    customEndDate = config.customEndDate;
    useCustomDates = config.useCustomDates;
    updateChart();
  }

  function deleteChart(chartId) {
    savedCharts = savedCharts.filter((chart) => chart.id !== chartId);
    localStorage.setItem("savedCharts", JSON.stringify(savedCharts));
  }

  onMount(() => {
    createChart();

    // Handle window resize
    const handleResize = () => {
      if (chart) {
        chart.reflow();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart) {
        chart.destroy();
      }
    };
  });

  $: if (selectedStock) updateChart();
</script>

<div class="stock-chart-container">
  <div class="chart-header">
    <h2>Advanced Stock Analysis</h2>
    <div class="chart-tools">
      <button
        class="tool-btn"
        class:active={compareMode}
        on:click={toggleCompare}
      >
        📊 Compare
      </button>
      <button
        class="tool-btn"
        class:active={showAlerts}
        on:click={toggleAlerts}
      >
        📈 Alerts
      </button>
      <button class="tool-btn" on:click={toggleSaveDialog}> 💾 Save </button>
    </div>
  </div>

  <!-- Compare Panel -->
  {#if compareMode}
    <div class="feature-panel">
      <h3>Compare Stocks</h3>
      <div class="compare-controls">
        <select bind:value={compareStock}>
          <option value="AAPL">Apple (AAPL)</option>
          <option value="GOOGL">Google (GOOGL)</option>
          <option value="MSFT">Microsoft (MSFT)</option>
          <option value="TSLA">Tesla (TSLA)</option>
        </select>
        <button class="add-btn" on:click={addCompareStock}
          >Add to Compare</button
        >
      </div>
      {#if compareStocks.length > 0}
        <div class="compare-list">
          <span>Comparing with:</span>
          {#each compareStocks as stock}
            <span class="compare-tag">
              {stock}
              <button on:click={() => removeCompareStock(stock)}>×</button>
            </span>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Alerts Panel -->
  {#if showAlerts}
    <div class="feature-panel">
      <h3>Price Alerts</h3>
      <div class="alert-form">
        <select bind:value={newAlert.symbol}>
          <option value="AAPL">AAPL</option>
          <option value="GOOGL">GOOGL</option>
          <option value="MSFT">MSFT</option>
          <option value="TSLA">TSLA</option>
        </select>
        <select bind:value={newAlert.type}>
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <input
          type="number"
          bind:value={newAlert.price}
          placeholder="Price"
          step="0.01"
        />
        <button class="add-btn" on:click={addAlert}>Add Alert</button>
      </div>
      <div class="alerts-list">
        {#each alerts as alert}
          <div class="alert-item" class:inactive={!alert.active}>
            <span>{alert.symbol} {alert.type} ${alert.price}</span>
            <div class="alert-actions">
              <button on:click={() => toggleAlert(alert.id)}>
                {alert.active ? "🔔" : "🔕"}
              </button>
              <button on:click={() => removeAlert(alert.id)}>🗑️</button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Save Dialog -->
  {#if showSaveDialog}
    <div class="modal-overlay" on:click={toggleSaveDialog}>
      <div class="modal-content" on:click|stopPropagation>
        <h3>Save Chart Configuration</h3>
        <input
          type="text"
          bind:value={chartName}
          placeholder="Enter chart name"
          class="chart-name-input"
        />
        <div class="modal-actions">
          <button class="save-btn" on:click={saveChart}>Save</button>
          <button class="cancel-btn" on:click={toggleSaveDialog}>Cancel</button>
        </div>

        {#if savedCharts.length > 0}
          <div class="saved-charts">
            <h4>Saved Charts</h4>
            {#each savedCharts as chart}
              <div class="saved-chart-item">
                <span class="chart-info">
                  <strong>{chart.name}</strong>
                  <small>{new Date(chart.savedAt).toLocaleDateString()}</small>
                </span>
                <div class="chart-actions">
                  <button class="load-btn" on:click={() => loadChart(chart)}
                    >Load</button
                  >
                  <button
                    class="delete-btn"
                    on:click={() => deleteChart(chart.id)}>Delete</button
                  >
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <div class="controls">
    <div class="control-group">
      <label for="stock-select">Stock Symbol:</label>
      <select id="stock-select" bind:value={selectedStock}>
        <option value="AAPL">Apple (AAPL)</option>
        <option value="GOOGL">Google (GOOGL)</option>
        <option value="MSFT">Microsoft (MSFT)</option>
        <option value="TSLA">Tesla (TSLA)</option>
      </select>
    </div>

    <div class="control-group">
      <span class="control-label">Time Period:</span>
      <div class="period-buttons">
        {#each Object.keys(periods) as period}
          <button
            class:active={selectedPeriod === period && !useCustomDates}
            on:click={() => {
              selectedPeriod = period;
              handlePeriodChange();
            }}
          >
            {period}
          </button>
        {/each}
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Custom Range:</span>
      <div class="date-inputs">
        <input
          type="date"
          bind:value={customStartDate}
          on:change={handleCustomDateChange}
          aria-label="Start date"
        />
        <span class="date-separator">to</span>
        <input
          type="date"
          bind:value={customEndDate}
          on:change={handleCustomDateChange}
          aria-label="End date"
        />
      </div>
    </div>

    <div class="control-group">
      <span class="control-label">Technical Indicators:</span>
      <div class="indicator-controls">
        {#each Object.entries(smaSettings) as [period, settings]}
          <label class="indicator-checkbox">
            <input
              type="checkbox"
              checked={settings.enabled}
              on:change={() => toggleSMA(period)}
            />
            <span class="indicator-label" style="color: {settings.color}">
              SMA({period})
            </span>
          </label>
        {/each}
      </div>
    </div>
  </div>

  <div class="price-display">
    <div class="stock-info">
      <div class="stock-header">
        <span class="stock-symbol">{selectedStock}</span>
        <span class="stock-price">${currentPrices.close.toFixed(2)}</span>
        <span
          class="price-change"
          class:positive={currentPrices.close > currentPrices.open}
          class:negative={currentPrices.close < currentPrices.open}
        >
          {currentPrices.close > currentPrices.open ? "+" : ""}{(
            currentPrices.close - currentPrices.open
          ).toFixed(2)}
        </span>
      </div>
      <div class="stock-details">
        <div class="detail-item">
          <span class="detail-label">Open</span>
          <span class="detail-value">${currentPrices.open.toFixed(2)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">High</span>
          <span class="detail-value">${currentPrices.high.toFixed(2)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Low</span>
          <span class="detail-value">${currentPrices.low.toFixed(2)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Volume</span>
          <span class="detail-value"
            >{(currentPrices.volume / 1000000).toFixed(1)}M</span
          >
        </div>
        <div class="detail-item">
          <span class="detail-label">Date</span>
          <span class="detail-value">{currentPrices.date}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="chart-wrapper">
    <div bind:this={chartContainer} class="chart-container"></div>
  </div>
</div>

<style>
  /* Previous styles remain the same, adding new styles for features */

  .tool-btn.active {
    background: rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.6);
  }

  .feature-panel {
    padding: 1.5rem 2rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }

  .feature-panel h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 1.1rem;
  }

  .compare-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .add-btn {
    padding: 0.5rem 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .compare-list {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .compare-tag {
    background: #3498db;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .compare-tag button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }

  .alert-form {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .alert-form input {
    padding: 0.5rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    width: 120px;
  }

  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .alert-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
    border-left: 4px solid #3498db;
  }

  .alert-item.inactive {
    opacity: 0.6;
    border-left-color: #95a5a6;
  }

  .alert-actions {
    display: flex;
    gap: 0.5rem;
  }

  .alert-actions button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-content h3 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
  }

  .chart-name-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .save-btn {
    padding: 0.75rem 1.5rem;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .cancel-btn {
    padding: 0.75rem 1.5rem;
    background: #95a5a6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .saved-charts {
    border-top: 1px solid #e9ecef;
    padding-top: 1rem;
  }

  .saved-charts h4 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
  }

  .saved-chart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }

  .chart-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .chart-info small {
    color: #7f8c8d;
  }

  .chart-actions {
    display: flex;
    gap: 0.5rem;
  }

  .load-btn {
    padding: 0.5rem 1rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .delete-btn {
    padding: 0.5rem 1rem;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
  }

  /* Rest of existing styles remain the same */
  .stock-chart-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .chart-header {
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chart-header h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .chart-tools {
    display: flex;
    gap: 0.5rem;
  }

  .tool-btn {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s ease;
  }

  .tool-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .controls {
    padding: 2rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    box-sizing: border-box;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .control-label,
  label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  }

  .period-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .period-buttons button {
    flex-shrink: 0;
    padding: 0.5rem 0.75rem;
    border: 2px solid #e9ecef;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .period-buttons button.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
  }

  .date-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .date-inputs input {
    flex: 1;
    min-width: 110px;
    padding: 0.5rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 0.85rem;
  }

  .date-separator {
    color: #7f8c8d;
    font-weight: 500;
  }

  .indicator-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .indicator-checkbox {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .indicator-label {
    font-weight: 600;
    font-size: 0.85rem;
    color: inherit;
  }

  /* .controls {
    padding: 2rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .control-label,
  label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  } */

  select {
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 0.9rem;
    background: white;
    transition: border-color 0.3s ease;
  }

  select:focus {
    outline: none;
    border-color: #3498db;
  }

  .period-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .period-buttons button {
    padding: 0.5rem 1rem;
    border: 2px solid #e9ecef;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .period-buttons button:hover {
    border-color: #3498db;
    color: #3498db;
  }

  .period-buttons button.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
  }

  .date-inputs {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .date-inputs input {
    padding: 0.5rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 0.85rem;
  }

  .date-separator {
    color: #7f8c8d;
    font-weight: 500;
  }

  .indicator-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .indicator-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .indicator-label {
    font-weight: 600;
    font-size: 0.85rem;
  }

  .price-display {
    padding: 2rem;
    background: white;
    border-bottom: 1px solid #e9ecef;
  }

  .stock-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .stock-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .stock-symbol {
    font-weight: 700;
    font-size: 1.5rem;
    color: #2c3e50;
  }

  .stock-price {
    font-size: 2rem;
    font-weight: 700;
    color: #3498db;
  }

  .price-change {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .positive {
    color: #27ae60;
  }

  .negative {
    color: #e74c3c;
  }

  .stock-details {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-label {
    font-size: 0.8rem;
    color: #7f8c8d;
    font-weight: 500;
  }

  .detail-value {
    font-weight: 600;
    color: #2c3e50;
  }

  .chart-wrapper {
    padding: 2rem;
  }

  .chart-container {
    width: 100%;
    height: 600px;
    border-radius: 8px;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .controls {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .chart-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .stock-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .stock-details {
      grid-template-columns: repeat(2, 1fr);
    }

    .chart-container {
      height: 400px;
    }

    .modal-content {
      width: 95%;
      padding: 1rem;
    }

    .modal-actions {
      flex-direction: column;
    }
  }
</style>
