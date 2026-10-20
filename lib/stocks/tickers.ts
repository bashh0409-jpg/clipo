// lib/stocks/tickers.ts
interface StockTicker {
  symbol: string; // Yahoo Finance symbol; JSE tickers use the ".JO" suffix
  label: string;
}

// Keyed by CELLS id. Doubles as the allowlist, so callers can never make the
// server fetch an arbitrary symbol or URL.
export const STOCK_TICKERS: Readonly<Record<string, StockTicker>> = {
  wise: { symbol: "WSE", label: "Nasdaq: WSE" },
  nubank: { symbol: "NU", label: "NYSE: NU" },
  klarna: { symbol: "KLAR", label: "NYSE: KLAR" },
  capitec: { symbol: "CPI.JO", label: "JSE: CPI" },
  "standard-bank": { symbol: "SBK.JO", label: "JSE: SBK" },
  absa: { symbol: "ABG.JO", label: "JSE: ABG" },
  investec: { symbol: "INL.JO", label: "JSE: INL" },
  fnb: { symbol: "FSR.JO", label: "JSE: FSR" }, // FNB itself isn't listed; this is parent FirstRand
  nedbank: { symbol: "NED.JO", label: "JSE: NED" },
};

export const hasStockTicker = (id: string): boolean => id in STOCK_TICKERS;
