import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod/v4-mini';

import { BookSidebar } from '@/components/book-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getBookContent, getChapterList } from '@/lib/legado';

const searchSchema = z.object({
  bookUrl: z.string(),
  bookTitle: z.string(),
  index: z.int(),
});

export const Route = createFileRoute('/book')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    Promise.all([getChapterList(deps.bookUrl), getBookContent(deps.bookUrl, deps.index)]),
});

function RouteComponent() {
  const { bookUrl, bookTitle, index } = Route.useSearch();
  const [chapters, content] = Route.useLoaderData();
  const chapter = chapters.find((ch) => ch.index === index);
  const lines = content.split('\n');

  return (
    <SidebarProvider>
      <BookSidebar {...{ bookUrl, bookTitle, chapters }} />
      <section className="text-foreground/65 mx-auto max-w-142 space-y-4 p-4 px-8 text-lg/loose">
        <h1 className="text-center text-2xl/32">{chapter?.title}</h1>
        {lines.map((line) => (
          <p>{line}</p>
        ))}
      </section>
    </SidebarProvider>
  );
}
