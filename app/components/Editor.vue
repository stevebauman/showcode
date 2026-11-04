<template>
    <div ref="root" class="relative flex min-h-0 flex-col overflow-hidden">
        <div ref="container" class="min-h-0 flex-1 overflow-hidden">
            <Monaco
                ref="monaco"
                class="size-full"
                :value="modelValue"
                :added="added"
                :removed="removed"
                :focused="focused"
                :tab-size="tabSize"
                :language="languageAlias"
                :show-line-numbers="showLineNumbers"
                @update:modelValue="$emit('update:modelValue', $event)"
                @update:added="$emit('update:added', $event)"
                @update:removed="$emit('update:removed', $event)"
                @update:focused="$emit('update:focused', $event)"
            />
        </div>

        <div
            ref="toolbar"
            role="group"
            aria-label="Editor tools"
            class="floating-toolbar editor-dock scrollbar-hide border-ui-line bg-ui-chrome absolute right-3 bottom-3 z-20 flex items-center gap-0.5 overflow-x-auto rounded-full border p-1"
            :class="canHide ? 'max-w-[calc(100%-4.75rem)]' : 'max-w-[calc(100%-1.5rem)]'"
        >
            <SearchableSelect
                :model-value="language"
                :options="languages"
                button-aria-label="Code language"
                side="top"
                placeholder="Search languages..."
                empty-text="No languages found."
                class="hover:bg-ui-hover max-w-32 min-w-0 flex-1 rounded-full border-transparent bg-transparent font-medium shadow-none"
                @update:model-value="$emit('update:language', $event)"
            />

            <template v-if="canRemove">
                <Button
                    v-if="canMoveUp"
                    type="button"
                    :aria-label="landscape ? 'Move editor up' : 'Move editor left'"
                    variant="ghost"
                    size="icon"
                    class="size-7 shrink-0 rounded-full"
                    v-tooltip="landscape ? 'Move editor up' : 'Move editor left'"
                    @click="$emit('up', id)"
                >
                    <ArrowUpIcon class="!size-3.5" :class="{ '-rotate-90': !landscape }" />
                </Button>
                <Button
                    v-if="canMoveDown"
                    type="button"
                    :aria-label="landscape ? 'Move editor down' : 'Move editor right'"
                    variant="ghost"
                    size="icon"
                    class="size-7 shrink-0 rounded-full"
                    v-tooltip="landscape ? 'Move editor down' : 'Move editor right'"
                    @click="$emit('down', id)"
                >
                    <ArrowDownIcon class="!size-3.5" :class="{ '-rotate-90': !landscape }" />
                </Button>
            </template>

            <div class="bg-ui-line mx-0.5 h-4 w-px shrink-0" aria-hidden="true" />

            <PopoverPanel title="Editor Settings" :resets="false">
                <template #trigger>
                    <Button
                        type="button"
                        aria-label="Editor settings"
                        variant="ghost"
                        size="icon"
                        class="size-7 shrink-0 rounded-full"
                        v-tooltip="'Editor settings'"
                    >
                        <SlidersHorizontalIcon class="!size-3.5" />
                    </Button>
                </template>

                <div class="property-fields">
                    <PropertyField label="Tab size" v-slot="{ id }">
                        <Select
                            :model-value="String(tabSize)"
                            @update:model-value="$emit('update:tab-size', $event)"
                        >
                            <SelectTrigger :id="id" aria-label="Editor tab size">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="size in [2, 4]"
                                    :key="size"
                                    :value="String(size)"
                                >
                                    {{ size }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </PropertyField>
                    <PropertyField label="Line numbers" v-slot="{ id }">
                        <Toggle
                            :id="id"
                            aria-label="Editor line numbers"
                            :model-value="showLineNumbers"
                            @update:model-value="$emit('update:show-line-numbers', $event)"
                        />
                    </PropertyField>
                </div>
            </PopoverPanel>

            <Button
                v-if="canRemove"
                type="button"
                aria-label="Remove editor"
                variant="ghost"
                size="icon"
                class="size-7 shrink-0 rounded-full"
                v-tooltip="'Remove editor'"
                @click="$emit('remove', id)"
            >
                <MinusIcon class="!size-4" />
            </Button>

            <Button
                type="button"
                aria-label="Add editor"
                variant="ghost"
                size="icon"
                class="size-7 shrink-0 rounded-full"
                v-tooltip="'Add editor'"
                @click="$emit('add')"
            >
                <PlusIcon class="!size-4" />
            </Button>
        </div>

        <div
            v-if="canHide"
            role="group"
            aria-label="Editor visibility"
            class="floating-toolbar editor-dock border-ui-line bg-ui-chrome absolute bottom-3 left-3 z-20 flex items-center rounded-full border p-1"
        >
            <Button
                ref="hideButton"
                type="button"
                aria-label="Hide code editor"
                :aria-controls="paneId"
                :aria-expanded="true"
                variant="ghost"
                size="icon"
                class="size-7 shrink-0 rounded-full"
                v-tooltip="'Hide code editor'"
                @click="$emit('hide')"
            >
                <component :is="hideIcon" class="!size-4" />
            </Button>
        </div>
    </div>
</template>

<script setup>
import {
    PlusIcon,
    MinusIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    SlidersHorizontalIcon,
    PanelLeftCloseIcon,
    PanelRightCloseIcon,
    PanelTopCloseIcon,
    PanelBottomCloseIcon,
} from 'lucide-vue-next';
import { ref, toRefs, computed, onUnmounted } from 'vue';

const props = defineProps({
    id: { type: String, required: true },
    sizes: { type: Array, default: [] },
    modelValue: { type: String, default: '' },
    added: { type: Array, default: () => [] },
    removed: { type: Array, default: () => [] },
    focused: { type: Array, default: () => [] },
    orientation: { type: String, default: 'left' },
    tabSize: { type: [String, Number], default: 4 },
    language: { type: String, default: 'php' },
    options: { type: Object, default: () => ({}) },
    canRemove: { type: Boolean, default: false },
    canMoveUp: { type: Boolean, default: false },
    canMoveDown: { type: Boolean, default: false },
    canHide: { type: Boolean, default: false },
    paneId: String,
    showLineNumbers: { type: Boolean, default: true },
});

defineEmits([
    'update:modelValue',
    'update:language',
    'update:tab-size',
    'update:added',
    'update:removed',
    'update:focused',
    'update:show-line-numbers',
    'remove',
    'add',
    'up',
    'down',
    'hide',
]);

const { orientation, language } = toRefs(props);
const { $bus, $shiki } = useNuxtApp();
const { options: languageOptions } = useLanguages();

const root = ref(null);
const toolbar = ref(null);
const hideButton = ref(null);
const hideIcon = computed(
    () =>
        ({
            left: PanelLeftCloseIcon,
            right: PanelRightCloseIcon,
            top: PanelTopCloseIcon,
            bottom: PanelBottomCloseIcon,
        })[orientation.value]
);

defineExpose({ focusToggle: () => hideButton.value?.$el?.focus({ preventScroll: true }) });

const languages = computed(() => languageOptions($shiki.languages()));
const landscape = computed(() => ['left', 'right'].includes(orientation.value));

const languageAlias = computed(
    () =>
        ({ bash: 'shell', vue: 'html', blade: 'html', antlers: 'html' })[language.value] ??
        language.value
);

onUnmounted(() => $bus.$emit('editors:refresh'));
</script>

<style scoped>
.editor-dock {
    box-shadow: 0 4px 16px rgb(0 0 0 / 16%);
}
</style>
