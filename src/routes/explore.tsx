import { Link, createFileRoute } from '@tanstack/react-router';
import { unique } from 'radashi';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { badgeVariants } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BookSource, db } from '@/db';
import { fromJson } from '@/lib/explore-kind';

export const Route = createFileRoute('/explore')({
  component: Explore,
  loader: () =>
    db.bookSources.filter((source) => source.enabled && source.enabledExplore).toArray(),
});

function Explore() {
  const sources = Route.useLoaderData();

  return (
    <>
      <div className="bg-sidebar border-sidebar-border flex items-center gap-1 border-b p-1">
        <SidebarTrigger />
      </div>
      <ScrollArea className="min-h-0 flex-1" nonce="zAL5psgZTuY_OsFwUDHw0A">
        <Accordion type="single" collapsible>
          {sources.map((source) => (
            <AccordionItem key={source.bookSourceUrl} value={source.bookSourceUrl} className="px-2">
              <AccordionTrigger>{source.bookSourceName}</AccordionTrigger>
              <AccordionContent>
                <ExploreTags source={source} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </>
  );
}

type BookSourceProps = {
  source: BookSource;
};

function ExploreTags(props: BookSourceProps) {
  const { source } = props;
  let kinds = source.exploreUrl && fromJson(source.exploreUrl);

  if (!kinds) {
    return null;
  }

  kinds = unique(kinds, (item) => item.url);

  return (
    <div className="flex flex-wrap gap-2">
      {kinds.map((kind) => (
        <Link
          key={kind.url}
          className={badgeVariants({ variant: 'outline' })}
          to="/explore/$bookSourceUrl"
          params={{ bookSourceUrl: source.bookSourceUrl }}
          search={{ url: kind.url ?? '' }}
        >
          {kind.title.trim()}
        </Link>
      ))}
    </div>
  );
}
