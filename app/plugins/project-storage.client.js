import { debounce } from 'lodash';
import { namespace } from '~/composables/useProjectStores';

export default defineNuxtPlugin({
    name: 'project-storage',
    dependsOn: ['pinia', 'migrate-storage'],

    setup({ $pinia }) {
        $pinia.use(({ store }) => {
            if (!store.$id.startsWith(namespace)) return;

            try {
                const stored = localStorage.getItem(store.$id);

                if (stored) store.$patch(JSON.parse(stored));
            } catch (error) {
                console.error('Unable to restore project.', error);
            }

            const persist = debounce(
                () => {
                    try {
                        localStorage.setItem(store.$id, JSON.stringify(store.$state));
                    } catch (error) {
                        console.error('Unable to persist project.', error);
                    }
                },
                500,
                { maxWait: 2000 }
            );

            // Observe immediately so pagehide can flush even an edit made in this tick.
            store.$subscribe(persist, { detached: true, flush: 'sync' });

            const flush = () => persist.flush();
            window.addEventListener('pagehide', flush);

            const dispose = store.$dispose;
            store.$dispose = () => {
                persist.cancel();
                window.removeEventListener('pagehide', flush);
                dispose();
            };
        });
    },
});
