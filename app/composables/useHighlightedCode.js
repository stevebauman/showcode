import { debounce } from 'lodash';
import { onScopeDispose, ref, shallowRef, toValue, watch } from 'vue';
import useShiki from '@/composables/useShiki';

export default function (config, { delay = 150, limit = null, enabled = true } = {}) {
    const { buildCodeBlocks } = useShiki();
    const result = shallowRef(null);
    const loading = ref(false);
    let revision = 0;
    let renderedRevision = -1;
    let pending = null;
    let disposed = false;

    const schedule = debounce(refresh, delay);

    async function refresh() {
        schedule.cancel();
        if (disposed || !toValue(enabled)) return;
        if (renderedRevision === revision) return result.value;
        if (pending?.revision === revision) return pending.promise;

        const current = revision;
        loading.value = true;
        const promise = buildCodeBlocks(toValue(config), limit)
            .then((value) => {
                if (current !== revision) return;
                result.value = value;
                renderedRevision = current;
                return value;
            })
            .finally(() => {
                if (current === revision) {
                    loading.value = false;
                    pending = null;
                }
            });

        pending = { revision: current, promise };
        return promise;
    }

    async function flush() {
        while (!disposed && toValue(enabled)) {
            const current = revision;
            const value = await refresh();
            if (current === revision) return value;
        }
    }

    watch(
        () => [toValue(config), toValue(enabled)],
        ([, active], previous) => {
            revision++;
            schedule.cancel();
            loading.value = active;
            if (!active) return;
            if (!previous || !previous[1]) return refresh();
            schedule();
        },
        { immediate: true, deep: true, flush: 'sync' }
    );

    onScopeDispose(() => {
        disposed = true;
        revision++;
        schedule.cancel();
        loading.value = false;
    });

    return { result, loading, flush };
}
