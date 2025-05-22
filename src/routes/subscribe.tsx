import { createFileRoute } from '@tanstack/react-router';
import { ImportIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UrlInputBox } from '@/components/url-input-box';
import { importBookSource } from '@/lib/actions/importBookSource';

export const Route = createFileRoute('/subscribe')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
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
  );
}
