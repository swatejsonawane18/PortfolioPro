# PortfolioPro - Professional Investment Dashboard

A comprehensive investment dashboard that provides market overviews, advanced stock charting, and portfolio tracking capabilities. Built with Svelte 5 for a modern, responsive user experience.

## ✨ Features

### 📊 Market Overview
- **Real-time Market Data**: Live visualization of major indices (SPY, QQQ, DIA, VTI)
- **Market Status Indicator**: Shows live market status with opening hours
- **Portfolio Summary**: Quick overview of total portfolio value and daily changes
- **Top Movers**: Track the best and worst performing stocks
- **Color-coded Changes**: Green for gains, red for losses with percentage changes

### 💼 Portfolio Management
- **Holdings Tracking**: Monitor individual stock positions with shares, average price, and current value
- **Gain/Loss Calculations**: Automatic calculation of profit/loss for each position
- **Sector Allocation**: Visual breakdown of portfolio by sector with percentage bars
- **Market Value Display**: Real-time market values for all holdings
- **Responsive Table**: Converts to mobile-friendly card layout on smaller screens

### 📈 Advanced Stock Charting
- **Interactive Candlestick Charts**: Powered by Highcharts with OHLC data
- **Multiple Time Periods**: 1M, 3M, 6M, 1Y, 2Y, 5Y selections
- **Custom Date Range**: Select specific start and end dates for analysis
- **Technical Indicators**: Simple Moving Averages (SMA 20, 50, 100, 200) with customizable colors
- **Stock Comparison**: Compare multiple stocks on the same chart
- **Price Alerts**: Set notifications for stocks reaching target prices
- **Chart Persistence**: Save and load chart configurations with localStorage
- **Real-time Price Display**: Shows OHLC data, volume, and current date
- **Volume Analysis**: Separate volume chart below price data

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with breakpoints at 480px, 768px, 1024px
- **Gradient Backgrounds**: Beautiful gradient headers and fixed background attachment
- **Card-based Layout**: Clean card design with glassmorphism effects
- **Smooth Animations**: CSS-based animations with fade-in and slide-up effects
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Accessibility Support**: High contrast, reduced motion, and keyboard navigation

## 🛠️ Tech Stack

- **Frontend:** Svelte 5
- **Bundler:** Vite
- **Charts:** Highcharts Stock
- **Styling:** Modern CSS (Flexbox, Grid, Custom Properties, Glassmorphism)
- **Data Storage:** localStorage for chart configurations
- **Icons:** Emoji-based navigation icons

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/PortfolioPro.git
cd PortfolioPro
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 Responsive Breakpoints

- **Mobile:** < 480px
- **Tablet:** 480px - 768px
- **Desktop:** 768px - 1024px
- **Large Desktop:** > 1024px

## 🏗️ Project Structure

```
src/
├── App.svelte                    # Main application with navigation
├── app.css                       # Global styles and utility classes
├── main.js                       # Application entry point
├── components/
│   ├── MarketOverview.svelte     # Market indices and top movers
│   ├── Portfolio.svelte          # Portfolio holdings and allocation
│   └── StockChart.svelte         # Advanced charting with indicators
├── data/
│   └── stockData.js              # Simulated stock data generator
└── utils/
    └── indicators.js             # Technical indicator calculations
```

## 📊 Data Models

### Market Data Structure
```javascript
marketData = [
  {
    symbol: "SPY",
    name: "S&P 500 ETF",
    price: 445.67,
    change: 2.34,
    changePercent: 0.53
  }
]
```

### Portfolio Holdings Structure
```javascript
holdings = [
  {
    symbol: "AAPL",
    name: "Apple Inc",
    shares: 50,
    avgPrice: 175.3,
    currentPrice: 189.45,
    sector: "Technology"
  }
]
```

### Stock Chart Data Format
```javascript
// OHLC data format: [timestamp, open, high, low, close, volume]
stockData = [
  [1672531200000, 150.00, 155.50, 148.75, 152.30, 45000000]
]
```

## 🎯 Component Features Deep Dive

### MarketOverview Component
- **Market Status**: Live indicator showing market hours (9:30 AM - 4:00 PM EST)
- **Major Indices Grid**: Responsive grid showing SPY, QQQ, DIA, VTI performance
- **Portfolio Summary Card**: Total value with daily change calculations
- **Top Movers Section**: Grid of best/worst performing stocks
- **Color Coding**: Automatic positive (green) and negative (red) styling

### Portfolio Component
- **Holdings Table**: Desktop table that converts to mobile cards
- **Calculated Fields**: Automatic gain/loss calculations for each position
- **Sector Allocation**: Visual progress bars showing portfolio diversification
- **Reactive Calculations**: Real-time updates using Svelte's reactive declarations
- **Summary Statistics**: Total portfolio value, cost basis, and performance

### StockChart Component
- **Chart Tools**: Compare mode, alerts system, and save functionality
- **Technical Indicators**: Configurable SMA periods with color customization
- **Interactive Features**: 
  - Hover for detailed OHLC data
  - Mouse events update current price display
  - Responsive chart sizing
- **Comparison Mode**: Add multiple stocks for side-by-side analysis
- **Alerts System**: Set price notifications with above/below triggers
- **Save/Load**: Persist chart configurations in localStorage
- **Custom Date Ranges**: Override period buttons with specific dates

## 🎨 Styling Features

### CSS Utilities
- **Animation Classes**: `.fade-in`, `.slide-up` with CSS keyframes
- **Button Styles**: `.btn`, `.btn-primary`, `.btn-secondary` with hover effects
- **Card Components**: `.card` with glassmorphism and backdrop-filter
- **Responsive Typography**: Fluid font sizes across breakpoints

### Advanced CSS Features
- **Glassmorphism**: `backdrop-filter: blur()` for modern glass effects
- **CSS Grid**: Auto-fit layouts with `minmax()` for responsive grids
- **Custom Properties**: CSS variables for consistent theming
- **Gradient Backgrounds**: Linear gradients with fixed attachment
- **Smooth Transitions**: 0.3s ease transitions for interactive elements

## ♿ Accessibility Features

- **Reduced Motion**: Respects `prefers-reduced-motion` for animation-sensitive users
- **High Contrast**: Enhanced styling for `prefers-contrast: high`
- **Touch Targets**: 44px minimum touch targets for mobile devices
- **Focus Indicators**: Clear focus-visible outlines for keyboard navigation
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Screen Reader Support**: Descriptive labels and meaningful text

## 💾 Data Persistence

### localStorage Usage
- **Chart Configurations**: Save complete chart setups including:
  - Selected stock and time period
  - Technical indicator settings
  - Comparison stocks
  - Custom date ranges
- **User Preferences**: Maintain settings across sessions
- **Data Structure**: JSON serialization for complex configuration objects

### Simulated Data
- **Stock Data Generator**: Creates realistic OHLC data with:
  - Configurable volatility and trend parameters
  - Weekend exclusion for realistic trading days
  - Volume simulation with random variation
- **Technical Indicators**: SMA calculations using historical price data

## 🔧 Configuration Options

### Chart Customization
```javascript
smaSettings = {
  20: { enabled: false, color: "#2196F3" },
  50: { enabled: true, color: "#4CAF50" },
  100: { enabled: false, color: "#FF9800" },
  200: { enabled: false, color: "#9C27B0" }
}
```

### Responsive Behavior
- **Mobile Navigation**: Hamburger menu with smooth transitions
- **Table Adaptability**: Holdings table becomes card layout on mobile
- **Chart Responsiveness**: Highcharts responsive rules for different screen sizes
- **Touch Optimization**: Enhanced touch targets and hover state management

## 🚧 Future Enhancements

- [ ] **Real API Integration**: Replace simulated data with live market feeds
- [ ] **User Authentication**: Personal accounts with cloud portfolio sync
- [ ] **Extended Technical Analysis**: RSI, MACD, Bollinger Bands indicators
- [ ] **News Integration**: Real-time financial news and sentiment analysis
- [ ] **Advanced Portfolio Analytics**: 
  - Risk metrics (Sharpe ratio, beta)
  - Performance attribution
  - Benchmark comparisons
- [ ] **Watchlist Management**: Custom stock lists with alerts
- [ ] **Push Notifications**: Real-time price and news alerts
- [ ] **Export Functionality**: PDF reports and CSV data export
- [ ] **Dark Mode Toggle**: User-controlled theme switching
- [ ] **Multi-language Support**: Internationalization features

### Development Guidelines
- Follow Svelte component conventions
- Maintain responsive design principles
- Include accessibility considerations
- Test across different browsers and devices
- Document new features and components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- [Highcharts](https://www.highcharts.com/) for the powerful charting library
- [Svelte](https://svelte.dev/) for the reactive framework
- [Vite](https://vitejs.dev/) for the fast build tool and development server

## 🔍 Performance Notes

- **Efficient Rendering**: Svelte's compilation approach for minimal runtime overhead
- **CSS Animations**: Hardware-accelerated animations instead of JavaScript-based
- **Optimized Data Handling**: Reactive declarations for computed properties
- **Chart Performance**: Highcharts optimizations for large datasets
- **Memory Management**: Proper cleanup of chart instances and event listeners

---

**Disclaimer:** The stock data is simulated.
