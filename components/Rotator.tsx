"use client";
import { useEffect, useState } from "react";

// Кому чаще всего дарят песни — по кругу в заголовке.
const WHO = [
  "про неё",
  "про него",
  "про маму",
  "про лучшего друга",
  "про бабушку",
  "про мужа",
  "про вас двоих",
  "про сына",
  "про подругу",
  "про дедушку",
  "про дочку",
  "про начальника",
  "про всю семью",
];

export default function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % WHO.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <em className="rotator" aria-live="off">
      <span key={i}>{WHO[i]}</span>
    </em>
  );
}
