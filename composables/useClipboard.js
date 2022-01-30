import { ref } from '@nuxtjs/composition-api';

export default function () {
    const copied = ref(false);

    const copy = (content) =>
        navigator.clipboard
            .write([new ClipboardItem({ 'image/png': content })])
            .then(() => (copied.value = true))
            .then(() => window.setTimeout(() => (copied.value = false), 4000));

    return {
        copy,
        copied,
    };
}
