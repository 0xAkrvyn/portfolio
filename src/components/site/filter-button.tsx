import { cn } from "@/lib/utils";

export function FilterButton({
  active,
  className,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      data-active={active}
      className={cn(
        "cursor-pointer border border-primary/25 px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-primary/70 transition-colors hover:border-primary hover:text-primary",
        "data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
        className
      )}
      {...props}
    />
  );
}
