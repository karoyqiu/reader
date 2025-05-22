import { createFileRoute } from '@tanstack/react-router';
import { useLiveQuery } from 'dexie-react-hooks';
import { ImportIcon, PlusIcon } from 'lucide-react';
import { toggle } from 'radashi';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { UrlInputBox } from '@/components/url-input-box';
import { db } from '@/db';
import { importBookSource } from '@/lib/actions/importBookSource';

export const Route = createFileRoute('/subscription')({
  component: Subscription,
});

function Subscription() {
  const sources = useLiveQuery(() => db.bookSources.toArray()) ?? [];
  const [checked, setChecked] = useState<string[]>([]);

  return (
    <>
      <div className="bg-sidebar border-sidebar-border flex items-center gap-1 border-b p-1">
        <SidebarTrigger />
        <Button variant="ghost" size="sm">
          <PlusIcon />
          Add
        </Button>
        <UrlInputBox
          title="Import Book Source"
          label="Input the URL of the book source:"
          onInput={(value) => importBookSource(value)}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <ImportIcon />
              Import
            </Button>
          </DialogTrigger>
        </UrlInputBox>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col">
          {sources.map((source) => (
            <div key={source.bookSourceUrl} className="hover:bg-accent flex items-center gap-1 p-2">
              <Checkbox
                id={`c${source.bookSourceUrl}`}
                checked={checked.includes(source.bookSourceUrl)}
                onCheckedChange={() => {
                  setChecked(toggle(checked, source.bookSourceUrl));
                }}
              />
              <Label className="grow" htmlFor={`c${source.bookSourceUrl}`}>
                {source.bookSourceName}
              </Label>
              <Switch checked={source.enabled} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
