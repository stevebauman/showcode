<template>
    <div
        :class="{
            'divide-y-2': blocks.length > 1,
            'shadow-none': background === 'transparent',
            'shadow-xl': background !== 'transparent',
            'divide-gray-100': themeType === 'light',
            'divide-gray-600': themeType === 'dark',
        }"
        style="min-width: 400px"
        :style="{
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}px`,
            backgroundColor: themeBackground,
            borderRadius: `${borderRadius}px`,
        }"
    >
        <div class="relative flex items-center h-12 p-4">
            <FauxMenu class="absolute" :theme="showColorMenu ? 'color' : themeType" />

            <div
                v-if="showTitle"
                @click="editTitle"
                class="w-full px-2 text-center text-gray-400 mx-14"
            >
                <input
                    v-if="editingTitle || title.length > 0"
                    type="text"
                    ref="title"
                    v-model="title"
                    class="w-full p-0 text-sm font-medium text-center truncate bg-transparent border-0 shadow-none  focus:ring-0"
                    @blur="editingTitle = false"
                />

                <span v-else class="text-sm font-medium"> Untitled-1 </span>
            </div>
        </div>

        <div v-for="(lines, index) in blocks" :key="index" :style="{ padding: `${padding}px` }">
            <Code
                class="relative"
                :lines="lines"
                :theme-type="themeType"
                :show-line-numbers="showLineNumbers"
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
        fontSize: [String, Number],
        lineHeight: [String, Number],
        background: String,
        themeBackground: String,
        borderRadius: [String, Number],
        themeType: String,
        padding: [String, Number],
        showTitle: Boolean,
        showColorMenu: Boolean,
        showLineNumbers: Boolean,
    },

    components: { Code, FauxMenu },

    data() {
        return {
            title: '',
            editingTitle: false,
        };
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
