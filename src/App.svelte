<script>
  import StockChart from "./components/StockChart.svelte";
  import Portfolio from "./components/Portfolio.svelte";
  import MarketOverview from "./components/MarketOverview.svelte";
  import "./app.css";

  let activeTab = "chart";
  let mobileMenuOpen = false;

  // Close mobile menu when tab changes
  $: if (activeTab) {
    mobileMenuOpen = false;
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<div class="app-container">
  <header class="app-header">
    <div class="header-content">
      <div class="logo">
        <h1>Portfolio<span class="accent">Pro</span></h1>
        <p class="tagline">Professional Investment Dashboard</p>
      </div>

      <!-- Mobile menu button -->
      <button
        class="mobile-menu-btn"
        on:click={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span class="hamburger" class:open={mobileMenuOpen}>
          <div></div>
          <!-- middle line -->
        </span>
      </button>

      <!-- Desktop navigation -->
      <nav class="main-nav desktop-nav">
        <button
          class:active={activeTab === "overview"}
          on:click={() => (activeTab = "overview")}
        >
          <span class="nav-icon">📊</span>
          <span class="nav-text">Market Overview</span>
        </button>
        <button
          class:active={activeTab === "chart"}
          on:click={() => (activeTab = "chart")}
        >
          <span class="nav-icon">📈</span>
          <span class="nav-text">Advanced Charts</span>
        </button>
        <button
          class:active={activeTab === "portfolio"}
          on:click={() => (activeTab = "portfolio")}
        >
          <span class="nav-icon">💼</span>
          <span class="nav-text">My Portfolio</span>
        </button>
      </nav>
    </div>

    <!-- Mobile navigation -->
    <nav class="mobile-nav" class:open={mobileMenuOpen}>
      <button
        class:active={activeTab === "overview"}
        on:click={() => (activeTab = "overview")}
      >
        <span class="nav-icon">📊</span>
        <span class="nav-text">Market Overview</span>
      </button>
      <button
        class:active={activeTab === "chart"}
        on:click={() => (activeTab = "chart")}
      >
        <span class="nav-icon">📈</span>
        <span class="nav-text">Advanced Charts</span>
      </button>
      <button
        class:active={activeTab === "portfolio"}
        on:click={() => (activeTab = "portfolio")}
      >
        <span class="nav-icon">💼</span>
        <span class="nav-text">My Portfolio</span>
      </button>
    </nav>
  </header>

  <main class="main-content">
    <div class="content-wrapper fade-in">
      {#if activeTab === "overview"}
        <MarketOverview />
      {:else if activeTab === "chart"}
        <StockChart />
      {:else if activeTab === "portfolio"}
        <Portfolio />
      {/if}
    </div>
  </main>
</div>

<style>
  .app-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-attachment: fixed;
  }

  .app-header {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.12);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .logo h1 {
    font-size: 2.2rem;
    font-weight: 800;
    color: #2c3e50;
    margin: 0;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logo .accent {
    color: #3498db;
    background: linear-gradient(135deg, #3498db, #2980b9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logo .tagline {
    font-size: 0.85rem;
    color: #7f8c8d;
    margin: 0;
    font-weight: 500;
  }

  /* Mobile menu button */
  .mobile-menu-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    /* Remove display here entirely */
  }

  /* Hide by default (desktop) */
  @media (min-width: 769px) {
    .mobile-menu-btn {
      display: none;
    }
  }

  .hamburger {
    position: relative;
    width: 24px;
    height: 16px; /* space for 3 lines */
    display: inline-block;
  }

  .hamburger::before,
  .hamburger::after,
  .hamburger div {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: #2c3e50;
    transition: all 0.3s ease;
  }

  .hamburger div {
    top: 50%;
    transform: translateY(-50%);
  }

  .hamburger::before {
    top: 0;
  }

  .hamburger::after {
    bottom: 0;
  }

  /* Transform into X */
  .hamburger.open div {
    transform: rotate(45deg);
  }

  .hamburger.open::before {
    opacity: 0;
  }

  .hamburger.open::after {
    transform: rotate(-45deg);
    top: 50%;
    bottom: auto;
  }

  /* Desktop navigation */
  .desktop-nav {
    display: flex;
    gap: 0.5rem;
  }

  .main-nav button {
    padding: 0.75rem 1.25rem;
    border: none;
    background: transparent;
    color: #2c3e50;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
  }

  .main-nav button::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s;
  }

  .main-nav button:hover::before {
    left: 100%;
  }

  .main-nav button:hover {
    background: rgba(52, 152, 219, 0.1);
    color: #3498db;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  }

  .main-nav button.active {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    box-shadow: 0 4px 16px rgba(52, 152, 219, 0.4);
  }

  .nav-icon {
    font-size: 1.1rem;
  }

  .nav-text {
    font-size: 0.9rem;
  }

  /* Mobile navigation */
  .mobile-nav {
    display: none;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.98);
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .mobile-nav.open {
    max-height: 300px;
  }

  .mobile-nav button {
    padding: 1rem 1.5rem;
    border: none;
    background: transparent;
    color: #2c3e50;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .mobile-nav button:hover {
    background: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }

  .mobile-nav button.active {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
  }

  .main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    min-height: calc(100vh - 120px);
  }

  .content-wrapper {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .header-content {
      padding: 1rem;
    }

    .main-content {
      padding: 1.5rem 1rem;
    }

    .content-wrapper {
      padding: 1.5rem;
      border-radius: 16px;
    }

    .logo h1 {
      font-size: 1.8rem;
    }
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }

    .mobile-menu-btn {
      display: block;
    }

    .mobile-nav {
      display: flex;
    }

    .header-content {
      padding: 0.75rem 1rem;
    }

    .logo h1 {
      font-size: 1.6rem;
    }

    .logo .tagline {
      font-size: 0.8rem;
    }

    .main-content {
      padding: 1rem 0.75rem;
    }

    .content-wrapper {
      padding: 1rem;
      border-radius: 12px;
      margin: 0;
    }

    .nav-text {
      font-size: 0.95rem;
    }
  }

  @media (max-width: 480px) {
    .header-content {
      padding: 0.5rem 0.75rem;
    }

    .logo h1 {
      font-size: 1.4rem;
    }

    .logo .tagline {
      font-size: 0.75rem;
    }

    .main-content {
      padding: 0.75rem 0.5rem;
    }

    .content-wrapper {
      padding: 0.75rem;
      border-radius: 8px;
    }

    .mobile-nav button {
      padding: 0.875rem 1rem;
    }

    .nav-icon {
      font-size: 1rem;
    }

    .nav-text {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 360px) {
    .logo h1 {
      font-size: 1.2rem;
    }

    .content-wrapper {
      padding: 0.5rem;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .app-container {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    }

    .app-header {
      background: rgba(44, 62, 80, 0.98);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo h1 {
      color: #ecf0f1;
    }

    .logo .tagline {
      color: #bdc3c7;
    }

    .hamburger,
    .hamburger::before,
    .hamburger::after {
      background: #ecf0f1;
    }

    .main-nav button,
    .mobile-nav button {
      color: #ecf0f1;
    }

    .main-nav button:hover,
    .mobile-nav button:hover {
      background: rgba(52, 152, 219, 0.2);
    }

    .content-wrapper {
      background: rgba(44, 62, 80, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-nav {
      background: rgba(44, 62, 80, 0.98);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-nav button {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
  }
</style>
