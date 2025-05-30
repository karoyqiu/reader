import { Link, createFileRoute } from '@tanstack/react-router';
import { ChevronLeftIcon, ChevronRightIcon, LibraryIcon, SpeechIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod/v4-mini';

import { BookSidebar } from '@/components/book-sidebar';
import { Button, buttonVariants } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getBookContent, getChapterList, saveBookProgress } from '@/lib/legado';
import EdgeTTS from '@/lib/speak/edgetts';
import { cn } from '@/lib/utils';

const searchSchema = z.object({
  bookUrl: z.string(),
  bookTitle: z.string(),
  author: z.string(),
  index: z.int(),
});
const voice = new EdgeTTS();

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
  const [voiceReady, setVoiceReady] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const chapter = chapters.find((ch) => ch.index === index);
  const lines = useMemo(() => content.split('\n'), [content]);

  const speak = useCallback(async () => {
    if (voice.isPlaying) {
      voice.stop();
    } else {
      setVoiceReady(false);
      voice.speak(lines).catch(console.error);
    }
  }, [lines]);

  useEffect(() => {
    saveBookProgress({
      name: bookTitle,
      author,
      durChapterIndex: index,
      durChapterTitle: chapter?.title,
      durChapterTime: Date.now(),
    }).catch(console.error);
  });

  useEffect(() => {
    voice.addListener('playing', () => {
      setVoiceReady(true);
      setSpeaking(true);
    });
    voice.addListener('stopped', () => {
      setVoiceReady(true);
      setSpeaking(false);
    });
  }, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <BookSidebar {...{ bookUrl, bookTitle, author, chapters }} />
      <div className="w-full">
        <ButtonGroup className="fixed m-1" orientation="vertical">
          <SidebarTrigger variant="outline" size="icon" />
          <Link className={buttonVariants({ variant: 'outline', size: 'icon' })} to="/">
            <LibraryIcon />
          </Link>
          {chapters.length > 1 && index > 0 && (
            <Link
              className={buttonVariants({ variant: 'outline', size: 'icon' })}
              to="/book"
              search={{ bookUrl, bookTitle, author, index: index - 1 }}
              hash="top"
            >
              <ChevronLeftIcon />
            </Link>
          )}
          {chapters.length > 1 && index < chapters.length - 1 && (
            <Link
              className={buttonVariants({ variant: 'outline', size: 'icon' })}
              to="/book"
              search={{ bookUrl, bookTitle, author, index: index + 1 }}
              hash="top"
            >
              <ChevronRightIcon />
            </Link>
          )}
          <Button
            variant={speaking ? 'default' : 'outline'}
            size="icon"
            disabled={!voiceReady}
            onClick={speak}
          >
            <SpeechIcon />
          </Button>
        </ButtonGroup>
        <section
          id="top"
          className="text-foreground/65 mx-auto flex max-w-142 flex-col space-y-4 pt-8 pb-32 text-lg/loose"
        >
          <h1 className="text-center text-2xl/32">{chapter?.title}</h1>
          {lines.map((line) => (
            <p>{line}</p>
          ))}
          {chapters.length > 1 && index < chapters.length - 1 && (
            <Link
              className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'mt-8 w-full')}
              to="/book"
              search={{ bookUrl, bookTitle, author, index: index + 1 }}
              hash="top"
            >
              {chapters[index + 1].title}
              <ChevronRightIcon />
            </Link>
          )}
        </section>
      </div>
    </SidebarProvider>
  );
}
