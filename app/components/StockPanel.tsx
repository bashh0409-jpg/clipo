// components/StockPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { STOCK_TICKERS, hasStockTicker } from "@/lib/stocks/tickers";
import type { StockQuote } from "@/lib/stocks/types";

interface StockPanelProps {
  cellId: string;
  stockUrl?: string;
}

type PanelState =
  | { cellId: string; status: "private" | "loading" | "error" }
  | { cellId: string; status: "ready"; quote: StockQuote };

const SPARK_WIDTH = 186;
const SPARK_HEIGHT = 64;

function sparklinePoints(values: number[]): string | null {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1; // avoid divide-by-zero on a flat line
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * SPARK_WIDTH;
      const y = SPARK_HEIGHT - ((v - min) / span) * SPARK_HEIGHT;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function StockPanel({ cellId, stockUrl }: StockPanelProps) {
  const [state, setState] = useState<PanelState>(() => ({
    cellId,
    status: hasStockTicker(cellId) ? "loading" : "private",
  }));
  const currentState: PanelState =
    state.cellId === cellId
      ? state
      : {
          cellId,
          status: hasStockTicker(cellId) ? "loading" : "private",
        };

  useEffect(() => {
    if (!hasStockTicker(cellId)) return;

    const controller = new AbortController();

    fetch(`/api/stock/${cellId}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Stock request failed: ${res.status}`);
        return res.json() as Promise<StockQuote>;
      })
      .then((quote) => setState({ cellId, status: "ready", quote }))
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ cellId, status: "error" });
      });

    return () => controller.abort();
  }, [cellId]);

  const label = STOCK_TICKERS[cellId]?.label;

  return (
    <div>
      <h2 className="text-sm font-medium tracking-tight">Stock</h2>

      {currentState.status === "private" && (
        <p className="mb-2 text-sm font-medium tracking-tight text-[#999]">
          Private company
        </p>
      )}

      {currentState.status === "loading" && (
        <div
          className="mb-2 h-5 w-24 animate-pulse rounded bg-[#999]/20"
          aria-label="Loading stock"
          role="status"
        />
      )}

      {currentState.status === "error" && (
        <p className="mb-2 text-sm font-medium tracking-tight text-[#999]">
          Quote unavailable
        </p>
      )}

      {currentState.status === "ready" && (
        <Quote quote={currentState.quote} label={label} />
      )}

      {stockUrl && currentState.status !== "private" && (
        <a
          href={stockUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 inline-flex items-center gap-1 underline text-sm font-medium tracking-tight text-[#999] hover:text-current"
        >
          See stocks
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
          >
            <path d="M630-444H192v-72h438L429-717l51-51 288 288-288 288-51-51 201-201Z" />
          </svg>
        </a>
      )}
    </div>
  );
}

function Quote({ quote, label }: { quote: StockQuote; label?: string }) {
  const points = sparklinePoints(quote.history);
  const isUp = (quote.change ?? 0) >= 0;
  const tone = isUp ? "text-emerald-500" : "text-red-500";

  const price = new Intl.NumberFormat("en", {
    style: "currency",
    currency: quote.currency,
  }).format(quote.price);

  return (
    <div className="mb-2 flex items-center gap-3">
      <div>
        <p className="text-sm font-medium tracking-tight">
          {price} {label && <span className="text-[#999]">· {label}</span>}
        </p>
        {quote.changePercent !== null && (
          <p className={`text-xs font-medium tracking-tight ${tone}`}>
            {isUp ? "▲" : "▼"} {Math.abs(quote.changePercent).toFixed(2)}%
          </p>
        )}
      </div>
      {points && (
        <svg
          width={SPARK_WIDTH}
          height={SPARK_HEIGHT}
          viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
          className={tone}
          aria-hidden
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

/*
 * Design note
 * - Private companies render a static label with no fetch, so only the 9 listed cells hit the API.
 * - The loading skeleton matches the final row height to avoid layout shift inside the cell panel.
 * - The sparkline is a plain SVG polyline (no chart lib); colour inherits via currentColor from the change tone.
 * - The fetch is aborted on cleanup so rapid cell switching never applies a stale quote.
 */
