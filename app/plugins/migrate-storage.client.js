import { entries, del } from 'idb-keyval';

/**
 * One-time migration from IndexedDB (idb-keyval) to localStorage.
 *
 * Previous versions persisted store data in IndexedDB via useStorageAsync.
 * Now we use pinia-plugin-persistedstate with localStorage. This plugin
 * runs before any stores are created and copies all IndexedDB entries
 * to localStorage so the persist plugin can hydrate them.
 */
export default defineNuxtPlugin({
    name: 'migrate-storage',
    enforce: 'pre',

    async setup() {
        try {
            const allEntries = await entries();

            if (!allEntries.length) {
                return;
            }

            for (const [key, value] of allEntries) {
                // Only migrate if localStorage doesn't already have the key,
                // so we don't overwrite data that was already persisted by
                // the new plugin on a previous visit.
                if (localStorage.getItem(key) === null) {
                    const raw = typeof value === 'string' ? value : JSON.stringify(value);

                    // The template store previously stored a raw array, but
                    // the new store shape wraps it in `{ items: [] }`.
                    if (key === 'templates') {
                        const parsed = JSON.parse(raw);
                        localStorage.setItem(
                            key,
                            JSON.stringify({
                                items: Array.isArray(parsed) ? parsed : [],
                            })
                        );
                    } else {
                        localStorage.setItem(key, raw);
                    }
                }

                await del(key);
            }
        } catch (e) {
            console.error('Failed to migrate storage from IndexedDB:', e);
        }
    },
});
