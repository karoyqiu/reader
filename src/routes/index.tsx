import { createFileRoute } from '@tanstack/react-router';

import { SidebarTrigger } from '@/components/ui/sidebar';

export const Route = createFileRoute('/')({
  component: Bookshelf,
});

function Bookshelf() {
  return (
    <>
      <div className="bg-sidebar border-sidebar-border flex items-center gap-1 border-b p-1">
        <SidebarTrigger />
      </div>
      <h3>Books!</h3>
    </>
  );
}
