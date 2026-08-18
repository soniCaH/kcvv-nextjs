"use client";

/**
 * PROTOTYPE — #2693. Throwaway. Do not promote to production.
 *
 * Floating variant switcher. Hidden in production builds so a stray merge can
 * never ship it. `←` / `→` cycle, unless a text field has focus.
 */

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  PROTO_VARIANTS,
  PROTO_VARIANT_NAMES,
  useProtoVariant,
} from "./ProtoTournamentRow";

export function PrototypeSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useProtoVariant();

  const go = (delta: number) => {
    const i = PROTO_VARIANTS.indexOf(current);
    const next =
      PROTO_VARIANTS[
        (i + delta + PROTO_VARIANTS.length) % PROTO_VARIANTS.length
      ];
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3 rounded-full bg-fuchsia-600 px-3 py-2 font-mono text-[11px] font-bold tracking-wide text-white shadow-2xl">
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Vorige variant"
        className="px-2 text-base leading-none"
      >
        ‹
      </button>
      <span className="whitespace-nowrap">
        #2693 · {current} — {PROTO_VARIANT_NAMES[current]}
      </span>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Volgende variant"
        className="px-2 text-base leading-none"
      >
        ›
      </button>
    </div>
  );
}
