// components/StockPanel.tsx
"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { STOCK_TICKERS, hasStockTicker } from "@/lib/stocks/tickers";
import type { StockQuote } from "@/lib/stocks/types";

interface StockPanelProps {
  cellId: string;
  stockUrl?: string;
}

type PanelState =
  | { cellId: string; status: "private" | "loading" | "error" }
  | { cellId: string; status: "ready"; quote: StockQuote };

interface SparklineProps {
  values: number[];
  tone: string;
  format: (value: number) => string;
}

const SPARK_FALLBACK_WIDTH = 200; // used only until the real width is measured
const SPARK_HEIGHT = 64;
const FOLLOW_EASING = 0.8; // fraction of the remaining distance covered per frame

function chartScale(values: number[], width: number) {
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1; // avoid divide-by-zero on a flat line
  return {
    xAt: (i: number) => (i / (values.length - 1)) * width,
    yAt: (v: number) => SPARK_HEIGHT - ((v - min) / span) * SPARK_HEIGHT,
  };
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
    // col-span-2 only takes effect when the parent is a grid container
    <div className="col-span-2">
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
  const isUp = (quote.change ?? 0) >= 0;
  const tone = isUp ? "text-emerald-500" : "text-red-500";

  const formatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: quote.currency,
  });

  return (
    <div className="mb-2 flex w-full items-center gap-3">
      <div className="shrink-0">
        <p className="text-sm font-medium tracking-tight">
          {formatter.format(quote.price)}{" "}
          {label && <span className="text-[#999]">· {label}</span>}
        </p>
        {quote.changePercent !== null && (
          <p className={`text-xs font-medium tracking-tight ${tone}`}>
            {isUp ? "▲" : "▼"} {Math.abs(quote.changePercent).toFixed(2)}%
          </p>
        )}
      </div>
      <Sparkline values={quote.history} tone={tone} format={formatter.format} />
    </div>
  );
}

function Sparkline({ values, tone, format }: SparklineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<SVGLineElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(0); // where the pointer is, as a fractional data index
  const currentRef = useRef(0); // where the marker is, eased toward the target
  const frameRef = useRef<number | null>(null);

  const [width, setWidth] = useState(SPARK_FALLBACK_WIDTH);
  const hasData = values.length >= 2;

  // Measure the space the chart actually gets and keep it in sync on resize.
  // hasData is a dependency because the container only mounts once there is data.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasData]);

  const scale = useMemo(
    () => (values.length < 2 ? null : chartScale(values, width)),
    [values, width],
  );

  const points = useMemo(
    () =>
      scale
        ? values
            .map(
              (v, i) => `${scale.xAt(i).toFixed(1)},${scale.yAt(v).toFixed(1)}`,
            )
            .join(" ")
        : null,
    [scale, values],
  );

  // Cancel any in-flight animation frame on unmount
  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  if (!scale || !points) return null;
  const { xAt, yAt } = scale;
  const lastIndex = values.length - 1;

  // Visibility is driven by a data attribute rather than CSS :hover, because
  // touch browsers emulate hover unreliably (sticky after a tap, absent mid-drag).
  const setActive = (active: boolean) => {
    containerRef.current?.setAttribute("data-active", String(active));
  };

  // Draw the marker at a fractional index. Interpolating between the two
  // neighbouring points keeps it exactly on the polyline (the line is linear
  // between points), so movement is continuous rather than snapping per sample.
  const render = (position: number) => {
    const i0 = Math.floor(position);
    const i1 = Math.min(i0 + 1, lastIndex);
    const frac = position - i0;
    const value = values[i0] + (values[i1] - values[i0]) * frac;
    const x = xAt(position);
    const y = yAt(value);

    guideRef.current?.setAttribute("x1", String(x));
    guideRef.current?.setAttribute("x2", String(x));
    dotRef.current?.setAttribute("cx", String(x));
    dotRef.current?.setAttribute("cy", String(y));

    const tip = tipRef.current;
    if (tip) {
      tip.textContent = format(value);
      // Clamp so the tooltip never overflows either end of the chart
      const half = tip.offsetWidth / 2;
      const left = Math.min(Math.max(x, half), width - half) - half;
      tip.style.transform = `translate3d(${left}px, 0, 0)`;
    }
  };

  const positionFromEvent = (e: React.PointerEvent<HTMLDivElement>): number => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1,
    );
    return fraction * lastIndex;
  };

  const step = () => {
    const distance = targetRef.current - currentRef.current;
    if (Math.abs(distance) < 0.001) {
      currentRef.current = targetRef.current;
      render(currentRef.current);
      frameRef.current = null;
      return;
    }
    currentRef.current += distance * FOLLOW_EASING;
    render(currentRef.current);
    frameRef.current = requestAnimationFrame(step);
  };

  const handleStart = (e: React.PointerEvent<HTMLDivElement>) => {
    // Snap on entry/touch-down so the marker doesn't sweep in from wherever it last was
    const position = positionFromEvent(e);
    targetRef.current = position;
    currentRef.current = position;
    render(position);
    setActive(true);
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    targetRef.current = positionFromEvent(e);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      currentRef.current = targetRef.current;
      render(currentRef.current);
      return;
    }
    if (frameRef.current === null)
      frameRef.current = requestAnimationFrame(step);
  };

  // Shared by pointerup, pointerleave and pointercancel: the browser fires
  // pointercancel when it takes over a gesture (e.g. a vertical scroll)
  const handleEnd = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setActive(false);
  };

  return (
    <div
      ref={containerRef}
      data-active="false"
      // flex-1 + min-w-0: take all the space the price block leaves free, and
      // allow shrinking below the SVG's intrinsic size on narrow screens.
      // touch-pan-y: horizontal drags reach our handlers, vertical drags still scroll the page.
      // select-none stops long-press from selecting text or opening the callout menu.
      className="group relative min-w-0 flex-1 touch-pan-y select-none"
      style={{ height: SPARK_HEIGHT }}
      onPointerEnter={handleStart}
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
      onPointerCancel={handleEnd}
    >
      <div
        ref={tipRef}
        className="pointer-events-none absolute bottom-full left-0 mb-1 min-w-20 whitespace-nowrap rounded bg-[#111] px-1.5 py-0.5 text-xs font-medium text-white opacity-0 transition-opacity group-data-[active=true]:opacity-100"
      />
      {/* viewBox matches the measured pixel width, so strokes and the hover dot
          stay undistorted at any size */}
      <svg
        width="100%"
        height={SPARK_HEIGHT}
        viewBox={`0 0 ${width} ${SPARK_HEIGHT}`}
        className={`overflow-visible ${tone}`}
        aria-hidden
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line
          ref={guideRef}
          y1={0}
          y2={SPARK_HEIGHT}
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeDasharray="4 3"
          className="opacity-0 transition-opacity group-data-[active=true]:opacity-100"
        />
        <circle
          ref={dotRef}
          r={2}
          fill="currentColor"
          className="opacity-0 transition-opacity group-data-[active=true]:opacity-100"
        />
      </svg>
    </div>
  );
}
