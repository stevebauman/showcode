import { ref } from '@nuxtjs/composition-api';

export default function () {
    const copied = ref(false);

    function copy(content, format = 'image/png') {
        navigator.clipboard
            .write([new ClipboardItem({ [format]: content })])
            .then(() => (copied.value = true))
            .then(() => window.setTimeout(() => (copied.value = false), 4000));
    }

    return {
        copy,
        copied,
    };
}
