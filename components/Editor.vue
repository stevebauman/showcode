<template>
    <div ref="root">
        <div
            ref="toolbar"
            class="flex items-center justify-between w-full overflow-auto scrollbar-hide bg-ui-gray-700"
        >
            <div
                class="flex items-center gap-2 m-2 rounded-lg bg-ui-gray-800 focus-within:ring-2 focus-within:ring-ui-focus"
            >
                <label
                    class="hidden pl-2 text-xs font-semibold leading-none tracking-wide uppercase text-ui-gray-500 xl:inline-block whitespace-nowrap"
                >
                    Lang
                </label>

                <Select
                    dusk="select-language"
                    name="language"
                    :value="language"
                    :options="languages"
                    @input="(value) => $emit('update:language', value)"
                />
            </div>

            <div class="flex items-stretch gap-2">
                <div
                    class="flex items-center gap-2 mr-2 rounded-lg bg-ui-gray-800 focus-within:ring-2 focus-within:ring-ui-focus lg:mr-0"
                >
                    <label
                        class="hidden pl-2 text-xs font-semibold leading-none tracking-wide uppercase text-ui-gray-500 xl:inline-block whitespace-nowrap"
                    >
                        Tab Size
                    </label>

                    <Select
                        dusk="select-tab-size"
                        :value="tabSize"
                        :options="[2, 4]"
                        @input="(value) => $emit('update:tab-size', value)"
                    />
                </div>

                <div
                    class="items-center hidden rounded-lg lg:flex bg-ui-gray-800"
                    :class="{ 'mr-2': !canToggleLayout }"
                >
                    <ToolbarButton
                        v-if="canRemove && canMoveUp"
                        dusk="button-move-up"
                        class="rounded-l-lg mr-0.5"
                        @click.native="$emit('up', id)"
                    >
                        <ArrowUpIcon
                            class="w-5 h-5"
                            :class="{ 'transform -rotate-90': !landscape }"
                        />
                    </ToolbarButton>

                    <ToolbarButton
                        v-if="canRemove"
                        dusk="button-remove"
                        :class="{ 'rounded-l-lg': !canMoveUp }"
                        class="mr-0.5"
                        @click.native="$emit('remove', id)"
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
                    >
                        <PlusIcon class="w-5 h-5" />
                    </ToolbarButton>

                    <ToolbarButton
                        v-if="canRemove && canMoveDown"
                        dusk="button-move-down"
                        class="rounded-r-lg"
                        @click.native="$emit('down', id)"
                    >
                        <ArrowDownIcon
                            class="w-5 h-5"
                            :class="{ 'transform -rotate-90': !landscape }"
                        />
                    </ToolbarButton>
                </div>

                <div v-if="canToggleLayout" class="items-center hidden mr-2 lg:flex">
                    <ToolbarButton
                        v-if="landscape"
                        class="rounded-lg"
                        dusk="button-toggle-portrait"
                        @click.native="$emit('update:layout', true)"
                    >
                        <CreditCardIcon class="w-5 h-5" />
                    </ToolbarButton>

                    <ToolbarButton
                        v-else
                        class="rounded-lg"
                        dusk="button-toggle-landscape"
                        @click.native="$emit('update:layout', false)"
                    >
                        <ColumnsIcon class="w-5 h-5" />
                    </ToolbarButton>
                </div>
            </div>
        </div>

        <div ref="container" class="w-full h-full">
            <Monaco
                class="w-full h-full"
                :width="width"
                :height="height"
                :value="value"
                :tab-size="tabSize"
                :language="languageAlias"
                @input="$emit('input', $event)"
            />
        </div>
    </div>
</template>

<script>
import {
    PlusIcon,
    MinusIcon,
    ColumnsIcon,
    CreditCardIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from 'vue-feather-icons';
import { orderBy } from 'lodash';
import {
    ref,
    watch,
    toRefs,
    computed,
    useContext,
    onMounted,
    onUnmounted,
    onBeforeUnmount,
} from '@nuxtjs/composition-api';

export default {
    props: {
        id: String,
        sizes: Array,
        value: String,
        tabSize: [String, Number],
        language: String,
        options: Object,
        landscape: Boolean,
        canRemove: Boolean,
        canMoveUp: Boolean,
        canMoveDown: Boolean,
        canToggleLayout: Boolean,
    },

    components: {
        PlusIcon,
        MinusIcon,
        ColumnsIcon,
        CreditCardIcon,
        ArrowUpIcon,
        ArrowDownIcon,
        ArrowLeftIcon,
        ArrowRightIcon,
    },

    setup(props) {
        const { sizes, landscape, language } = toRefs(props);

        const { $bus, $shiki } = useContext();

        const width = ref(0);
        const height = ref(0);
        const root = ref(null);
        const toolbar = ref(null);

        const languages = computed(() => orderBy(['bash', 'shell', ...$shiki.languages()]));

        const languageAlias = computed(
            () =>
                ({
                    bash: 'shell',
                    antlers: 'html',
                    blade: 'html',
                    vue: 'html',
                }[language.value] ?? language.value)
        );

        const updateMonacoDimensions = () => {
            if (root.value && root.value.offsetParent) {
                width.value = root.value.clientWidth;
                height.value = root.value.clientHeight - toolbar.value.clientHeight;
            }
        };

        onMounted(() => {
            updateMonacoDimensions();

            watch([sizes, landscape], updateMonacoDimensions);

            $bus.$on('editors:refresh', updateMonacoDimensions);

            window.addEventListener('resize', updateMonacoDimensions);
        });

        onUnmounted(() => $bus.$emit('editors:refresh'));

        onBeforeUnmount(() => window.removeEventListener('resize', updateMonacoDimensions));

        return {
            root,
            width,
            height,
            toolbar,
            languages,
            languageAlias,
        };
    },
};
</script>
