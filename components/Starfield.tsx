"use client";
import { useEffect, useRef } from "react";

// Мерцающие звёзды и редкие падающие звёзды на светлом «розовом космосе».
const COLORS = ["#ff8fb1", "#ffb3c9", "#c9b2ff", "#ffc56b", "#ffffff", "#f06a98"];

type Star = { x: number; y: number; r: number; c: string; p: number; s: number; cross: boolean };
type Comet = { x: number; y: number; vx: number; vy: number; life: number };

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let comets: Comet[] = [];
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        p: Math.random() * Math.PI * 2,
        s: 0.6 + Math.random() * 1.6,
        cross: Math.random() < 0.09,
      }));
    };

    const drawStar = (st: Star, a: number) => {
      ctx.globalAlpha = a;
      ctx.fillStyle = st.c;
      if (st.cross) {
        // Четырёхлучевая «искра»
        const R = st.r * 4.2;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y - R);
        ctx.quadraticCurveTo(st.x, st.y, st.x + R, st.y);
        ctx.quadraticCurveTo(st.x, st.y, st.x, st.y + R);
        ctx.quadraticCurveTo(st.x, st.y, st.x - R, st.y);
        ctx.quadraticCurveTo(st.x, st.y, st.x, st.y - R);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        const a = reduce ? 0.7 : 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(st.p + (t / 1000) * st.s));
        drawStar(st, a);
      }
      if (!reduce && Math.random() < 0.004 && comets.length < 2) {
        comets.push({ x: Math.random() * w * 0.8, y: Math.random() * h * 0.4, vx: 7 + Math.random() * 4, vy: 3 + Math.random() * 2, life: 1 });
      }
      comets = comets.filter((c) => c.life > 0);
      for (const c of comets) {
        const g = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 14, c.y - c.vy * 14);
        g.addColorStop(0, "rgba(240,48,111,0.9)");
        g.addColorStop(1, "rgba(240,48,111,0)");
        ctx.globalAlpha = c.life;
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x - c.vx * 14, c.y - c.vy * 14);
        ctx.stroke();
        c.x += c.vx;
        c.y += c.vy;
        c.life -= 0.012;
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="sky" aria-hidden>
      <div className="nebula n1" />
      <div className="nebula n2" />
      <div className="nebula n3" />
      <canvas ref={ref} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
