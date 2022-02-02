<template>
    <div
        ref="root"
        :class="{
            'divide-y': blocks.length > 1,
            'divide-gray-600': settings.themeType === 'dark',
            'divide-gray-100': settings.themeType === 'light',
            'shadow-none': settings.background === 'transparent',
            'shadow-xl': settings.background !== 'transparent' && settings.showShadow,
        }"
        style="min-width: 300px"
        :style="{
            fontSize: `${settings.fontSize}px`,
            lineHeight: `${settings.lineHeight}px`,
            backgroundColor: settings.themeBackground,
            borderRadius: `${settings.borderRadius}px`,
        }"
    >
        <div v-if="settings.showHeader" class="relative flex items-center h-12 p-4">
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

                <span v-else class="text-sm font-medium"> Untitled-1 </span>
            </div>
        </div>

        <div
            :class="{
                'divide-gray-600': settings.themeType === 'dark',
                'divide-gray-100': settings.themeType === 'light',
                'flex divide-x': settings.landscape && blocks.length > 1,
                'flex flex-col divide-y': !settings.landscape && blocks.length > 1,
            }"
        >
            <div
                class="flex items-center"
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
import { nextTick, ref, toRefs, watch } from '@nuxtjs/composition-api';

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

        const width = () => root.value.clientWidth;
        const height = () => root.value.clientHeight;

        watch(title, (title) => emit('update:title', title));

        watch(
            () => settings.value.title,
            (newTitle) => (title.value = newTitle)
        );

        return { root, title, width, height, editTitle, editingTitle, titleInput };
    },
};
</script>
