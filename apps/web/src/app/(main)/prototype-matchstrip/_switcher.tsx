"use client";

/** PROTOTYPE — throwaway, issue #2387. Delete before the PR. */

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function PrototypeSwitcher({
  variants,
  current,
  label,
  cases,
  currentCase,
}: {
  variants: string[];
  current: string;
  label: string;
  cases: { key: string; label: string }[];
  currentCase: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const go = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      next.set(key, value);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const cycle = useCallback(
    (delta: number) => {
      const i = variants.indexOf(current);
      const nextIndex = (i + delta + variants.length) % variants.length;
      go("variant", variants[nextIndex] ?? variants[0] ?? "A");
    },
    [current, go, variants],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") cycle(-1);
      if (e.key === "ArrowRight") cycle(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycle]);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="border-cream/30 bg-ink text-cream flex max-w-full flex-col gap-2 border-2 p-2 shadow-[6px_6px_0_0_#6b6b6b]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => cycle(-1)}
            aria-label="Vorige variant"
            className="border-cream/40 hover:bg-cream hover:text-ink border px-3 py-2 font-mono text-sm"
          >
            ←
          </button>
          <span className="min-w-0 flex-1 truncate px-2 font-mono text-xs tracking-wider uppercase">
            {current} — {label}
          </span>
          <button
            type="button"
            onClick={() => cycle(1)}
            aria-label="Volgende variant"
            className="border-cream/40 hover:bg-cream hover:text-ink border px-3 py-2 font-mono text-sm"
          >
            →
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {cases.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => go("case", c.key)}
              className={
                c.key === currentCase
                  ? "bg-cream text-ink border-cream border px-2 py-1 font-mono text-[10px] tracking-wider uppercase"
                  : "border-cream/40 hover:bg-cream/20 border px-2 py-1 font-mono text-[10px] tracking-wider uppercase"
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
