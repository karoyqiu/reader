import { Link, createFileRoute } from '@tanstack/react-router';
import { ChevronLeftIcon, ChevronRightIcon, LibraryIcon, SpeechIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod/v4-mini';

import { BookSidebar } from '@/components/book-sidebar';
import { Button, buttonVariants } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { textToSpeech } from '@/lib/cosyvoice';
import { getBookContent, getChapterList, saveBookProgress } from '@/lib/legado';
import { cn } from '@/lib/utils';

const searchSchema = z.object({
  bookUrl: z.string(),
  bookTitle: z.string(),
  author: z.string(),
  index: z.int(),
});
const ctx = new AudioContext();
let audioSource: AudioBufferSourceNode | null = null;

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
  const lines = content.split('\n');

  const speak = useCallback(async () => {
    if (speaking) {
      audioSource?.stop();
      audioSource = null;
      setSpeaking(false);
    } else {
      try {
        setVoiceReady(false);
        const data = await textToSpeech(lines[0]);
        console.log('float32', data.length);
        setVoiceReady(true);

        const buffer = ctx.createBuffer(1, data.length, 24000);
        buffer.copyToChannel(data, 0);

        audioSource = ctx.createBufferSource();
        audioSource.buffer = buffer;
        audioSource.connect(ctx.destination);
        audioSource.addEventListener('ended', () => setSpeaking(false));
        audioSource.start();
        setSpeaking(true);
      } catch (e) {
        console.error('Failed to speak', e);
      }
    }

    setVoiceReady(true);
  }, [speaking, content]);

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
