<template>
    <div>
        <div
            ref="toolbar"
            class="flex items-center justify-between w-full overflow-auto bg-ui-gray-700"
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

export default {
    props: {
        id: String,
        value: String,
        size: Number,
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

    watch: {
        size() {
            this.updateMonacoDimensions();
        },

        landscape() {
            this.updateMonacoDimensions();
        },
    },

    data() {
        return {
            width: 0,
            height: 0,
        };
    },

    mounted() {
        this.updateMonacoDimensions();

        window.addEventListener('resize', this.updateMonacoDimensions);

        this.$bus.$on('editors:refresh', this.updateMonacoDimensions);
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.updateMonacoDimensions);
    },

    methods: {
        updateMonacoDimensions() {
            this.$nextTick(() => {
                if (this.$el && this.$el.offsetParent) {
                    this.width = this.$el.clientWidth;
                    this.height = this.$el.clientHeight - this.$refs.toolbar.clientHeight;
                }
            });
        },
    },

    computed: {
        languages() {
            return orderBy(['bash', 'shell', ...this.$shiki.languages()]);
        },

        languageAlias() {
            return (
                {
                    bash: 'shell',
                    antlers: 'html',
                    blade: 'html',
                    vue: 'html',
                }[this.language] ?? this.language
            );
        },
    },
};
</script>
