"use client";
import { useEffect } from "react";
import { QUALITIES, type Quality } from "@/lib/options";

// Скачивание MP3 — только для зарегистрированных с кредитами.
// Вход через Яндекс и оплата ЮKassa подключаются на втором этапе.
export default function Paywall({ quality, onClose }: { quality: Quality; onClose: () => void }) {
  const price = QUALITIES.find((q) => q.value === quality)?.price ?? 290;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pw-title" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Закрыть">×</button>
        <div className="kicker" style={{ marginBottom: 0 }}>Понравилась песня?</div>
        <h3 id="pw-title">Скачайте MP3 за {price} ₽</h3>
        <p>Слушать и делиться ссылкой можно бесплатно всегда. Чтобы скачать файл, войдите через Яндекс — песня сохранится в вашем аккаунте.</p>
        <div className="stack">
          <button className="btn btn-yandex" disabled title="Скоро">
            <span className="yandex-y">Я</span>Войти с Яндекс ID
          </button>
          <button className="btn btn-primary" disabled title="Скоро">Оплатить {price} ₽</button>
        </div>
        <p style={{ fontSize: 13, marginTop: 14, marginBottom: 0, textAlign: "center" }}>
          Вход и оплата откроются совсем скоро. А пока — отправьте ссылку, она работает уже сейчас 💝
        </p>
      </div>
    </div>
  );
}
