import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </SidebarProvider>
  ),
});
