import { Link, createFileRoute } from '@tanstack/react-router';
import { CompassIcon, HistoryIcon, RefreshCcwIcon, UserIcon } from 'lucide-react';
import { isNullish } from 'radashi';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Time } from '@/components/ui/time';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getBookshelf } from '@/lib/legado';
import type { Book } from '@/lib/legado/book';

export const Route = createFileRoute('/')({
  component: Bookshelf,
  loader: () => getBookshelf(),
});

const calcRemainingChapters = (book: Book) => {
  if (!book.totalChapterNum) {
    return null;
  }

  const hasRead = isNullish(book.durChapterIndex) ? 0 : book.durChapterIndex + 1;
  return book.totalChapterNum - hasRead;
};

function Bookshelf() {
  const books = Route.useLoaderData();

  return (
    <>
      <div className="bg-sidebar border-sidebar-border flex items-center gap-1 border-b p-1">
        <SidebarTrigger />
        <search>
          <Input type="search" placeholder="Search for books" />
        </search>
      </div>
      <div className="flex flex-wrap p-4">
        {books.map((book) => (
          <Link
            key={book.bookUrl}
            to="/book"
            search={{
              url: book.bookUrl,
              title: book.durChapterTitle ?? '',
              index: book.durChapterIndex ?? 0,
            }}
          >
            <article className="bg-card text-card-foreground flex overflow-clip rounded-xl border shadow-sm">
              <img src={book.coverUrl} className="h-40 w-30" />
              <div className="flex flex-col gap-2 p-4">
                <header>
                  <div className="flex items-center">
                    <h1 className="flex-1 text-lg font-bold">{book.name}</h1>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline">{calcRemainingChapters(book)}</Badge>
                      </TooltipTrigger>
                      <TooltipContent>Total {book.totalChapterNum} chapters</TooltipContent>
                    </Tooltip>
                  </div>
                  <address className="flex items-center gap-1">
                    <UserIcon size="1em" />
                    {book.author}
                  </address>
                </header>
                <section className="text-muted-foreground flex flex-col gap-1 text-xs">
                  {book.lastCheckTime && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="flex items-center gap-1">
                          <RefreshCcwIcon size="1em" />
                          <Time milliseconds={book.lastCheckTime} />
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        Last check time: {new Date(book.lastCheckTime).toLocaleString()}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {book.durChapterTitle && (
                    <p className="flex items-center gap-1">
                      <HistoryIcon size="1em" />
                      {book.durChapterTitle}
                    </p>
                  )}
                  {book.latestChapterTitle && (
                    <p className="flex items-center gap-1">
                      <CompassIcon size="1em" />
                      {book.latestChapterTitle}
                      {book.latestChapterTime && (
                        <>
                          , <Time milliseconds={book.latestChapterTime} />
                        </>
                      )}
                    </p>
                  )}
                </section>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}
