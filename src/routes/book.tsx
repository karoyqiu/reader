import { Link, createFileRoute } from '@tanstack/react-router';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect } from 'react';
import { z } from 'zod/v4-mini';

import { BookSidebar } from '@/components/book-sidebar';
import { buttonVariants } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
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
      <div className="w-full">
        <ButtonGroup className="fixed m-1" orientation="vertical">
          <SidebarTrigger variant="outline" size="icon" />
          {chapters.length > 1 && index > 0 && (
            <Link
              className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'grow')}
              to="/book"
              search={{ bookUrl, bookTitle, author, index: index - 1 }}
              hash="top"
            >
              <ChevronLeftIcon />
            </Link>
          )}
          {chapters.length > 1 && index < chapters.length - 1 && (
            <Link
              className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'grow')}
              to="/book"
              search={{ bookUrl, bookTitle, author, index: index + 1 }}
              hash="top"
            >
              <ChevronRightIcon />
            </Link>
          )}
        </ButtonGroup>
        <section
          id="top"
          className="text-foreground/65 mx-auto flex max-w-142 flex-col space-y-4 p-8 pb-32 text-lg/loose"
        >
          <h1 className="text-center text-2xl/32">{chapter?.title}</h1>
          {lines.map((line) => (
            <p>{line}</p>
          ))}
        </section>
      </div>
    </SidebarProvider>
  );
}
