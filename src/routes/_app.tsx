import { Outlet, createFileRoute } from '@tanstack/react-router';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex h-svh w-full flex-col">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
