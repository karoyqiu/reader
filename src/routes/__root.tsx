import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export const Route = createRootRoute({
  component: () => (
    <div>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
      <Toaster richColors />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});
