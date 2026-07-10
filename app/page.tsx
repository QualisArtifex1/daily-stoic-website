"use client";

import { useEffect, useMemo, useState } from "react";
import quotes from "./quotes.json";

type Quote = (typeof quotes)[number];

const palettes = [
  ["#ff5f6d", "#7b2cbf", "#18063d"],
  ["#ff7a18", "#af002d", "#32004f"],
  ["#00b4d8", "#4361ee", "#3a0ca3"],
  ["#06d6a0", "#087f8c", "#5e2b97"],
  ["#f72585", "#7209b7", "#3a0ca3"],
  ["#ffb703", "#fb5607", "#8338ec"],
  ["#2ec4b6", "#0077b6", "#6a4c93"],
  ["#e63946", "#9d4edd", "#1d3557"],
] as const;

function getQuoteForDate(date: Date): Quote {
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  return quotes.find((item) => item.month === month && item.day === day) ?? quotes[0];
}

export default function Home() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setToday(new Date());
    const interval = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const dailyQuote = useMemo(() => getQuoteForDate(today), [today]);
  const palette = palettes[(dailyQuote.dayNumber - 1) % palettes.length];
  const quoteLength = dailyQuote.quote.length;
  const sizeClass = quoteLength > 430 ? "quote--long" : quoteLength > 260 ? "quote--medium" : "";

  return (
    <main
      className="quote-page"
      style={{
        "--color-one": palette[0],
        "--color-two": palette[1],
        "--color-three": palette[2],
      } as React.CSSProperties}
    >
      <article className="quote-card" aria-label={`Daily Stoic quote for ${dailyQuote.date}`}>
        <blockquote className={`quote ${sizeClass}`}>
          <span aria-hidden="true">“</span>{dailyQuote.quote}<span aria-hidden="true">”</span>
        </blockquote>
        <p className="attribution">
          <span className="author">{dailyQuote.author}</span>
          <span aria-hidden="true"> · </span>
          <cite>{dailyQuote.work}</cite>
          <span aria-hidden="true"> · </span>
          <time>{dailyQuote.date}</time>
          <span aria-hidden="true"> · </span>
          <span>{dailyQuote.title}</span>
        </p>
      </article>
    </main>
  );
}
