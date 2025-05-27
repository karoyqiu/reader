import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
const weekAgo = dayjs().subtract(7, 'days');

type TimeProps = React.ComponentProps<'time'> & {
  milliseconds: number;
};

function Time({ milliseconds, ...props }: TimeProps) {
  const t = dayjs(milliseconds);
  const s = t.isBefore(weekAgo) ? t.toDate().toLocaleString() : t.fromNow();

  return (
    <time dateTime={t.toISOString()} {...props}>
      {s}
    </time>
  );
}

export { Time };
