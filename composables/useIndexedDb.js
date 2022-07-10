import { get, set, del } from 'idb-keyval';
import { useStorageAsync } from '@vueuse/core';

export default function (key, initialValue) {
    return useStorageAsync(key, initialValue, {
        async getItem(key) {
            return await get(key);
        },
        async setItem(key, value) {
            return await set(key, value);
        },
        async removeItem(key) {
            return await del(key);
        },
    });
}
