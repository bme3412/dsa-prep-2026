import { DrawdownViz } from "../../visualizations/quant-finance/DrawdownViz";
import { SharpeRatioViz } from "../../visualizations/quant-finance/SharpeRatioViz";
import { BacktestViz } from "../../visualizations/quant-finance/BacktestViz";
import type { DataStructure } from "../../types";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
    {children}
  </p>
);

export const quantFinanceContent: DataStructure = {
  id: "quant-finance",
  name: "Quantitative Finance",
  icon: "📈",
  tagline:
    "Systematic investing fundamentals. From factor models to backtesting, the domain knowledge for investment AI.",
  color: "teal",

  sections: [
    {
      id: "systematic-vs-discretionary",
      title: "Systematic vs discretionary investing",
      subtitle: "Rules-based vs judgment-based decision making",
      content: (
        <>
          <Prose>
            <strong>Discretionary investing</strong> relies on human judgment for
            each decision. A PM analyzes companies, forms opinions, and makes
            trading decisions based on experience and intuition.
          </Prose>
          <Prose>
            <strong>Systematic investing</strong> (quantitative) uses rules and
            models to make decisions. Signals are generated algorithmically,
            tested on historical data, and executed with minimal human
            intervention. Acadian is a systematic manager — decisions flow from
            models, not individual stock picks.
          </Prose>
          <Prose>
            AI in systematic investing typically means: (1) generating new
            signals from unstructured data, (2) improving existing models with
            ML, (3) automating research workflows, or (4) augmenting human
            decision-making with AI assistants.
          </Prose>
        </>
      ),
    },
    {
      id: "alpha-beta-factors",
      title: "Alpha, Beta, and factor models",
      subtitle: "Decomposing returns into systematic and idiosyncratic components",
      content: (
        <>
          <Prose>
            <strong>Beta</strong> is the sensitivity of a portfolio to the market.
            A beta of 1.0 means the portfolio moves with the market. Beta returns
            are "free" — you can get them with an index fund.
          </Prose>
          <Prose>
            <strong>Alpha</strong> is the excess return beyond what's explained by
            beta. It's the value a manager adds. Alpha is zero-sum — for every
            dollar of alpha earned, someone else loses a dollar.
          </Prose>
          <Prose>
            <strong>Factor models</strong> decompose returns into exposure to
            common factors: value, momentum, quality, size, volatility. A factor
            is a characteristic that explains cross-sectional differences in
            returns. Systematic managers build portfolios with target factor
            exposures.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`# CAPM: Return = Alpha + Beta * Market_Return
# Multi-factor model:
# Return = Alpha + B1*Value + B2*Momentum + B3*Quality + ... + Residual

import numpy as np
from sklearn.linear_model import LinearRegression

def estimate_factor_exposures(returns, factor_returns):
    """
    Estimate a stock's factor exposures (betas) using regression.

    Args:
        returns: Stock return series
        factor_returns: DataFrame of factor return series

    Returns:
        Factor exposures (betas) and alpha
    """
    model = LinearRegression()
    model.fit(factor_returns, returns)

    exposures = dict(zip(factor_returns.columns, model.coef_))
    alpha = model.intercept_

    return exposures, alpha`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "portfolio-construction",
      title: "Portfolio construction & optimization",
      subtitle: "From signals to positions",
      content: (
        <>
          <Prose>
            <strong>Signals</strong> predict which stocks will outperform. But
            signals alone don't make a portfolio. <strong>Portfolio construction</strong>
            transforms signals into positions while respecting constraints:
            sector limits, position size limits, turnover costs, and risk budgets.
          </Prose>
          <Prose>
            <strong>Mean-variance optimization</strong> (Markowitz) maximizes
            expected return for a given level of risk. In practice, this is
            heavily regularized because raw optimization is unstable — small
            changes in inputs cause large swings in positions.
          </Prose>
          <SharpeRatioViz />
          <Prose>
            Modern optimizers add constraints and penalties: transaction costs,
            tracking error limits, factor exposure bounds, and shrinkage
            estimators for covariance. The goal is a robust portfolio, not
            the theoretically optimal one.
          </Prose>
        </>
      ),
    },
    {
      id: "risk-management",
      title: "Risk management",
      subtitle: "VaR, drawdown, and volatility",
      content: (
        <>
          <Prose>
            <strong>Volatility</strong> is the standard deviation of returns —
            a measure of how much returns vary. Higher volatility = more risk.
            Annualized volatility is daily volatility × √252.
          </Prose>
          <Prose>
            <strong>Value at Risk (VaR)</strong> is the maximum loss expected at
            a given confidence level. "95% VaR of $1M" means there's a 5% chance
            of losing more than $1M in a day. It's widely used but has
            limitations — it doesn't tell you how bad losses could get beyond
            the threshold.
          </Prose>
          <DrawdownViz />
          <Prose>
            <strong>Maximum drawdown</strong> is the worst peak-to-trough decline.
            A 50% drawdown requires a 100% gain to recover. Drawdown captures
            the pain investors actually feel — it's often more relevant than
            volatility for understanding risk.
          </Prose>
        </>
      ),
    },
    {
      id: "backtesting",
      title: "Backtesting & walk-forward analysis",
      subtitle: "Testing strategies on historical data",
      content: (
        <>
          <Prose>
            <strong>Backtesting</strong> simulates how a strategy would have
            performed historically. You apply your rules to past data and measure
            the results. It's essential for strategy development but fraught with
            pitfalls.
          </Prose>
          <BacktestViz />
          <Prose>
            <strong>Overfitting</strong> is the biggest risk. If you test enough
            strategies on the same data, some will look great by chance.
            <strong> Walk-forward analysis</strong> helps: train on period 1,
            test on period 2, then train on periods 1-2, test on period 3, etc.
            This simulates real-world deployment.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`def walk_forward_backtest(data, strategy, train_window, test_window):
    """
    Walk-forward backtesting to avoid overfitting.

    Args:
        data: Historical price/return data
        strategy: Strategy object with fit() and predict() methods
        train_window: Number of periods for training
        test_window: Number of periods for testing
    """
    results = []
    total_periods = len(data)

    for start in range(0, total_periods - train_window - test_window, test_window):
        train_end = start + train_window
        test_end = train_end + test_window

        # Train on in-sample data
        train_data = data[start:train_end]
        strategy.fit(train_data)

        # Test on out-of-sample data
        test_data = data[train_end:test_end]
        predictions = strategy.predict(test_data)

        # Calculate returns
        returns = calculate_returns(predictions, test_data)
        results.append(returns)

    return pd.concat(results)`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "market-microstructure",
      title: "Market microstructure basics",
      subtitle: "How markets actually work",
      content: (
        <>
          <Prose>
            <strong>Order books</strong> match buyers and sellers. Bids (buy
            orders) and asks (sell orders) form a queue. The <strong>spread</strong>
            is the gap between best bid and best ask — it's a transaction cost.
          </Prose>
          <Prose>
            <strong>Market orders</strong> execute immediately at the best
            available price. <strong>Limit orders</strong> specify a price and
            wait in the book. Large orders must be broken up to avoid
            <strong> market impact</strong> — moving the price against yourself.
          </Prose>
          <Prose>
            <strong>Slippage</strong> is the difference between expected and
            actual execution price. It increases with order size and decreases
            with liquidity. Transaction cost models estimate expected slippage
            so optimizers can trade off alpha vs execution costs.
          </Prose>
        </>
      ),
    },
    {
      id: "research-to-production",
      title: "From research to production",
      subtitle: "The investment pipeline",
      content: (
        <>
          <Prose>
            The quant investment process flows from <strong>data</strong> →
            <strong> signals</strong> → <strong>portfolio</strong> →
            <strong> execution</strong> → <strong>analysis</strong>. Each stage
            has its own engineering challenges and quality controls.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`Investment Pipeline:

1. DATA INGESTION
   - Market data (prices, volumes)
   - Fundamental data (financials, estimates)
   - Alternative data (satellite, sentiment)
   → Clean, validate, store in feature store

2. SIGNAL GENERATION
   - Transform data into predictive signals
   - Combine signals with ML or linear models
   - Rank securities by expected return
   → Output: Alpha signal per security

3. PORTFOLIO CONSTRUCTION
   - Optimize positions given signals + constraints
   - Risk model constraints (factor limits, VaR)
   - Transaction cost estimates
   → Output: Target portfolio weights

4. EXECUTION
   - Break large orders into smaller pieces
   - Choose venues and timing
   - Monitor market impact
   → Output: Filled trades

5. ATTRIBUTION & ANALYSIS
   - Measure performance vs benchmark
   - Decompose returns by factor/signal
   - Feed learnings back to research
   → Output: Attribution reports`}
            </pre>
          </div>
          <Prose>
            AI can plug into multiple stages: NLP for alternative data, ML for
            signal generation, RL for execution, and agents for research
            automation. The key is maintaining rigor and auditability.
          </Prose>
        </>
      ),
    },
  ],

  operations: [
    {
      name: "Sharpe Ratio",
      average: "O(n)",
      worst: "O(n)",
      note: "(mean - rf) / std. Higher is better. 1.0 is good, 2.0+ excellent.",
    },
    {
      name: "Max Drawdown",
      average: "O(n)",
      worst: "O(n)",
      note: "Worst peak-to-trough decline. Running max minus current value.",
    },
    {
      name: "Volatility",
      average: "O(n)",
      worst: "O(n)",
      note: "Std dev of returns. Annualize by × √252.",
    },
    {
      name: "Correlation Matrix",
      average: "O(n × m²)",
      worst: "O(n × m²)",
      note: "n = observations, m = assets. Expensive for large universes.",
    },
    {
      name: "Portfolio Optimization",
      average: "O(m³)",
      worst: "O(m³)",
      note: "m = assets. Matrix inversion dominates. Use sparse methods.",
    },
    {
      name: "Backtest Simulation",
      average: "O(n × m)",
      worst: "O(n × m)",
      note: "n = periods, m = assets. Vectorize for performance.",
    },
  ],

  patterns: [
    {
      id: "sharpe-ratio",
      name: "Sharpe ratio calculation",
      tag: "Essential",
      tagColor: "teal",
      description:
        "The most common risk-adjusted return metric. Measures excess return per unit of risk. Annualize both return and volatility.",
      code: `import numpy as np

def sharpe_ratio(returns, risk_free_rate=0.0, periods_per_year=252):
    """
    Calculate annualized Sharpe ratio.

    Args:
        returns: Array of periodic returns (e.g., daily)
        risk_free_rate: Annual risk-free rate
        periods_per_year: 252 for daily, 12 for monthly

    Returns:
        Annualized Sharpe ratio
    """
    excess_returns = returns - risk_free_rate / periods_per_year
    mean_excess = np.mean(excess_returns)
    std_excess = np.std(excess_returns, ddof=1)

    # Annualize
    annualized_return = mean_excess * periods_per_year
    annualized_vol = std_excess * np.sqrt(periods_per_year)

    return annualized_return / annualized_vol

# Example
daily_returns = np.array([0.001, -0.002, 0.003, ...])
sharpe = sharpe_ratio(daily_returns, risk_free_rate=0.04)`,
      investmentParallel:
        "The universal metric for comparing strategies. A PM evaluating two signals will always ask: what's the Sharpe?",
      problems: [],
    },
    {
      id: "rolling-window",
      name: "Rolling window calculations",
      tag: "High frequency",
      tagColor: "green",
      description:
        "Calculate metrics over a sliding window of historical data. Essential for time-varying signals like momentum and volatility.",
      code: `import pandas as pd
import numpy as np

def rolling_metrics(prices: pd.Series, window: int = 20):
    """
    Calculate common rolling metrics.

    Args:
        prices: Price series
        window: Lookback window (e.g., 20 days)
    """
    returns = prices.pct_change()

    metrics = pd.DataFrame({
        # Rolling volatility (annualized)
        'volatility': returns.rolling(window).std() * np.sqrt(252),

        # Rolling Sharpe (simplified)
        'sharpe': (returns.rolling(window).mean() * 252) /
                  (returns.rolling(window).std() * np.sqrt(252)),

        # Momentum: return over window
        'momentum': prices.pct_change(window),

        # Rolling max for drawdown
        'rolling_max': prices.rolling(window, min_periods=1).max(),
    })

    # Drawdown from rolling max
    metrics['drawdown'] = prices / metrics['rolling_max'] - 1

    return metrics`,
      investmentParallel:
        "Time-varying risk and signals. A stock's volatility today isn't its volatility last year. Rolling windows capture current regime.",
      problems: [],
    },
    {
      id: "max-drawdown",
      name: "Maximum drawdown calculation",
      tag: "Essential",
      tagColor: "coral",
      description:
        "Find the worst peak-to-trough decline in a return series. Critical for understanding downside risk.",
      code: `import numpy as np

def max_drawdown(returns):
    """
    Calculate maximum drawdown from a return series.

    Args:
        returns: Array of periodic returns

    Returns:
        Maximum drawdown (negative number, e.g., -0.15 for 15% drawdown)
    """
    # Convert to cumulative wealth
    cumulative = np.cumprod(1 + returns)

    # Track running maximum
    running_max = np.maximum.accumulate(cumulative)

    # Drawdown at each point
    drawdowns = cumulative / running_max - 1

    return np.min(drawdowns)

def drawdown_series(returns):
    """Return full drawdown series for visualization."""
    cumulative = np.cumprod(1 + returns)
    running_max = np.maximum.accumulate(cumulative)
    return cumulative / running_max - 1

# Example
daily_returns = np.array([0.01, -0.02, 0.015, -0.03, -0.02, ...])
mdd = max_drawdown(daily_returns)  # e.g., -0.12 (12% max drawdown)`,
      investmentParallel:
        "The pain metric. A 50% drawdown means you lost half your money at the worst point. Clients remember drawdowns forever.",
      problems: [],
    },
    {
      id: "signal-to-position",
      name: "Signal to position sizing",
      tag: "Production",
      tagColor: "amber",
      description:
        "Convert raw signals (alphas) into position weights. Must normalize, apply constraints, and consider transaction costs.",
      code: `import numpy as np

def signals_to_weights(
    signals: np.ndarray,
    max_position: float = 0.05,
    long_only: bool = False,
    target_leverage: float = 1.0
):
    """
    Convert signals to portfolio weights.

    Args:
        signals: Raw alpha signals (higher = more attractive)
        max_position: Maximum weight per position
        long_only: If True, no short positions
        target_leverage: Gross exposure target

    Returns:
        Portfolio weights summing to target_leverage
    """
    # Z-score normalize signals
    z_signals = (signals - np.mean(signals)) / np.std(signals)

    if long_only:
        z_signals = np.maximum(z_signals, 0)

    # Scale to target leverage
    raw_weights = z_signals / np.sum(np.abs(z_signals)) * target_leverage

    # Apply position limits
    weights = np.clip(raw_weights, -max_position, max_position)

    # Renormalize after clipping
    weights = weights / np.sum(np.abs(weights)) * target_leverage

    return weights

# Example
signals = np.array([1.2, -0.5, 0.8, 0.3, -0.9])
weights = signals_to_weights(signals, max_position=0.10)`,
      investmentParallel:
        "The core of portfolio construction. Signals tell you what's attractive; position sizing tells you how much to own.",
      problems: [],
    },
    {
      id: "backtest-loop",
      name: "Backtest simulation loop",
      tag: "Production",
      tagColor: "accent",
      description:
        "The core backtesting loop: iterate through time, generate signals, form portfolios, calculate returns. Must avoid look-ahead bias.",
      code: `import pandas as pd
import numpy as np

def backtest(prices, signal_func, rebalance_freq='monthly'):
    """
    Simple backtesting framework.

    Args:
        prices: DataFrame of asset prices (columns = tickers)
        signal_func: Function(historical_data) -> signals
        rebalance_freq: 'daily', 'weekly', 'monthly'
    """
    returns = prices.pct_change()
    portfolio_returns = []

    # Determine rebalance dates
    if rebalance_freq == 'monthly':
        rebalance_dates = prices.resample('ME').last().index
    else:
        rebalance_dates = prices.index

    current_weights = None

    for date in prices.index:
        if date in rebalance_dates:
            # CRITICAL: Only use data up to (but not including) today
            historical_data = prices.loc[:date].iloc[:-1]

            if len(historical_data) > 20:  # Minimum history
                signals = signal_func(historical_data)
                current_weights = signals_to_weights(signals)

        if current_weights is not None:
            # Portfolio return = weighted sum of asset returns
            port_ret = np.sum(current_weights * returns.loc[date].values)
            portfolio_returns.append(port_ret)

    return pd.Series(portfolio_returns)`,
      investmentParallel:
        "The simulation that tells you if your strategy would have worked. Must be paranoid about look-ahead bias.",
      problems: [],
    },
    {
      id: "transaction-costs",
      name: "Transaction cost modeling",
      tag: "Production",
      tagColor: "coral",
      description:
        "Estimate the cost of trading: bid-ask spread, market impact, and commissions. High turnover strategies must account for these.",
      code: `def estimate_transaction_cost(
    old_weights: np.ndarray,
    new_weights: np.ndarray,
    spreads: np.ndarray,
    adv: np.ndarray,  # Average daily volume
    portfolio_value: float,
    impact_coef: float = 0.1
):
    """
    Estimate transaction costs for a rebalance.

    Args:
        old_weights: Current portfolio weights
        new_weights: Target portfolio weights
        spreads: Bid-ask spreads (as fraction)
        adv: Average daily volume in dollars
        portfolio_value: Total portfolio value
        impact_coef: Market impact coefficient

    Returns:
        Estimated cost as fraction of portfolio
    """
    # Trade sizes
    trades = np.abs(new_weights - old_weights) * portfolio_value

    # Half-spread cost (cross the spread to trade)
    spread_cost = np.sum(trades * spreads / 2)

    # Market impact (square root model)
    # Impact ∝ sqrt(trade_size / ADV)
    participation = trades / adv
    impact_cost = np.sum(trades * impact_coef * np.sqrt(participation))

    total_cost = spread_cost + impact_cost
    return total_cost / portfolio_value

# Incorporate into optimization
def net_alpha(signals, old_weights, spreads, adv, portfolio_value):
    new_weights = signals_to_weights(signals)
    gross_alpha = np.sum(signals * new_weights)
    tc = estimate_transaction_cost(old_weights, new_weights, spreads, adv, portfolio_value)
    return gross_alpha - tc`,
      investmentParallel:
        "Alpha is gross; returns are net. A strategy with 5% alpha but 3% transaction costs only delivers 2% to investors.",
      problems: [],
    },
  ],

  problems: [
    {
      id: "calculate-sharpe",
      title: "Calculate Portfolio Sharpe Ratio",
      difficulty: "easy",
      description:
        "Given an array of daily returns and a risk-free rate, calculate the annualized Sharpe ratio.",
      examples: [
        {
          input: "returns = [0.01, -0.005, 0.008, 0.002, -0.003], rf = 0.04",
          output: "Sharpe ≈ 1.5",
          explanation: "Annualized return / annualized volatility, adjusted for risk-free rate.",
        },
      ],
      starterCode: `import numpy as np

def sharpe_ratio(returns: list, risk_free_rate: float = 0.0) -> float:
    """
    Calculate annualized Sharpe ratio from daily returns.

    Args:
        returns: List of daily returns (e.g., [0.01, -0.02, ...])
        risk_free_rate: Annual risk-free rate (e.g., 0.04 for 4%)

    Returns:
        Annualized Sharpe ratio
    """
    # Your implementation here
    pass`,
      solution: `import numpy as np

def sharpe_ratio(returns: list, risk_free_rate: float = 0.0) -> float:
    returns = np.array(returns)

    # Daily risk-free rate
    daily_rf = risk_free_rate / 252

    # Excess returns
    excess_returns = returns - daily_rf

    # Annualize mean and std
    mean_excess = np.mean(excess_returns) * 252
    std_returns = np.std(returns, ddof=1) * np.sqrt(252)

    if std_returns == 0:
        return 0.0

    return mean_excess / std_returns`,
      hints: [
        "Annualize daily return by multiplying by 252 (trading days).",
        "Annualize daily volatility by multiplying by √252.",
        "Subtract the daily risk-free rate from each return before calculating excess returns.",
        "Use ddof=1 for sample standard deviation.",
      ],
      testCases: [
        {
          input: "round(sharpe_ratio([0.01, 0.01, 0.01, 0.01, 0.01]), 1)",
          expected: "Infinity handling or very high number",
          description: "Constant returns (zero vol)",
        },
      ],
    },
    {
      id: "max-drawdown",
      title: "Calculate Maximum Drawdown",
      difficulty: "easy",
      description:
        "Given an array of daily returns, calculate the maximum drawdown (worst peak-to-trough decline).",
      examples: [
        {
          input: "returns = [0.05, -0.10, -0.05, 0.08, -0.03]",
          output: "-0.145 (14.5% max drawdown)",
          explanation: "Starting at 100, the worst decline from any peak to subsequent trough.",
        },
      ],
      starterCode: `import numpy as np

def max_drawdown(returns: list) -> float:
    """
    Calculate maximum drawdown from a return series.

    Args:
        returns: List of periodic returns

    Returns:
        Maximum drawdown as a negative decimal (e.g., -0.15 for 15%)
    """
    # Your implementation here
    pass`,
      solution: `import numpy as np

def max_drawdown(returns: list) -> float:
    returns = np.array(returns)

    # Build cumulative wealth curve (start at 1)
    cumulative = np.cumprod(1 + returns)

    # Running maximum at each point
    running_max = np.maximum.accumulate(cumulative)

    # Drawdown at each point
    drawdowns = cumulative / running_max - 1

    return np.min(drawdowns)`,
      hints: [
        "Convert returns to cumulative wealth: wealth[t] = wealth[t-1] * (1 + return[t]).",
        "Track the running maximum using np.maximum.accumulate.",
        "Drawdown = current / running_max - 1.",
        "Max drawdown is the minimum (most negative) drawdown value.",
      ],
      testCases: [
        {
          input: "round(max_drawdown([0.05, -0.10, -0.05, 0.08, -0.03]), 3)",
          expected: "-0.145",
          description: "Standard drawdown calculation",
        },
      ],
    },
    {
      id: "momentum-signal",
      title: "Implement a Momentum Signal",
      difficulty: "medium",
      description:
        "Create a momentum signal that ranks stocks by their past returns. Return the z-scored signal for cross-sectional comparison.",
      examples: [
        {
          input: "prices DataFrame with 60 days of history, lookback=20",
          output: "Z-scored momentum signal per stock",
        },
      ],
      starterCode: `import pandas as pd
import numpy as np

def momentum_signal(prices: pd.DataFrame, lookback: int = 20) -> pd.Series:
    """
    Calculate cross-sectional momentum signal.

    Args:
        prices: DataFrame with stocks as columns, dates as index
        lookback: Number of days for momentum calculation

    Returns:
        Series of z-scored momentum signals (one per stock)
    """
    # Your implementation here
    pass`,
      solution: `import pandas as pd
import numpy as np

def momentum_signal(prices: pd.DataFrame, lookback: int = 20) -> pd.Series:
    # Calculate lookback-period returns
    returns = prices.iloc[-1] / prices.iloc[-lookback - 1] - 1

    # Z-score normalize (cross-sectional)
    mean_ret = returns.mean()
    std_ret = returns.std()

    if std_ret == 0:
        return pd.Series(0, index=returns.index)

    z_scores = (returns - mean_ret) / std_ret

    return z_scores`,
      hints: [
        "Momentum = price now / price N days ago - 1.",
        "Use the last row for current prices, iloc[-lookback-1] for starting prices.",
        "Z-score: (x - mean) / std. This makes signals comparable across time.",
        "Handle the edge case where std is zero (all stocks have same return).",
      ],
      testCases: [
        {
          input: "abs(momentum_signal(sample_prices).mean()) < 0.01",
          expected: "True",
          description: "Z-scored signals should have mean ~0",
        },
      ],
    },
    {
      id: "rebalancing-algo",
      title: "Build a Rebalancing Algorithm",
      difficulty: "medium",
      description:
        "Given current and target weights, generate trades to rebalance the portfolio. Respect a minimum trade size.",
      examples: [
        {
          input: "current = {'AAPL': 0.4, 'MSFT': 0.6}, target = {'AAPL': 0.5, 'MSFT': 0.5}",
          output: "trades = {'AAPL': +0.1, 'MSFT': -0.1}",
        },
      ],
      starterCode: `def generate_rebalance_trades(
    current_weights: dict,
    target_weights: dict,
    portfolio_value: float,
    min_trade_value: float = 1000
) -> dict:
    """
    Generate trades to rebalance from current to target weights.

    Args:
        current_weights: Dict of ticker -> current weight
        target_weights: Dict of ticker -> target weight
        portfolio_value: Total portfolio value in dollars
        min_trade_value: Minimum trade size (skip smaller trades)

    Returns:
        Dict of ticker -> trade amount in dollars (positive = buy)
    """
    # Your implementation here
    pass`,
      solution: `def generate_rebalance_trades(
    current_weights: dict,
    target_weights: dict,
    portfolio_value: float,
    min_trade_value: float = 1000
) -> dict:
    trades = {}

    # Get all tickers
    all_tickers = set(current_weights.keys()) | set(target_weights.keys())

    for ticker in all_tickers:
        current = current_weights.get(ticker, 0)
        target = target_weights.get(ticker, 0)

        weight_diff = target - current
        trade_value = weight_diff * portfolio_value

        # Only include trades above minimum size
        if abs(trade_value) >= min_trade_value:
            trades[ticker] = round(trade_value, 2)

    return trades`,
      hints: [
        "Trade = (target_weight - current_weight) * portfolio_value.",
        "Use set union to handle tickers that appear in only one dict.",
        "Use .get(ticker, 0) to handle missing tickers.",
        "Skip trades below the minimum size to reduce transaction costs.",
      ],
      testCases: [
        {
          input: "generate_rebalance_trades({'A': 0.4}, {'A': 0.5, 'B': 0.5}, 100000, 1000)",
          expected: "{'A': 10000.0, 'B': 50000.0}",
          description: "New position and increase existing",
        },
      ],
    },
    {
      id: "backtest-framework",
      title: "Design a Backtest Framework",
      difficulty: "hard",
      description:
        "Implement a simple backtesting engine that takes a signal function and returns portfolio performance metrics.",
      examples: [
        {
          input: "Prices DataFrame, momentum_signal function, monthly rebalance",
          output: "{'total_return': 0.25, 'sharpe': 1.2, 'max_drawdown': -0.08}",
        },
      ],
      starterCode: `import pandas as pd
import numpy as np

def backtest(
    prices: pd.DataFrame,
    signal_func,
    rebalance_freq: str = 'ME',
    lookback: int = 20
) -> dict:
    """
    Run a backtest and return performance metrics.

    Args:
        prices: DataFrame of daily prices (tickers as columns)
        signal_func: Function(prices) -> pd.Series of signals
        rebalance_freq: Pandas frequency string ('ME' for month-end)
        lookback: Minimum history required for signals

    Returns:
        Dict with 'total_return', 'sharpe', 'max_drawdown'
    """
    # Your implementation here
    pass`,
      solution: `import pandas as pd
import numpy as np

def backtest(
    prices: pd.DataFrame,
    signal_func,
    rebalance_freq: str = 'ME',
    lookback: int = 20
) -> dict:
    returns = prices.pct_change()
    portfolio_returns = []

    # Get rebalance dates
    rebalance_dates = prices.resample(rebalance_freq).last().index

    weights = None

    for i, date in enumerate(prices.index[lookback:], lookback):
        # Rebalance if on rebalance date
        if date in rebalance_dates:
            # Use only past data (no look-ahead)
            hist_prices = prices.iloc[:i]
            signals = signal_func(hist_prices)
            # Simple signal-to-weight: normalize to sum to 1
            weights = signals / signals.abs().sum()
            weights = weights.fillna(0)

        if weights is not None:
            # Portfolio return = weighted average of asset returns
            port_ret = (weights * returns.loc[date]).sum()
            portfolio_returns.append(port_ret)

    port_returns = np.array(portfolio_returns)

    # Calculate metrics
    total_return = np.prod(1 + port_returns) - 1
    sharpe = np.mean(port_returns) / np.std(port_returns) * np.sqrt(252) if np.std(port_returns) > 0 else 0

    # Max drawdown
    cumulative = np.cumprod(1 + port_returns)
    running_max = np.maximum.accumulate(cumulative)
    max_dd = np.min(cumulative / running_max - 1)

    return {
        'total_return': round(total_return, 4),
        'sharpe': round(sharpe, 2),
        'max_drawdown': round(max_dd, 4)
    }`,
      hints: [
        "Critical: use iloc[:i] to avoid look-ahead bias. Never use future data.",
        "Rebalance only on specified dates (e.g., month-end).",
        "Weights should be calculated from signals — simplest is normalize to sum to 1.",
        "Track cumulative returns to calculate max drawdown.",
      ],
      testCases: [
        {
          input: "'total_return' in backtest(sample_prices, momentum_signal)",
          expected: "True",
          description: "Returns expected metrics",
        },
      ],
    },
  ],
};
