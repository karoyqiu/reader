import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod/v4-mini';

import { getBookContent } from '@/lib/legado';

const searchSchema = z.object({
  url: z.string(),
  title: z.string(),
  index: z.int(),
});

export const Route = createFileRoute('/book')({
  component: RouteComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getBookContent(deps.url, deps.index),
});

function RouteComponent() {
  const content = Route.useLoaderData();
  const { title } = Route.useSearch();
  const lines = content.split('\n');

  return (
    <section className="text-foreground/65 mx-auto max-w-142 space-y-4 p-4 px-8 text-lg/loose">
      <h1 className="text-center text-2xl/32">{title}</h1>
      {lines.map((line) => (
        <p>{line}</p>
      ))}
    </section>
  );
}
