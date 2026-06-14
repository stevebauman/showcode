<template>
    <div ref="root" class="relative">
        <div
            class="absolute right-1 bottom-1 left-1 z-10 rounded-md border border-zinc-200 bg-white/80 opacity-60 backdrop-blur-xl transition-opacity duration-200 focus-within:opacity-100 hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900/80"
        >
            <ScrollArea orientation="horizontal">
                <div ref="toolbar" class="box-border flex w-full items-center px-2 py-1.5">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2">
                            <label
                                class="hidden text-[0.6875rem] leading-none font-medium tracking-wide whitespace-nowrap text-zinc-500 uppercase xl:inline-block dark:text-zinc-400"
                            >
                                Lang
                            </label>

                            <UiPopover v-model:open="languagePickerOpen">
                                <PopoverTrigger as-child>
                                    <button
                                        type="button"
                                        class="flex h-8 w-32 items-center justify-between rounded-md border border-zinc-200 bg-white px-2 py-1 text-start text-xs focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                                    >
                                        <span class="truncate">{{ language }}</span>
                                        <ChevronsUpDownIcon class="size-4 shrink-0 opacity-50" />
                                    </button>
                                </PopoverTrigger>

                                <PopoverContent align="start" class="w-56 p-0">
                                    <div class="border-b border-zinc-200 p-1 dark:border-zinc-800">
                                        <Input
                                            ref="languageSearchInput"
                                            v-model="languageSearch"
                                            placeholder="Search languages..."
                                            class="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                            @keydown="handleLanguageSearchKeydown"
                                        />
                                    </div>

                                    <ScrollArea class="h-72">
                                        <div class="p-1">
                                            <button
                                                v-for="lang in filteredLanguages"
                                                :key="lang"
                                                type="button"
                                                :data-active-language-option="
                                                    activeLanguage === lang ? 'true' : undefined
                                                "
                                                class="relative flex w-full items-center rounded-xs py-1 pr-2 pl-6 text-left text-xs outline-hidden hover:bg-zinc-100 focus:bg-zinc-100 data-[active-language-option=true]:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:data-[active-language-option=true]:bg-zinc-800"
                                                @mouseenter="activeLanguage = lang"
                                                @click="selectLanguage(lang)"
                                            >
                                                <CheckIcon
                                                    v-if="lang === language"
                                                    class="absolute left-2 size-4"
                                                />
                                                <span class="truncate">{{ lang }}</span>
                                            </button>

                                            <div
                                                v-if="filteredLanguages.length === 0"
                                                class="px-2 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400"
                                            >
                                                No languages found.
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </PopoverContent>
                            </UiPopover>
                        </div>

                        <div class="flex items-center gap-2">
                            <label
                                class="hidden text-[0.6875rem] leading-none font-medium tracking-wide whitespace-nowrap text-zinc-500 uppercase xl:inline-block dark:text-zinc-400"
                            >
                                Tab Size
                            </label>

                            <Select
                                :model-value="String(tabSize)"
                                @update:model-value="$emit('update:tab-size', $event)"
                            >
                                <SelectTrigger class="focus:ring-0 focus:ring-offset-0">
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
                        </div>
                    </div>

                    <div class="ml-auto flex items-stretch gap-3 pl-3">
                        <div
                            class="hidden items-center border-l border-zinc-200 pl-3 lg:flex dark:border-zinc-800"
                        >
                            <ToolbarButton
                                v-if="canRemove && canMoveUp"
                                class="mr-0.5 rounded-l-lg"
                                @click="$emit('up', id)"
                                v-tooltip="'Move Editor'"
                            >
                                <ArrowUpIcon
                                    class="size-5"
                                    :class="{ '-rotate-90 transform': !landscape }"
                                />
                            </ToolbarButton>

                            <ToolbarButton
                                v-if="canRemove"
                                :class="{ 'rounded-l-lg': !canMoveUp }"
                                class="mr-0.5"
                                @click="$emit('remove', id)"
                                v-tooltip="'Remove Editor'"
                            >
                                <MinusIcon class="size-5" />
                            </ToolbarButton>

                            <ToolbarButton
                                :class="{
                                    'mr-0.5': canMoveDown,
                                    'rounded-r-lg': !canMoveDown,
                                    'rounded-l-lg': !canRemove && !canMoveUp,
                                }"
                                @click="$emit('add')"
                                v-tooltip="'Add Editor'"
                            >
                                <PlusIcon class="size-5" />
                            </ToolbarButton>

                            <ToolbarButton
                                v-if="canRemove && canMoveDown"
                                class="rounded-r-lg"
                                @click="$emit('down', id)"
                                v-tooltip="'Move Editor'"
                            >
                                <ArrowDownIcon
                                    class="size-5"
                                    :class="{ '-rotate-90 transform': !landscape }"
                                />
                            </ToolbarButton>
                        </div>

                        <div
                            v-if="canToggleLayout"
                            class="hidden items-center border-l border-zinc-200 pl-3 lg:flex dark:border-zinc-800"
                        >
                            <ToolbarButton
                                v-if="landscape"
                                class="rounded-l-lg"
                                @click="$emit('update:layout')"
                                v-tooltip="'Toggle Layout'"
                            >
                                <CreditCardIcon class="size-5" />
                            </ToolbarButton>

                            <ToolbarButton
                                v-else
                                class="rounded-l-lg"
                                @click="$emit('update:layout')"
                                v-tooltip="'Toggle Layout'"
                            >
                                <ColumnsIcon class="size-5" />
                            </ToolbarButton>

                            <ToolbarButton
                                class="rounded-r-lg"
                                @click="$emit('update:reverse')"
                                v-tooltip="'Move Editor Pane'"
                            >
                                <LogInIcon
                                    class="size-5"
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
            </ScrollArea>
        </div>

        <div ref="container" class="size-full overflow-hidden rounded-[inherit]">
            <Monaco
                ref="monaco"
                class="size-full"
                :width="width"
                :height="height"
                :value="modelValue"
                :added="added"
                :removed="removed"
                :focused="focused"
                :tab-size="tabSize"
                :language="languageAlias"
                @update:modelValue="$emit('update:modelValue', $event)"
                @update:added="$emit('update:added', $event)"
                @update:removed="$emit('update:removed', $event)"
                @update:focused="$emit('update:focused', $event)"
            />
        </div>
    </div>
</template>

<script setup>
import {
    CheckIcon,
    ChevronsUpDownIcon,
    PlusIcon,
    MinusIcon,
    LogInIcon,
    ColumnsIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    CreditCardIcon,
} from 'lucide-vue-next';
import { ref, watch, toRefs, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { Popover as UiPopover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    canToggleLayout: { type: Boolean, default: false },
});

const emit = defineEmits([
    'update:modelValue',
    'update:language',
    'update:tab-size',
    'update:added',
    'update:removed',
    'update:focused',
    'remove',
    'moveUp',
    'moveDown',
    'toggleLayout',
]);

const { sizes, orientation, language } = toRefs(props);
const { $bus, $shiki } = useNuxtApp();
const { options: languageOptions } = useLanguages();

const width = ref(0);
const height = ref(0);
const root = ref(null);
const toolbar = ref(null);
const languageSearch = ref('');
const languagePickerOpen = ref(false);
const languageSearchInput = ref(null);
const activeLanguage = ref(null);

const languages = computed(() => languageOptions($shiki.languages()));
const filteredLanguages = computed(() => {
    const query = languageSearch.value.trim().toLowerCase();

    if (!query) {
        return languages.value;
    }

    return languages.value.filter((lang) => lang.toLowerCase().includes(query));
});
const landscape = computed(() => ['left', 'right'].includes(orientation.value));

const languageAlias = computed(
    () =>
        ({ bash: 'shell', vue: 'html', blade: 'html', antlers: 'html' })[language.value] ??
        language.value
);

function selectLanguage(lang) {
    emit('update:language', lang);
    languagePickerOpen.value = false;
}

function activateCurrentLanguage() {
    activeLanguage.value = filteredLanguages.value.includes(language.value)
        ? language.value
        : filteredLanguages.value[0];
}

function moveActiveLanguage(direction) {
    if (filteredLanguages.value.length === 0) {
        activeLanguage.value = null;
        return;
    }

    const currentIndex = filteredLanguages.value.indexOf(activeLanguage.value);
    const fallbackIndex = direction > 0 ? -1 : 0;
    const nextIndex =
        (currentIndex === -1 ? fallbackIndex : currentIndex) + direction;

    activeLanguage.value =
        filteredLanguages.value[
            (nextIndex + filteredLanguages.value.length) % filteredLanguages.value.length
        ];
}

function handleLanguageSearchKeydown(event) {
    event.stopPropagation();

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActiveLanguage(1);
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActiveLanguage(-1);
        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();

        if (activeLanguage.value) {
            selectLanguage(activeLanguage.value);
        }

        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        languagePickerOpen.value = false;
    }
}

function updateMonacoDimensions() {
    if (root.value && root.value.offsetParent) {
        width.value = root.value.clientWidth;
        height.value = root.value.clientHeight;
    }
}

watch(languagePickerOpen, async (open) => {
    if (!open) {
        languageSearch.value = '';
        activeLanguage.value = null;
        return;
    }

    activateCurrentLanguage();

    await nextTick();
    languageSearchInput.value?.$el?.focus?.();
});

watch(filteredLanguages, async () => {
    if (!languagePickerOpen.value) {
        return;
    }

    if (!filteredLanguages.value.includes(activeLanguage.value)) {
        activateCurrentLanguage();
    }
});

watch(activeLanguage, async () => {
    if (!languagePickerOpen.value) {
        return;
    }

    await nextTick();

    document
        .querySelector('[data-active-language-option="true"]')
        ?.scrollIntoView({ block: 'nearest' });
});

useResizeObserver(document.body, updateMonacoDimensions);

onMounted(() => {
    updateMonacoDimensions();
    watch([sizes, orientation], updateMonacoDimensions);
    $bus.$on('editors:refresh', updateMonacoDimensions);
});

onUnmounted(() => $bus.$emit('editors:refresh'));
</script>
