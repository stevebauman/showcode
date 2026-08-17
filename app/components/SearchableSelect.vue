<template>
    <UiPopover v-model:open="open">
        <PopoverTrigger as-child>
            <button
                type="button"
                :class="
                    cn(
                        'rounded-control flex h-7 items-center justify-between border border-zinc-200/80 bg-zinc-100/80 px-2 py-1 text-start text-xs transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/[0.07]',
                        formControlFocusClasses,
                        props.class
                    )
                "
            >
                <span class="truncate">{{ modelValue }}</span>
                <ChevronsUpDownIcon class="ml-2 size-3 shrink-0 opacity-50" />
            </button>
        </PopoverTrigger>

        <PopoverContent align="start" :class="cn('w-56 p-2', contentClass)">
            <div
                class="rounded-control overflow-hidden border border-zinc-200/80 bg-zinc-50/50 dark:border-white/5 dark:bg-white/[0.03]"
            >
                <div class="border-b border-zinc-200 p-1 dark:border-zinc-800">
                    <Input
                        ref="searchInput"
                        v-model="search"
                        :placeholder="placeholder"
                        class="border-0"
                        @keydown="handleSearchKeydown"
                    />
                </div>

                <ScrollArea ref="optionsScrollArea" class="h-72">
                    <div class="p-1">
                        <button
                            v-for="option in filteredOptions"
                            :key="option"
                            type="button"
                            :data-active-searchable-select-option="
                                activeOption === option ? 'true' : undefined
                            "
                            class="relative flex w-full items-center rounded-xs py-1 pr-2 pl-6 text-left text-xs outline-hidden hover:bg-zinc-100 focus:bg-zinc-100 data-[active-searchable-select-option=true]:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:data-[active-searchable-select-option=true]:bg-zinc-800"
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
