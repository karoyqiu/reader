import Dexie, { type EntityTable } from 'dexie';

import type { BookSource } from './book-source';

const db = new Dexie('db') as Dexie & {
  bookSources: EntityTable<
    BookSource,
    'bookSourceUrl' // primary key
  >;
};

db.version(1).stores({
  bookSources: 'bookSourceUrl, bookSourceName',
});

export default db;
