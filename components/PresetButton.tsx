"use client";

// Кнопка, которая заполняет форму готовыми настройками и прокручивает к ней.
export default function PresetButton({ preset, className, children }: { preset: Record<string, string>; className?: string; children: React.ReactNode }) {
  return (
    <button className={className} onClick={() => {
      window.dispatchEvent(new CustomEvent("ohappy:preset", { detail: preset }));
      document.getElementById("create")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }}>
      {children}
    </button>
  );
}
