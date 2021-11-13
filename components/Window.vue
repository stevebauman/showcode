<template>
    <div
        :class="[background === 'transparent' ? 'shadow-none' : 'shadow-xl']"
        style="min-width: 400px"
        :style="{
            fontSize: `${fontSize}px`,
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

        <div
            v-for="(lines, index) in code"
            :key="index"
            :style="{ padding: `${padding}px` }"
            :class="{ 'border-b-2 border-opacity-50': index % 2 === 0 && code.length > 1 }"
        >
            <Code
                v-on="$listeners"
                class="relative"
                :lines="lines"
                :focused="focused"
                :themeType="themeType"
                :showLineNumber="showLineNumbers"
            />
        </div>
    </div>
</template>

<script>
import FauxMenu from './FauxMenu';

export default {
    props: [
        'code',
        'fontSize',
        'background',
        'themeBackground',
        'borderRadius',
        'themeType',
        'focused',
        'padding',
        'showTitle',
        'showColorMenu',
        'showLineNumbers',
    ],

    components: { FauxMenu },

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
