import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  lang: string;
  t: { previousPage: string; nextPage: string };
}

function pageHref(lang: string, page: number) {
  return page === 1 ? `/${lang}/blog` : `/${lang}/blog?page=${page}`;
}

function buildPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '…')[] = [1];

  if (current > 3) pages.push('…');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('…');

  pages.push(total);
  return pages;
}

export function BlogPagination({ currentPage, totalPages, lang, t }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-center gap-1 mt-12"
    >
      {currentPage > 1 ? (
        <Link href={pageHref(lang, currentPage - 1)}>
          <Button variant="outline" size="sm" className="gap-1">
            <ChevronLeft className="w-4 h-4" />
            {t.previousPage}
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" className="gap-1 opacity-40 cursor-not-allowed" disabled>
          <ChevronLeft className="w-4 h-4" />
          {t.previousPage}
        </Button>
      )}

      <div className="flex items-center gap-1 mx-2">
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm select-none">
              …
            </span>
          ) : (
            <Link key={p} href={pageHref(lang, p)}>
              <Button
                variant={p === currentPage ? 'default' : 'ghost'}
                size="sm"
                className="w-9 h-9 p-0"
                aria-current={p === currentPage ? 'page' : undefined}
              >
                {p}
              </Button>
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link href={pageHref(lang, currentPage + 1)}>
          <Button variant="outline" size="sm" className="gap-1">
            {t.nextPage}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" className="gap-1 opacity-40 cursor-not-allowed" disabled>
          {t.nextPage}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </nav>
  );
}
