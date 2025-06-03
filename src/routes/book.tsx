import { Link, createFileRoute } from '@tanstack/react-router';
import { ChevronLeftIcon, ChevronRightIcon, LibraryIcon, PlayIcon, SpeechIcon } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { z } from 'zod/v4-mini';

import { BookSidebar } from '@/components/book-sidebar';
import ErrorComponent from '@/components/error-component';
import { LoadingComponent } from '@/components/loading-component';
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
  errorComponent: ErrorComponent,
  pendingComponent: LoadingComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    Promise.all([getChapterList(deps.bookUrl), getBookContent(deps.bookUrl, deps.index)]),
});

function Book() {
  const { bookUrl, bookTitle, author, index } = Route.useSearch();
  const [chapters, content] = Route.useLoaderData();
  const [voiceReady, setVoiceReady] = useState(true);
  const [current, setCurrent] = useState(-1);
  const [offset, setOffset] = useState(0);
  const speaking = current + offset;
  const chapter = chapters.find((ch) => ch.index === index);
  const lines = useMemo(() => content.split('\n'), [content]);
  const id = useId();

  const speak = async (startFrom = 0) => {
    if (voice.isPlaying) {
      await voice.stop();
    } else {
      setVoiceReady(false);
      setOffset(startFrom);
      setCurrent(0);

      const toRead = [chapter?.title ?? '', ...lines];
      toRead.splice(0, startFrom);
      await voice.speak(toRead).catch(console.error);
    }

    setVoiceReady(true);
    setCurrent(-1);
    setOffset(0);
  };

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
    const onPlaying = (index: number) => {
      setVoiceReady(true);
      setCurrent(index);

      const p = document.querySelector(`#${id}${index + offset}`);

      if (p) {
        p.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    };

    voice.addListener('playing', onPlaying);
    return () => {
      voice.removeListener('playing', onPlaying);
    };
  }, [id, offset]);

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
            variant={current >= 0 ? 'default' : 'outline'}
            size="icon"
            disabled={!voiceReady}
            onClick={() => speak()}
          >
            <SpeechIcon />
          </Button>
        </ButtonGroup>
        <section
          id="top"
          className="text-foreground/65 mx-auto flex max-w-142 flex-col space-y-4 pt-8 pb-32 text-lg/loose"
        >
          <h1
            id={`${id}0`}
            className={cn(
              'rounded px-2 text-center text-2xl/32 transition-colors duration-500',
              speaking === 0 && 'bg-accent text-accent-foreground',
            )}
          >
            {chapter?.title}
          </h1>
          {lines.map((line, index) => (
            <p
              id={`${id}${index + 1}`}
              key={`${id}${index + 1}`}
              className={cn(
                'group relative rounded px-2 transition-colors duration-500',
                speaking === index + 1 && 'bg-accent text-accent-foreground',
              )}
            >
              {line}
              {current === -1 && (
                <Button
                  className="absolute top-0 -left-8 hidden group-hover:flex"
                  variant="ghost"
                  size="icon"
                  onClick={() => speak(index + 1)}
                >
                  <PlayIcon />
                </Button>
              )}
            </p>
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
