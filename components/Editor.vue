<template>
    <div ref="root">
        <Scrollbar force-vertical-scroll class="bg-ui-gray-700">
            <div ref="toolbar" class="flex items-center justify-between w-full">
                <div
                    class="flex items-center gap-2 m-2 rounded-lg focus-within:ring-2 focus-within:ring-ui-focus"
                >
                    <label
                        class="hidden pl-2 text-xs font-semibold leading-none tracking-wide uppercase whitespace-nowrap text-ui-gray-500 xl:inline-block"
                    >
                        Lang
                    </label>

                    <Select
                        dusk="select-language"
                        name="language"
                        :value="language"
                        :options="languages"
                        @input="$emit('update:language', $event)"
                    />
                </div>

                <div class="flex items-stretch gap-2">
                    <div
                        class="flex items-center gap-2 mr-2 rounded-lg focus-within:ring-2 focus-within:ring-ui-focus lg:mr-0"
                    >
                        <label
                            class="hidden pl-2 text-xs font-semibold leading-none tracking-wide uppercase whitespace-nowrap text-ui-gray-500 xl:inline-block"
                        >
                            Tab Size
                        </label>

                        <Select
                            dusk="select-tab-size"
                            :value="tabSize"
                            :options="[2, 4]"
                            @input="$emit('update:tab-size', $event)"
                        />
                    </div>

                    <div
                        class="items-center hidden rounded-lg lg:flex"
                        :class="{ 'mr-2': !canToggleLayout }"
                    >
                        <Popover
                            title="Emoji Picker"
                            auto-hide
                            :resets="false"
                            class="flex items-stretch h-full"
                        >
                            <template #trigger>
                                <ToolbarButton
                                    class="mr-0.5 rounded-lg"
                                    v-tooltip="{
                                        content: 'Add Emoji',
                                        boundariesElement: 'body',
                                    }"
                                >
                                    <SmileIcon class="w-5 h-5" />
                                </ToolbarButton>
                            </template>

                            <div class="p-2 border-b border-ui-gray-800">
                                <Input
                                    v-model="search"
                                    type="search"
                                    size="sm"
                                    placeholder="Search..."
                                    class="w-full"
                                />
                            </div>

                            <Scrollbar class="max-h-52 w-80">
                                <div
                                    class="grid h-full grid-flow-row grid-cols-8 gap-2 p-2 auto-rows-max"
                                >
                                    <button
                                        v-for="emoji in filteredEmojis"
                                        class="text-2xl rounded-lg hover:bg-ui-gray-600 active:bg-ui-gray-800"
                                        :key="emoji.name"
                                        :title="emoji.name"
                                        @click="addEmoji(emoji)"
                                    >
                                        {{ emoji.emoji }}
                                    </button>
                                </div>
                            </Scrollbar>
                        </Popover>

                        <ToolbarButton
                            v-if="canRemove && canMoveUp"
                            dusk="button-move-up"
                            class="mr-0.5 rounded-l-lg"
                            @click.native="$emit('up', id)"
                            v-tooltip="{
                                content: 'Move Editor',
                                boundariesElement: 'body',
                            }"
                        >
                            <ArrowUpIcon
                                class="w-5 h-5"
                                :class="{ '-rotate-90 transform': !landscape }"
                            />
                        </ToolbarButton>

                        <ToolbarButton
                            v-if="canRemove"
                            dusk="button-remove"
                            :class="{ 'rounded-l-lg': !canMoveUp }"
                            class="mr-0.5"
                            @click.native="$emit('remove', id)"
                            v-tooltip="{
                                content: 'Remove Editor',
                                boundariesElement: 'body',
                            }"
                        >
                            <MinusIcon class="w-5 h-5" />
                        </ToolbarButton>

                        <ToolbarButton
                            dusk="button-add"
                            :class="{
                                'mr-0.5': canMoveDown,
                                'rounded-r-lg': !canMoveDown,
                                'rounded-l-lg': !canRemove && !canMoveUp,
                            }"
                            @click.native="$emit('add')"
                            v-tooltip="{
                                content: 'Add Editor',
                                boundariesElement: 'body',
                            }"
                        >
                            <PlusIcon class="w-5 h-5" />
                        </ToolbarButton>

                        <ToolbarButton
                            v-if="canRemove && canMoveDown"
                            dusk="button-move-down"
                            class="rounded-r-lg"
                            @click.native="$emit('down', id)"
                            v-tooltip="{
                                content: 'Move Editor',
                                boundariesElement: 'body',
                            }"
                        >
                            <ArrowDownIcon
                                class="w-5 h-5"
                                :class="{ '-rotate-90 transform': !landscape }"
                            />
                        </ToolbarButton>
                    </div>

                    <div v-if="canToggleLayout" class="items-center hidden mr-2 lg:flex">
                        <ToolbarButton
                            v-if="landscape"
                            class="rounded-l-lg"
                            dusk="button-toggle-portrait"
                            @click.native="$emit('update:layout')"
                            v-tooltip="{
                                content: 'Toggle Layout',
                                boundariesElement: 'body',
                            }"
                        >
                            <CreditCardIcon class="w-5 h-5" />
                        </ToolbarButton>

                        <ToolbarButton
                            v-else
                            class="rounded-l-lg"
                            dusk="button-toggle-landscape"
                            @click.native="$emit('update:layout')"
                            v-tooltip="{
                                content: 'Toggle Layout',
                                boundariesElement: 'body',
                            }"
                        >
                            <ColumnsIcon class="w-5 h-5" />
                        </ToolbarButton>

                        <ToolbarButton
                            class="rounded-r-lg"
                            dusk="button-toggle-reverse"
                            @click.native="$emit('update:reverse')"
                            v-tooltip="{
                                content: 'Move Editor Pane',
                                boundariesElement: 'body',
                            }"
                        >
                            <LogInIcon
                                class="w-5 h-5"
                                :class="{
                                    'rotate-90 transform': orientation === 'top',
                                    'rotate-180 transform': orientation === 'right',
                                    '-rotate-90 transform': orientation === 'bottom',
                                }"
                            />
                        </ToolbarButton>
                    </div>
                </div>
            </div>
        </Scrollbar>

        <div ref="container" class="w-full h-full">
            <Monaco
                ref="monaco"
                class="w-full h-full"
                :width="width"
                :height="height"
                :value="value"
                :added="added"
                :removed="removed"
                :focused="focused"
                :tab-size="tabSize"
                :language="languageAlias"
                @input="$emit('input', $event)"
                @update:added="$emit('update:added', $event)"
                @update:removed="$emit('update:removed', $event)"
                @update:focused="$emit('update:focused', $event)"
            />
        </div>
    </div>
</template>

<script>
import {
    PlusIcon,
    MinusIcon,
    LogInIcon,
    SmileIcon,
    ColumnsIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CreditCardIcon,
} from 'vue-feather-icons';
import {
    ref,
    watch,
    toRefs,
    computed,
    useContext,
    onMounted,
    onUnmounted,
} from '@nuxtjs/composition-api';
import Fuse from 'fuse.js';
import groupedEmojis from '~/data/emojis';
import { useResizeObserver } from '@vueuse/core';
import { debounce, orderBy, flatten } from 'lodash';

// @see https://github.com/muan/unicode-emoji-json
const emojis = flatten(Object.keys(groupedEmojis).map((group) => groupedEmojis[group])).filter(
    (emoji) => emoji.emoji.codePointAt(0).toString(16).startsWith('1f')
);

export default {
    props: {
        id: {
            type: String,
            required: true,
        },
        sizes: {
            type: Array,
            default: [],
        },
        value: {
            type: String,
            default: '',
        },
        added: {
            type: Array,
            default: () => [],
        },
        removed: {
            type: Array,
            default: () => [],
        },
        focused: {
            type: Array,
            default: () => [],
        },
        orientation: {
            type: String,
            default: 'left',
        },
        tabSize: {
            type: [String, Number],
            default: 4,
        },
        language: {
            type: String,
            default: 'php',
        },
        options: {
            type: Object,
            default: () => {},
        },
        canRemove: {
            type: Boolean,
            default: false,
        },
        canMoveUp: {
            type: Boolean,
            default: false,
        },
        canMoveDown: {
            type: Boolean,
            default: false,
        },
        canToggleLayout: {
            type: Boolean,
            default: false,
        },
    },

    components: {
        SmileIcon,
        PlusIcon,
        LogInIcon,
        MinusIcon,
        ColumnsIcon,
        CreditCardIcon,
        ArrowUpIcon,
        ArrowDownIcon,
        ArrowLeftIcon,
        ArrowRightIcon,
    },

    setup(props) {
        const { sizes, orientation, language } = toRefs(props);

        const { $bus, $shiki } = useContext();

        const width = ref(0);
        const height = ref(0);
        const root = ref(null);
        const search = ref('');
        const monaco = ref(null);
        const toolbar = ref(null);
        const filteredEmojis = ref(emojis);

        const fuse = new Fuse(emojis, { keys: ['name'] });

        const languages = computed(() => orderBy($shiki.languages()));

        const landscape = computed(() => ['left', 'right'].includes(orientation.value));

        const languageAlias = computed(
            () =>
                ({
                    bash: 'shell',
                    vue: 'html',
                    blade: 'html',
                    antlers: 'html',
                }[language.value] ?? language.value)
        );

        const addEmoji = (emoji) =>
            monaco.value.editor.trigger('keyboard', 'type', { text: emoji.emoji });

        const updateMonacoDimensions = () => {
            if (root.value && root.value.offsetParent) {
                width.value = root.value.clientWidth;
                height.value = root.value.clientHeight - toolbar.value.clientHeight;
            }
        };

        watch(
            search,
            debounce((value) => {
                filteredEmojis.value = value
                    ? fuse.search(value).map((result) => result.item)
                    : emojis;
            }, 250)
        );

        useResizeObserver(document.body, updateMonacoDimensions);

        onMounted(() => {
            updateMonacoDimensions();

            watch([sizes, orientation], updateMonacoDimensions);

            $bus.$on('editors:refresh', updateMonacoDimensions);
        });

        onUnmounted(() => $bus.$emit('editors:refresh'));

        return {
            root,
            width,
            height,
            emojis,
            search,
            monaco,
            toolbar,
            addEmoji,
            landscape,
            languages,
            languageAlias,
            filteredEmojis,
        };
    },
};
</script>
