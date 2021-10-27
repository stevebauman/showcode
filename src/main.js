import VDragged from 'v-dragged';
import VueTailwind from 'vue-tailwind';
import { TToggle, TDropdown } from 'vue-tailwind/dist/components';

export default function (Vue, { router, head, isClient }) {
    head.style.push({
        rel: "stylesheet",
        crossOrigin: "anonymous",
        dataName:"vs/editor/editor.main",
        href: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/editor/editor.main.css"
    });

    head.script.push({
        src: 'https://unpkg.com/shiki',
        crossOrigin: "anonymous",
    });

    head.script.push({
        innerHTML: `var require = { paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs' } };`
    });

    head.script.push({
        src: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/loader.js',
        crossOrigin: "anonymous",
    });

    head.script.push({
        src: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/editor/editor.main.nls.js',
        crossOrigin: "anonymous",
    });

    head.script.push({
        src: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/editor/editor.main.js',
        crossOrigin: "anonymous",
    });

    head.script.push({
        src: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.29.1/min/vs/basic-languages/php/php.min.js',
        crossOrigin: "anonymous",
    });

    Vue.use(VDragged);

    Vue.use(VueTailwind, { TToggle, TDropdown });
}
