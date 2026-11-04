<template>
    <UiPopover v-model:open="open">
        <PopoverTrigger as-child>
            <button
                type="button"
                :aria-label="buttonAriaLabel"
                :title="modelValue"
                :class="
                    cn(
                        'ui-field rounded-control flex h-7 items-center justify-between border px-2 py-1 text-start text-xs disabled:cursor-not-allowed disabled:opacity-50',
                        formControlFocusClasses,
                        props.class
                    )
                "
            >
                <span class="truncate">{{ modelValue }}</span>
                <ChevronsUpDownIcon class="ml-2 size-3 shrink-0 opacity-50" />
            </button>
        </PopoverTrigger>

        <PopoverContent
            :side="side"
            :side-flip="side !== 'top'"
            align="start"
            :collision-padding="8"
            :class="
                cn(
                    'flex max-h-[var(--reka-popover-content-available-height)] w-56 flex-col p-1',
                    contentClass
                )
            "
        >
            <div class="flex min-h-0 flex-col overflow-hidden">
                <div class="shrink-0 p-1">
                    <Input
                        ref="searchInput"
                        v-model="search"
                        :placeholder="placeholder"
                        class="border-0"
                        @keydown="handleSearchKeydown"
                    />
                </div>

                <div class="ui-menu-separator" role="separator" />

                <ScrollArea ref="optionsScrollArea" class="h-72 min-h-0">
                    <div class="p-1">
                        <button
                            v-for="option in filteredOptions"
                            :key="option"
                            type="button"
                            :data-active-searchable-select-option="
                                activeOption === option ? 'true' : undefined
                            "
                            class="ui-menu-item relative flex w-full items-center py-1 pr-2 pl-6 text-left text-xs"
                            @mouseenter="activeOption = option"
                            @click="selectOption(option)"
                        >
                            <CheckIcon
                                v-if="option === modelValue"
                                class="absolute left-2 size-4"
                            />
                            <span class="truncate">{{ option }}</span>
                        </button>

                        <div
                            v-if="filteredOptions.length === 0"
                            class="px-2 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400"
                        >
                            {{ emptyText }}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </PopoverContent>
    </UiPopover>
</template>

<script setup>
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';
import { Popover as UiPopover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formControlFocusClasses } from '@/lib/utils';

const props = defineProps({
    modelValue: { type: String, default: '' },
    buttonAriaLabel: { type: String, default: undefined },
    side: { type: String, default: 'bottom' },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Search...' },
    emptyText: { type: String, default: 'No results found.' },
    class: { type: null, default: null },
    contentClass: { type: null, default: null },
});

const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const search = ref('');
const searchInput = ref(null);
const optionsScrollArea = ref(null);
const activeOption = ref(null);

const filteredOptions = computed(() => {
    const query = search.value.trim().toLowerCase();

    if (!query) {
        return props.options;
    }

    return props.options.filter((option) => option.toLowerCase().includes(query));
});

function selectOption(option) {
    emit('update:modelValue', option);
    open.value = false;
}

function activateCurrentOption() {
    activeOption.value = filteredOptions.value.includes(props.modelValue)
        ? props.modelValue
        : filteredOptions.value[0];
}

function moveActiveOption(direction) {
    if (filteredOptions.value.length === 0) {
        activeOption.value = null;
        return;
    }

    const currentIndex = filteredOptions.value.indexOf(activeOption.value);
    const fallbackIndex = direction > 0 ? -1 : 0;
    const nextIndex = (currentIndex === -1 ? fallbackIndex : currentIndex) + direction;

    activeOption.value =
        filteredOptions.value[
            (nextIndex + filteredOptions.value.length) % filteredOptions.value.length
        ];
}

function handleSearchKeydown(event) {
    event.stopPropagation();

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActiveOption(1);
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActiveOption(-1);
        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();

        if (activeOption.value) {
            selectOption(activeOption.value);
        }

        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        open.value = false;
    }
}

watch(open, async (isOpen) => {
    if (!isOpen) {
        search.value = '';
        activeOption.value = null;
        return;
    }

    activateCurrentOption();

    await nextTick();
    searchInput.value?.$el?.focus?.();
});

watch(filteredOptions, () => {
    if (!open.value) {
        return;
    }

    if (!filteredOptions.value.includes(activeOption.value)) {
        activateCurrentOption();
    }
});

watch(activeOption, async () => {
    if (!open.value) {
        return;
    }

    await nextTick();

    optionsScrollArea.value?.$el
        ?.querySelector('[data-active-searchable-select-option="true"]')
        ?.scrollIntoView({ block: 'nearest' });
});
</script>
