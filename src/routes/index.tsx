import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Books,
});

function Books() {
  return (
    <div className="p-2">
      <h3>Books!</h3>
    </div>
  );
}
