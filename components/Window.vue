<template>
    <div
        ref="root"
        :class="[
            {
                'divide-y': blocks.length > 1,
                'origin-center': settings.position === 'center',
                'origin-top': settings.position === 'top',
                'origin-bottom': settings.position === 'bottom',
                'origin-left': settings.position === 'left',
                'origin-right': settings.position === 'right',
            },
        ]"
        :style="{
            border: border,
            boxShadow: boxShadow,
            borderRadius: borderRadius,
            fontSize: `${settings.fontSize}px`,
            transform: `scale(${settings.scale})`,
            lineHeight: `${settings.lineHeight}px`,
            backgroundColor: settings.themeBackground,
        }"
    >
        <div
            v-if="settings.showHeader"
            class="relative flex items-center h-12 p-4 overflow-hidden"
            :style="{ borderColor: borderColor, backgroundColor: backgroundAccentColor }"
        >
            <FauxMenu
                v-if="settings.showMenu"
                class="absolute"
                :theme="settings.showColorMenu ? 'color' : settings.themeType"
            />

            <div
                v-if="settings.showTitle"
                @click="preview ? null : editTitle()"
                :class="{ 'mx-12': settings.showMenu }"
                class="w-full px-2 text-center text-gray-400 cursor-text"
            >
                <input
                    v-if="editingTitle || title.length > 0"
                    type="text"
                    ref="titleInput"
                    v-model="title"
                    @blur="editingTitle = false"
                    :style="{ width: `${title.length / 1.75}em` }"
                    class="p-0 text-sm font-medium text-center bg-transparent border-0 shadow-none focus:ring-0"
                />

                <span v-else class="text-sm font-medium"> Untitled-1 </span>
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
                    paddingTop: `${padding('top')}px`,
                    paddingBottom: `${padding('bottom')}px`,
                }"
            >
                <Code
                    class="relative w-full"
                    v-bind="codeAttributes"
                    :lines="lines"
                    :added="added"
                    :removed="removed"
                    :focused="focused"
                    :preview="preview"
                    :theme-type="settings.themeType"
                    :show-line-numbers="settings.showLineNumbers"
                />
            </div>
        </div>
    </div>
</template>

<script>
import chroma from 'chroma-js';
import useFonts from '@/composables/useFonts';
import { get, merge, cloneDeep, capitalize } from 'lodash';
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
            const font = fontFamilies.value.find((font) => font.name === props.settings.fontFamily);

            return get(font, 'attributes', { class: 'font-mono' });
        });

        const codeAttributes = computed(() => {
            return merge(cloneDeep(fontAttributes.value), {
                style: {
                    paddingLeft: `${padding('left')}px`,
                    paddingRight: `${padding('right')}px`,
                },
            });
        });

        const borderColor = computed(() => {
            return chroma(props.settings.themeBackground)
                .darken(props.settings.themeType === 'light' ? 1 : -3)
                .alpha(0.25)
                .hex();
        });

        const backgroundAccentColor = computed(() => {
            return chroma(props.settings.themeBackground)
                .darken(props.settings.themeType === 'light' ? 1 : -3)
                .alpha(0.1)
                .hex();
        });

        const boxShadow = computed(() => {
            if (!props.settings.showShadow || !props.settings.shadowColor) {
                return;
            }

            const color = `${props.settings.shadowColor.red}, ${props.settings.shadowColor.green}, ${props.settings.shadowColor.blue}, ${props.settings.shadowColor.alpha}`;

            return `${props.settings.shadowX}px ${props.settings.shadowY}px ${props.settings.shadowBlur}px ${props.settings.shadowSpread}px rgba(${color})`;
        });

        const borderRadius = computed(() => {
            if (props.settings.borderRadiusLocked) {
                return `${props.settings.borderRadius}px`;
            }

            return `${props.settings.borderRadiusTopLeft}px ${props.settings.borderRadiusTopRight}px ${props.settings.borderRadiusBottomRight}px ${props.settings.borderRadiusBottomLeft}px`;
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

        const padding = (side) =>
            props.settings.paddingLocked
                ? props.settings.padding
                : get(props.settings, `padding${capitalize(side)}`);

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
            padding,
            boxShadow,
            borderColor,
            borderRadius,
            backgroundAccentColor,
            actualWidth,
            actualHeight,
            codeAttributes,
        };
    },
};
</script>
