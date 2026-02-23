"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="shrink-0 px-5 py-2.5 bg-white text-green-main font-semibold rounded-lg hover:bg-gray-50 transition-colors print:hidden"
    >
      Afdrukken
    </button>
  );
}
