import { fetch } from '@tauri-apps/plugin-http';

import { type BookSource, db } from '@/db';

export const importBookSource = async (url: string) => {
  const resp = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
  }

  const body = (await resp.json()) as BookSource[];
  await db.bookSources.bulkAdd(body);
};
