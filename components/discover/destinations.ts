// components/discover/destinations.ts — pure helpers that turn content refs into
// in-app hrefs. Centralising this keeps every Discover card pointing at the
// right place per the routing/session-player contract.

import type { PracticeKind } from "@/lib/types";

/**
 * Build the session-player URL per the contract:
 *   /session?kind=KIND&deity=DEITYID(&item=ITEMID)
 * ITEMID is optional — the player picks a sensible first item when omitted.
 */
export function sessionHref(
  kind: PracticeKind,
  deityId: string,
  itemId?: string,
): string {
  const params = new URLSearchParams({ kind, deity: deityId });
  if (itemId) params.set("item", itemId);
  return `/session?${params.toString()}`;
}

/** Where stories / talks / lessons are read & heard. */
export const KATHA_HREF = "/katha";

/** Sadhana detail route. */
export function sadhanaHref(id: string): string {
  return `/sadhanas/${id}`;
}

/**
 * A collection's detail is shown inline on /discover via a query param, so the
 * whole experience stays within this route (no new top-level page needed).
 */
export function collectionHref(id: string): string {
  return `/discover?collection=${id}`;
}

/** A category surfaces a relevant set inline on /discover. */
export function categoryHref(id: string): string {
  return `/discover?category=${id}`;
}
