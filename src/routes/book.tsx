import { Link, createFileRoute } from '@tanstack/react-router';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect } from 'react';
import { z } from 'zod/v4-mini';

import { BookSidebar } from '@/components/book-sidebar';
import { buttonVariants } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getBookContent, getChapterList, saveBookProgress } from '@/lib/legado';
import { cn } from '@/lib/utils';

const searchSchema = z.object({
  bookUrl: z.string(),
  bookTitle: z.string(),
  author: z.string(),
  index: z.int(),
});

export const Route = createFileRoute('/book')({
  component: Book,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    Promise.all([getChapterList(deps.bookUrl), getBookContent(deps.bookUrl, deps.index)]),
});

function Book() {
  const { bookUrl, bookTitle, author, index } = Route.useSearch();
  const [chapters, content] = Route.useLoaderData();
  const chapter = chapters.find((ch) => ch.index === index);
  const lines = content.split('\n');

  useEffect(() => {
    saveBookProgress({
      name: bookTitle,
      author,
      durChapterIndex: index,
      durChapterTitle: chapter?.title,
      durChapterTime: Date.now(),
    }).catch(console.error);
  });

  return (
    <SidebarProvider>
      <BookSidebar {...{ bookUrl, bookTitle, author, chapters }} />
      <SidebarTrigger />
      <div id="top" className="mx-auto flex max-w-142 flex-col p-8">
        <section className="text-foreground/65 space-y-4 text-lg/loose">
          <h1 className="text-center text-2xl/32">{chapter?.title}</h1>
          {lines.map((line) => (
            <p>{line}</p>
          ))}
        </section>
        <footer className="flex gap-4 pt-16 pb-4">
          {chapters.length > 1 && index > 0 && (
            <Link
              className={cn(buttonVariants({ variant: 'secondary' }), 'grow')}
              to="/book"
              search={{ bookUrl, bookTitle, author, index: index + 1 }}
              hash="top"
            >
              <ChevronLeftIcon />
              {chapters[index - 1].title}
            </Link>
          )}
          <a className={buttonVariants({ variant: 'secondary' })} href="#top">
            Back to top
          </a>
          {chapters.length > 1 && index < chapters.length - 1 && (
            <Link
              className={cn(buttonVariants({ variant: 'secondary' }), 'grow')}
              to="/book"
              search={{ bookUrl, bookTitle, author, index: index + 1 }}
              hash="top"
            >
              {chapters[index + 1].title}
              <ChevronRightIcon />
            </Link>
          )}
        </footer>
      </div>
    </SidebarProvider>
  );
}
