"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LEGAL, PARTNER } from "@/lib/legal";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="ohappy — на главную">
      <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff5d8f" />
            <stop offset="1" stopColor="#c4124f" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill="url(#lg)" />
        <path d="M16 7.5c.6 3.9 2.1 5.4 6 6-3.9.6-5.4 2.1-6 6-.6-3.9-2.1-5.4-6-6 3.9-.6 5.4-2.1 6-6z" fill="#fff" />
        <circle cx="22.5" cy="22" r="1.6" fill="#ffd28a" />
      </svg>
      ohappy
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap">
        <Logo />
        <nav className="nav" aria-label="Разделы">
          <Link href="/#create">Песни</Link>
          <Link href="/#soon">Стихи <span className="soon">скоро</span></Link>
          <Link href="/#soon">Персонажи <span className="soon">скоро</span></Link>
          <Link href="/#reviews">Отзывы</Link>
          <Link href="/#faq">Вопросы</Link>
        </nav>
        <div className="header-cta" style={{ display: "flex", gap: 8 }}>
          <Link href="/songs" className="btn btn-text btn-sm">Мои песни</Link>
          <Link href="/#create" className="btn btn-primary btn-sm">Создать песню</Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div>
          <Logo />
          <p style={{ marginTop: 12, maxWidth: 320 }}>Персональные песни-поздравления по вашей истории. Слушать — бесплатно, платите, только если понравилось.</p>
        </div>
        <div>
          <h4>Продавец</h4>
          <p>{LEGAL.name}</p>
          <p>ИНН {LEGAL.inn}</p>
          <p>ОГРНИП {LEGAL.ogrnip}</p>
          <p>{LEGAL.address}</p>
        </div>
        <div>
          <h4>Связь</h4>
          <p><a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a></p>
          <p><a href={`tel:${LEGAL.phone.replace(/[^+\d]/g, "")}`}>{LEGAL.phone}</a></p>
          <p style={{ marginTop: 14 }}><a href={PARTNER.url} target="_blank" rel="noopener">{PARTNER.title} ↗</a></p>
          <p style={{ marginTop: 14 }}>© {new Date().getFullYear()} ohappy.ru</p>
        </div>
      </div>
    </footer>
  );
}
