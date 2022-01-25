<template>
    <div
        :class="{
            'divide-y': blocks.length > 1,
            'shadow-none': settings.background === 'transparent',
            'shadow-xl': settings.background !== 'transparent' && settings.showShadow,
            'divide-gray-100': settings.themeType === 'light',
            'divide-gray-600': settings.themeType === 'dark',
        }"
        style="min-width: 400px"
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
                @click="editTitle"
                class="w-full px-2 text-center text-gray-400 mx-14"
            >
                <input
                    v-if="editingTitle || title.length > 0"
                    type="text"
                    ref="title"
                    v-model="title"
                    class="w-full p-0 text-sm font-medium text-center truncate bg-transparent border-0 shadow-none focus:ring-0"
                    @blur="editingTitle = false"
                />

                <span v-else class="text-sm font-medium"> Untitled-1 </span>
            </div>
        </div>

        <div
            v-for="(lines, index) in blocks"
            :key="index"
            :style="{ padding: `${settings.padding}px` }"
        >
            <Code
                class="relative"
                :class="settings.fontFamily"
                :lines="lines"
                :theme-type="settings.themeType"
                :show-line-numbers="settings.showLineNumbers"
            />
        </div>
    </div>
</template>

<script>
import Code from './Code';
import FauxMenu from './FauxMenu';

export default {
    props: {
        blocks: Array,
        settings: Object,
    },

    components: { Code, FauxMenu },

    data() {
        return {
            title: '',
            editingTitle: false,
        };
    },

    watch: {
        'settings.title'(title) {
            this.title = title;
        },

        title(title) {
            this.$emit('update:title', title);
        },
    },

    methods: {
        /**
         * Begin editing the preview window's title.
         */
        editTitle() {
            this.editingTitle = true;

            this.$nextTick(() => this.$refs.title.focus());
        },
    },
};
</script>
