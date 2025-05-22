import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex h-svh w-full flex-col">
        <Outlet />
      </main>
      <Toaster richColors />
      <TanStackRouterDevtools />
    </SidebarProvider>
  ),
});
