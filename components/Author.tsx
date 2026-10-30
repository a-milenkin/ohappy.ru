"use client";
import { useState } from "react";

// Фото автора лежат в public/author/. Пока файла нет — показываем мягкую заглушку.
const PHOTOS = ["/author/olya-1.webp", "/author/olya-2.webp"];

function Photo({ src, className }: { src: string; className: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`fan-card ${className}`}>
      {ok ? <img src={src} alt="Ольга Гуляева" onError={() => setOk(false)} /> : <span className="fan-ph" aria-hidden>О</span>}
    </div>
  );
}

export default function Author() {
  return (
    <div className="author">
      <div className="fan" aria-hidden={false}>
        <Photo src={PHOTOS[0]} className="fan-left" />
        <Photo src={PHOTOS[1]} className="fan-right" />
        <span className="fan-sticker" aria-hidden>700+ 💝</span>
      </div>
      <div className="author-text">
        <div className="kicker">Автор идеи</div>
        <blockquote>
          «Я верю, что лучший подарок — это когда человек чувствует: о нём помнят, его знают и любят.
          Мои праздники и проекты уже подарили больше 700 людям море счастья, эмоций и тёплых
          воспоминаний. ohappy — про то же самое, только в песне. Дарите близким радость — это проще, чем кажется»
        </blockquote>
        <div className="author-sign">
          <b>Ольга Гуляева</b>
          <span>Автор сервиса и методологии поздравлений · мама двух сыновей · основательница Карамельной мастерской Деда Мороза</span>
        </div>
      </div>
    </div>
  );
}
