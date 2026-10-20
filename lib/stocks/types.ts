// Shared stock quote shape.
export interface StockQuote {
  symbol: string;
  currency: string;
  price: number;
  previousClose: number | null;
  change: number | null;
  changePercent: number | null;
  asOf: string; // ISO timestamp of the last trade
  history: number[]; // daily closes, ~1 month, oldest first
}
