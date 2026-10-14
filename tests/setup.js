import { vi } from 'vitest';

// Happy DOM does not implement workers. Component tests mock tokenization separately.
vi.stubGlobal(
    'Worker',
    class extends EventTarget {
        postMessage({ id, method }) {
            if (method === 'initialize') {
                queueMicrotask(() =>
                    this.dispatchEvent(
                        new MessageEvent('message', {
                            data: { id, result: { languages: [], themes: [] } },
                        })
                    )
                );
            }
        }

        terminate() {}
    }
);
