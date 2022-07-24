<template>
    <div
        ref="root"
        :class="[
            {
                'divide-y': blocks.length > 1,
            },
        ]"
        :style="{
            border: border,
            boxShadow: boxShadow,
            fontSize: `${settings.fontSize}px`,
            transform: `scale(${settings.scale})`,
            lineHeight: `${settings.lineHeight}px`,
            backgroundColor: settings.themeBackground,
            borderRadius: `${settings.borderRadius}px`,
        }"
    >
        <div
            v-if="settings.showHeader"
            :style="{ borderColor: borderColor }"
            class="relative flex items-center h-12 p-4 overflow-hidden"
        >
            <FauxMenu
                v-if="settings.showMenu"
                class="absolute"
                :theme="settings.showColorMenu ? 'color' : settings.themeType"
            />

            <div
                v-if="settings.showTitle"
                @click="preview ? null : editTitle()"
                class="w-full px-2 text-center text-gray-400 mx-14 cursor-text"
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
                {
                    'flex divide-x': settings.landscape && blocks.length > 1,
                    'flex flex-col divide-y': !settings.landscape && blocks.length > 1,
                },
            ]"
            :style="{ borderColor: borderColor }"
        >
            <div
                class="flex items-center overflow-hidden"
                v-for="({ lines, added, removed, focused }, index) in blocks"
                :key="index"
                :style="{
                    borderColor: borderColor,
                    paddingTop: `${settings.paddingTop}px`,
                    paddingBottom: `${settings.paddingBottom}px`,
                }"
            >
                <Code
                    class="relative w-full"
                    v-bind="fontAttributes"
                    :lines="lines"
                    :added="added"
                    :removed="removed"
                    :focused="focused"
                    :preview="preview"
                    :padding="settings.padding"
                    :theme-type="settings.themeType"
                    :show-line-numbers="settings.showLineNumbers"
                    :style="{
                        paddingLeft: `${settings.paddingLeft}px`,
                        paddingRight: `${settings.paddingRight}px`,
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script>
import chroma from 'chroma-js';
import useFonts from '@/composables/useFonts';
import { ref, watch, nextTick, computed } from '@nuxtjs/composition-api';

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
        const { fontFamilies } = useFonts();

        const root = ref(null);
        const titleInput = ref(null);
        const editingTitle = ref(false);
        const title = ref(props.settings.title || '');

        const editTitle = () => {
            editingTitle.value = true;

            nextTick(() => titleInput.value.focus());
        };

        const fontAttributes = computed(() => {
            return (
                fontFamilies.value.find((font) => font.name === props.settings.fontFamily)
                    ?.attributes ?? { class: 'font-mono' }
            );
        });

        const borderColor = computed(() => {
            return chroma(props.settings.themeBackground)
                .darken(props.settings.themeType === 'light' ? 1 : -3)
                .alpha(0.5)
                .hex();
        });

        const boxShadow = computed(() => {
            if (!props.settings.showShadow || !props.settings.shadowColor) {
                return;
            }

            const color = `${props.settings.shadowColor.red}, ${props.settings.shadowColor.green}, ${props.settings.shadowColor.blue}, ${props.settings.shadowColor.alpha}`;

            return `${props.settings.shadowX}px ${props.settings.shadowY}px ${props.settings.shadowBlur}px ${props.settings.shadowSpread}px rgba(${color})`;
        });

        const border = computed(() => {
            if (!props.settings.showBorder || !props.settings.borderColor) {
                return;
            }

            const color = `${props.settings.borderColor.red}, ${props.settings.borderColor.green}, ${props.settings.borderColor.blue}, ${props.settings.borderColor.alpha}`;

            return `${props.settings.borderWidth}px solid rgba(${color})`;
        });

        const actualWidth = () => root.value.clientWidth;
        const actualHeight = () => root.value.clientHeight;

        watch(title, (title) => emit('update:title', title));

        watch(
            () => props.settings.title,
            (newTitle) => (title.value = newTitle)
        );

        return {
            root,
            title,
            editTitle,
            editingTitle,
            titleInput,
            border,
            boxShadow,
            borderColor,
            actualWidth,
            actualHeight,
            fontAttributes,
        };
    },
};
</script>
