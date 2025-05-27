import { z } from 'zod/v4-mini';

import { fromJson as fromJsonString } from '@/lib/string-utils';

/**
 * 发现分类
 */
export const exploreKindSchema = z.object({
  title: z.string(),
  url: z.optional(z.string()),
});

export const exploreKindsSchema = z.array(exploreKindSchema);

/**
 * 发现分类
 */
export type ExploreKind = z.infer<typeof exploreKindSchema>;

export const fromJson = (s: string) => fromJsonString(s, exploreKindsSchema);
