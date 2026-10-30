"use client";
import { OCCASIONS } from "@/lib/options";

// Клик по поводу подставляет его в форму и прокручивает к ней.
export default function OccasionChips() {
  return (
    <div className="occasions">
      {OCCASIONS.map((o) => (
        <button key={o.value} className="chip" onClick={() => {
          window.dispatchEvent(new CustomEvent("ohappy:preset", { detail: { occasion: o.value } }));
          document.getElementById("create")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}>
          <span aria-hidden>{o.emoji}</span>{o.label}
        </button>
      ))}
    </div>
  );
}
