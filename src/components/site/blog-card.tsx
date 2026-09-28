import { categoryLabel, estimateReadTime, formatDate } from "@/lib/helpers";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBadge({ category }: { category: BlogPost["category"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]",
        category === "support"
          ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
          : "border-primary/40 bg-primary/10 text-primary"
      )}
    >
      {categoryLabel(category)}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-sm bg-primary/5 px-1.5 py-0.5 text-[11px] text-primary/60">#{children}</span>;
}

export function Cover({ post, className, brand }: { post: BlogPost; className?: string; brand: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)}>
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="scanlines flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgb(0_255_156/0.15),transparent_60%)]">
          <span className="text-lg tracking-[0.4em] text-primary/30">{brand}</span>
        </div>
      )}
    </div>
  );
}

export function BlogCard({ post, brand, onOpen }: { post: BlogPost; brand: string; onOpen: () => void }) {
  return (
    <article
      onClick={onOpen}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-primary/20 bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:glow"
    >
      <Cover post={post} brand={brand} className="aspect-video" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={post.category} />
          <span className="text-[11px] text-primary/40">{formatDate(post.date)}</span>
        </div>
        <h3 className="text-lg font-bold leading-snug text-white group-hover:text-primary">{post.title}</h3>
        <p className="line-clamp-3 flex-1 text-sm leading-6 text-primary/60">{post.excerpt || post.content}</p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-primary/10 pt-3 text-xs">
          <span className="text-primary/40">{estimateReadTime(post.content || post.excerpt)}</span>
          <span className="text-primary/60 transition-transform group-hover:translate-x-1 group-hover:text-primary">Read →</span>
        </div>
      </div>
    </article>
  );
}
