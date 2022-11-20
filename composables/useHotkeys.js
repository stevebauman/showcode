import { onBeforeUnmount, onMounted, toRefs, ref } from 'vue';

export default function (props, context) {
    const { shortcuts } = toRefs(props);

    const { emit } = context;

    const supportedShortcuts = ref([]);

    if (shortcuts.value && shortcuts.value.length) {
        shortcuts.value.forEach((sc) => {
            if (sc) {
                supportedShortcuts.value.push({ keyString: sc, keyCode: sc.charCodeAt(0) });
            }
        });
    }

    const onUseKeyboardShortcuts = (event) => {
        const key = event.keyCode || event.which;

        const ctr = window.navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey;

        const isKeySupported = supportedShortcuts.value.some(({ keyCode }) => keyCode === key);

        if (ctr && isKeySupported) {
            event.preventDefault();

            const { keyString } = supportedShortcuts.value.find(({ keyCode }) => keyCode === key);

            emit('triggered', { key, keyString });
        }
    };

    onMounted(() => {
        document.addEventListener('keydown', onUseKeyboardShortcuts, false);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', onUseKeyboardShortcuts);
    });
}
