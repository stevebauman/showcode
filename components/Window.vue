<template>
    <div
        ref="root"
        :class="[
            themeDivider[settings.themeName],
            {
                'divide-y': blocks.length > 1,
                'shadow-none': settings.background === 'transparent',
                'shadow-xl': settings.background !== 'transparent' && settings.showShadow,
            },
        ]"
        :style="{
            fontSize: `${settings.fontSize}px`,
            transform: `scale(${settings.scale})`,
            lineHeight: `${settings.lineHeight}px`,
            backgroundColor: settings.themeBackground,
            borderRadius: `${settings.borderRadius}px`,
        }"
    >
        <div v-if="settings.showHeader" class="relative flex items-center h-12 p-4 overflow-hidden">
            <FauxMenu
                v-if="settings.showMenu"
                class="absolute"
                :theme="settings.showColorMenu ? 'color' : settings.themeType"
            />

            <div
                v-if="settings.showTitle"
                @click="preview ? null : editTitle()"
                class="w-full px-2 text-center text-gray-400 mx-14"
            >
                <input
                    v-if="editingTitle || title.length > 0"
                    type="text"
                    ref="titleInput"
                    v-model="title"
                    class="w-full p-0 text-sm font-medium text-center truncate bg-transparent border-0 shadow-none focus:ring-0"
                    @blur="editingTitle = false"
                />

                <span v-else class="text-sm font-medium truncate"> Untitled-1 </span>
            </div>
        </div>

        <div
            :class="[
                themeDivider[settings.themeName],
                {
                    'flex divide-x': settings.landscape && blocks.length > 1,
                    'flex flex-col divide-y': !settings.landscape && blocks.length > 1,
                },
            ]"
        >
            <div
                class="flex items-center overflow-hidden"
                v-for="(lines, index) in blocks"
                :key="index"
                :style="{
                    paddingTop: `${settings.padding}px`,
                    paddingBottom: `${settings.padding}px`,
                }"
            >
                <Code
                    class="relative w-full"
                    :class="settings.fontFamily"
                    :lines="lines"
                    :preview="preview"
                    :padding="settings.padding"
                    :theme-type="settings.themeType"
                    :show-line-numbers="settings.showLineNumbers"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, toRefs, watch, nextTick } from '@nuxtjs/composition-api';

const themeDivider = {
    'dark-plus': 'divide-gray-700',
    'dracula-soft': 'divide-gray-700',
    dracula: 'divide-gray-700',
    'github-dark-dimmed': 'divide-gray-700',
    'github-dark': 'divide-slate-700',
    'github-light': 'divide-gray-100',
    'github-light-plus': 'divide-gray-200',
    'material-darker': 'divide-gray-700',
    'material-default': 'divide-gray-600',
    'material-lighter': 'divide-gray-200',
    'material-ocean': 'divide-gray-700',
    'material-palenight': 'divide-gray-600',
    'min-dark': 'divide-gray-700',
    'min-light': 'divide-gray-100',
    monokai: 'divide-gray-700',
    nord: 'divide-slate-600',
    'one-dark-pro': 'divide-slate-600',
    poimandres: 'divide-gray-700',
    'rose-pine-dawn': 'divide-stone-300',
    'rose-pine-moon': 'divide-slate-600',
    'rose-pine': 'divide-gray-600',
    'slack-dark': 'divide-stone-600',
    'slack-ochin': 'divide-gray-200',
    'solarized-dark': 'divide-slate-600',
    'solarized-light': 'divide-stone-300',
    'vitesse-dark': 'divide-gray-700',
    'vitesse-light': 'divide-gray-200',
};

export default {
    props: {
        blocks: {
            type: Array,
            default: () => [],
        },
        preview: {
            type: Boolean,
            default: false,
        },
        settings: {
            type: Object,
            default: () => {},
        },
    },

    setup(props, { emit }) {
        const { settings } = toRefs(props);

        const root = ref(null);
        const titleInput = ref(null);
        const editingTitle = ref(false);
        const title = ref(settings.value.title || '');

        const editTitle = () => {
            editingTitle.value = true;

            nextTick(() => titleInput.value.focus());
        };

        const actualWidth = () => Math.round(root.value.getBoundingClientRect().width - 1);
        const actualHeight = () => Math.round(root.value.getBoundingClientRect().height - 1);

        watch(title, (title) => emit('update:title', title));

        watch(
            () => settings.value.title,
            (newTitle) => (title.value = newTitle)
        );

        return {
            root,
            title,
            editTitle,
            editingTitle,
            titleInput,
            actualWidth,
            actualHeight,
            themeDivider,
        };
    },
};
</script>
