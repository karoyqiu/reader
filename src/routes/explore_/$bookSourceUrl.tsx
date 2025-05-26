import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod/v4-mini';

import { db } from '@/db';
import UrlAnalyzer from '@/lib/url-analyzer';

const exploreSearchSchema = z.object({
  url: z.string(),
});

export const Route = createFileRoute('/explore_/$bookSourceUrl')({
  component: RouteComponent,
  validateSearch: (search) => exploreSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async (ctx) => {
    const source = await db.bookSources.get(ctx.params.bookSourceUrl);
    const url = new UrlAnalyzer({
      url: ctx.deps.url,
      baseUrl: ctx.params.bookSourceUrl,
      source,
      page: 1,
    });
    const resp = await url.getResponse();
    return resp.text();
  },
});

function RouteComponent() {
  const { bookSourceUrl } = Route.useParams();
  const { url } = Route.useSearch();
  const text = Route.useLoaderData();

  return (
    <div>
      {`Hello "/explore/${bookSourceUrl}"! ${url}`}
      <br />
      <code>{text}</code>
    </div>
  );
}
