// app/api/stock/[id]/route.ts
import { NextResponse } from "next/server";
import { STOCK_TICKERS } from "@/lib/stocks/tickers";
import type { StockQuote } from "@/lib/stocks/types";

const YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart";

interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        regularMarketTime: number;
        currency: string;
      };
      indicators: { quote: Array<{ close: Array<number | null> }> };
    }> | null;
    error: { description: string } | null;
  };
}

const CACHE_HEADERS = {
  // CDN absorbs repeat traffic so one visitor opening every cell can't hammer the upstream
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<StockQuote | { error: string }>> {
  const { id } = await params;
  const ticker = Object.hasOwn(STOCK_TICKERS, id)
    ? STOCK_TICKERS[id]
    : undefined;

  if (!ticker) {
    return NextResponse.json(
      { error: "No listed stock for this company" },
      { status: 404 },
    );
  }

  try {
    const upstream = await fetch(
      `${YAHOO_CHART_URL}/${encodeURIComponent(ticker.symbol)}?range=1mo&interval=1d`,
      {
        headers: { "User-Agent": "Mozilla/5.0" }, // Yahoo rejects requests without a UA
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 60 },
      },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Upstream quote provider failed" },
        { status: 502 },
      );
    }

    const data = (await upstream.json()) as YahooChartResponse;
    const result = data.chart.result?.[0];

    if (!result) {
      return NextResponse.json(
        { error: data.chart.error?.description ?? "No quote data returned" },
        { status: 502 },
      );
    }

    // Yahoo quotes JSE stocks in cents (currency "ZAc"); normalise to rand
    const isCents = result.meta.currency === "ZAc";
    const scale = isCents ? 100 : 1;

    const closes = (result.indicators.quote[0]?.close ?? [])
      .filter((c): c is number => c !== null)
      .map((c) => c / scale);

    const price = result.meta.regularMarketPrice / scale;
    // meta.chartPreviousClose is the close *before the 1mo range*, not yesterday,
    // so derive the previous close from the series instead
    const previousClose = closes.length >= 2 ? closes[closes.length - 2] : null;
    const change = previousClose === null ? null : price - previousClose;
    const changePercent =
      previousClose === null || previousClose === 0
        ? null
        : (change! / previousClose) * 100;

    const quote: StockQuote = {
      symbol: ticker.symbol,
      currency: isCents ? "ZAR" : result.meta.currency,
      price,
      previousClose,
      change,
      changePercent,
      asOf: new Date(result.meta.regularMarketTime * 1000).toISOString(),
      history: closes,
    };

    return NextResponse.json(quote, { headers: CACHE_HEADERS });
  } catch (error) {
    // Covers network failure and the 5s timeout; client shows a fallback state
    console.error(`Stock fetch failed for ${id}:`, error);
    return NextResponse.json(
      { error: "Quote provider unreachable" },
      { status: 502 },
    );
  }
}
