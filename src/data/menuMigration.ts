import type { Category, MenuItem } from '../types';

/**
 * One-time, versioned replacement of the SAVED menu + categories only.
 *
 * - Touches exactly two localStorage keys: `<prefix>_categories` and `<prefix>_menu`,
 *   plus its own marker key `<prefix>_menu_version`.
 * - Never touches orders, tables, staff, settings, carts or any other key.
 * - Runs at most once per seed version: after it runs, the marker equals the seed
 *   version and later loads are no-ops (admin edits made afterwards are kept).
 * - While `seed.version === LEGACY_MENU_VERSION` it is completely inert, so it can
 *   ship before the Dakshin Kitchen data does.
 */
export const LEGACY_MENU_VERSION = 'legacy';

export interface MenuSeed {
  version: string;
  categories: Category[];
  menuItems: MenuItem[];
}

export type MigrationResult = 'inert' | 'already-current' | 'migrated' | 'skipped-error';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function migrateMenuIfNeeded(
  storage: StorageLike,
  keyPrefix: string,
  seed: MenuSeed
): MigrationResult {
  if (seed.version === LEGACY_MENU_VERSION) return 'inert';

  const markerKey = `${keyPrefix}_menu_version`;
  try {
    if (storage.getItem(markerKey) === seed.version) return 'already-current';

    // Safety: refuse to wipe the saved menu with an empty seed.
    if (seed.menuItems.length === 0 || seed.categories.length === 0) return 'skipped-error';

    // Write the two data keys first, the marker last, so a failure part-way
    // leaves the marker unset and the migration is retried next load.
    storage.setItem(`${keyPrefix}_categories`, JSON.stringify(seed.categories));
    storage.setItem(`${keyPrefix}_menu`, JSON.stringify(seed.menuItems));
    storage.setItem(markerKey, seed.version);
    return 'migrated';
  } catch {
    return 'skipped-error';
  }
}

/** Mark the current seed as applied (used after "reset to defaults"). */
export function markMenuSeedApplied(storage: StorageLike, keyPrefix: string, seed: MenuSeed): void {
  if (seed.version === LEGACY_MENU_VERSION) return;
  try {
    storage.setItem(`${keyPrefix}_menu_version`, seed.version);
  } catch {
    /* ignore */
  }
}
