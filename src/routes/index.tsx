import { createFileRoute } from '@tanstack/react-router';

import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Time } from '@/components/ui/time';
import { getBookshelf } from '@/lib/legado';

export const Route = createFileRoute('/')({
  component: Bookshelf,
  loader: () => getBookshelf(),
});

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
          <a key={book.bookUrl} href="#">
            <article className="bg-card text-card-foreground flex overflow-clip rounded-xl border shadow-sm">
              <img src={book.coverUrl} className="h-40 w-30" />
              <div className="flex flex-col gap-2 p-4">
                <header>
                  <h1 className="text-lg font-bold">{book.name}</h1>
                  <address>{book.author}</address>
                </header>
                <section className="text-muted-foreground text-xs">
                  <p>{`${book.totalChapterNum} chapters`}</p>
                  {book.lastCheckTime && (
                    <p>
                      Last checked at: <Time milliseconds={book.lastCheckTime} />
                    </p>
                  )}
                  {book.durChapterTitle && <p>{`Last read chapter: ${book.durChapterTitle}`}</p>}
                  {book.latestChapterTitle && (
                    <p>
                      {`Latest chapter: ${book.latestChapterTitle}`}{' '}
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
          </a>
        ))}
      </div>
    </>
  );
}
