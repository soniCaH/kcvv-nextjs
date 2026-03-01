"use client";

/**
 * PrintDate — renders the current date at browser/print time.
 * Must be a client component so it's not frozen to the ISR build timestamp.
 */
export function PrintDate() {
  return (
    <>
      {new Date().toLocaleDateString("nl-BE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </>
  );
}
