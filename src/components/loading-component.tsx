import { Loader2Icon } from 'lucide-react';

export function LoadingComponent() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loader2Icon className="animate-spin" size="4rem" />
    </div>
  );
}
