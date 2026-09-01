import { Fragment } from "react";
import { cn } from "@/lib/utils/cn";
import {
  MonoLabel,
  type MonoLabelProps,
  type MonoLabelTone,
} from "../MonoLabel";

export type MonoLabelRowDivider = "·" | "|" | "/" | "★";
export type MonoLabelRowAs = "div" | "ol" | "ul";

export interface MonoLabelRowItem {
  label: string;
  variant?: MonoLabelProps["variant"];
  size?: MonoLabelProps["size"];
}

export interface MonoLabelRowProps {
  items: MonoLabelRowItem[];
  divider?: MonoLabelRowDivider;
  as?: MonoLabelRowAs;
  wrap?: boolean;
  /**
   * Text tone applied to every `plain`-variant item and to the divider —
   * forwarded to each `<MonoLabel>` (pill variants ignore it, same as
   * `MonoLabel` itself). Defaults to "ink" (readable on cream/paper). Pass
   * "cream" on a dark card (e.g. `<PullQuote placement="section">`'s
   * context-label slot) so the row stays readable.
   */
  tone?: MonoLabelTone;
  className?: string;
}

const DIVIDER_DOT_CLASS: Record<MonoLabelTone, string> = {
  ink: "bg-ink-muted/60",
  muted: "bg-ink-muted/60",
  cream: "bg-cream/60",
};

const DIVIDER_GLYPH_CLASS: Record<MonoLabelTone, string> = {
  ink: "text-ink-muted",
  muted: "text-ink-muted",
  cream: "text-cream",
};

export function MonoLabelRow({
  items,
  divider = "·",
  as: Tag = "div",
  wrap = true,
  tone = "ink",
  className,
}: MonoLabelRowProps) {
  if (items.length === 0) return null;

  const isList = Tag === "ol" || Tag === "ul";

  return (
    <Tag
      data-divider-glyph={divider}
      className={cn(
        "flex items-center gap-2",
        wrap && "flex-wrap",
        isList && "list-none",
        className,
      )}
    >
      {items.map((item, index) => {
        const label = (
          <MonoLabel
            variant={item.variant ?? "plain"}
            size={item.size ?? "sm"}
            tone={tone}
          >
            {item.label}
          </MonoLabel>
        );
        const dividerEl =
          index < items.length - 1 ? (
            divider === "·" ? (
              <span
                data-divider="true"
                data-divider-glyph={divider}
                aria-hidden="true"
                className={cn(
                  "inline-block h-[3px] w-[3px] rounded-full",
                  DIVIDER_DOT_CLASS[tone],
                )}
              />
            ) : (
              <span
                data-divider="true"
                data-divider-glyph={divider}
                aria-hidden="true"
                className={cn(
                  "text-label font-mono leading-none",
                  DIVIDER_GLYPH_CLASS[tone],
                )}
              >
                {divider}
              </span>
            )
          ) : null;
        return isList ? (
          // <ol>/<ul> requires <li> direct children. Pack the label AND its
          // following divider inside the same <li> so list semantics stay
          // valid — divider <span>s as direct children of <ol>/<ul> would be
          // invalid HTML.
          <li key={index} className="inline-flex list-none items-center gap-2">
            {label}
            {dividerEl}
          </li>
        ) : (
          // Non-list mode: MonoLabel is a direct flex child of the row.
          <Fragment key={index}>
            {label}
            {dividerEl}
          </Fragment>
        );
      })}
    </Tag>
  );
}
