import { type ErrorComponentProps, useRouter } from '@tanstack/react-router';
import { RefreshCcwIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ErrorComponent(props: ErrorComponentProps) {
  const { error } = props;
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg">Failed to load data</span>
        <span className="text-muted-foreground text-xs">{error.message ?? error}</span>
      </div>
      <Button onClick={() => router.invalidate()}>
        <RefreshCcwIcon /> Reload
      </Button>
    </div>
  );
}
