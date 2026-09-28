"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary/40">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-bold text-primary">{title}</h1>
        {desc && <p className="mt-1 text-sm text-primary/50">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-lg border border-primary/15 bg-card p-5", className)} {...props} />;
}

export function PanelTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-sm uppercase tracking-widest text-primary", className)} {...props} />;
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-[0.65rem] uppercase tracking-[0.15em] text-primary/50">
        {label} {hint && <span className="normal-case tracking-normal text-primary/30">— {hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function DeleteButton({ onClick, title = "Delete" }: { onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex size-8 shrink-0 items-center justify-center rounded-md border border-red-400/30 text-red-400/70 transition-colors hover:border-red-400 hover:bg-red-400/10 hover:text-red-400"
    >
      <X className="size-4" />
    </button>
  );
}

/** Comma-separated input that keeps the raw text while typing. */
export function CommaListInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [raw, setRaw] = useState(value.join(", "));
  useEffect(() => {
    const parsed = raw.split(",").map((t) => t.trim()).filter(Boolean);
    if (parsed.join("|") !== value.join("|")) setRaw(value.join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <Input
      value={raw}
      placeholder={placeholder}
      className={className}
      onChange={(e) => {
        setRaw(e.target.value);
        onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean));
      }}
    />
  );
}
