import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { TooltipProvider } from '@/components/ui/tooltip';

export const Route = createRootRoute({
  component: () => (
    <div>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});
