import { cn } from "@/lib/utils";

export function TerminalWindow({
  title,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-primary/30 bg-[#0d1117] px-4 py-2">
        <span className="size-3 rounded-full bg-red-500/70" />
        <span className="size-3 rounded-full bg-yellow-400/70" />
        <span className="size-3 rounded-full bg-primary/70" />
        <span className="ml-4 text-xs text-primary/40">{title}</span>
      </div>
      <div
        className={cn(
          "scanlines relative overflow-hidden rounded-b-lg border border-primary/30 bg-black p-5 text-left text-sm leading-7",
          bodyClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
