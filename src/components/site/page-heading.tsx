import { cn } from "@/lib/utils";

export function PageHeading({
  eyebrow,
  title,
  children,
  className,
  as: Tag = "h1",
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-10", className)}>
      <p className="mb-2 text-xs uppercase tracking-[0.4em] text-primary/40">{eyebrow}</p>
      <Tag className="mb-3 text-4xl font-bold text-primary">{title}</Tag>
      {children && <p className="max-w-2xl text-sm text-primary/50">{children}</p>}
    </div>
  );
}
