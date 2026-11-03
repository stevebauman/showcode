<template>
    <div
        class="flex h-7 w-26 items-center"
        :class="
            compact
                ? 'rounded-full border-0 bg-transparent'
                : 'rounded-control border-ui-line bg-ui-field overflow-hidden border'
        "
    >
        <input
            v-model="percentage"
            aria-label="Canvas zoom"
            :title="fullPercentage()"
            inputmode="decimal"
            spellcheck="false"
            class="text-ui-text focus:bg-ui-hover h-full min-w-0 flex-1 truncate border-0 bg-transparent px-2 text-right text-xs tabular-nums outline-none"
            @focus="startEditing"
            @input="edited = true"
            @blur="applyPercentage"
            @keydown.enter="$event.target.blur()"
            @keydown.esc="revertPercentage($event)"
            @keydown.up.prevent="$emit('update:model-value', modelValue * 2)"
            @keydown.down.prevent="$emit('update:model-value', modelValue / 2)"
        />
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <button
                    type="button"
                    aria-label="Zoom options"
                    class="text-ui-muted hover:bg-ui-hover hover:text-ui-text flex h-full w-6 shrink-0 items-center justify-center"
                >
                    <ChevronDownIcon class="size-3" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" class="w-44">
                <DropdownMenuItem @select="$emit('update:model-value', modelValue * 2)">
                    Zoom in
                </DropdownMenuItem>
                <DropdownMenuItem @select="$emit('update:model-value', modelValue / 2)">
                    Zoom out
                </DropdownMenuItem>
                <DropdownMenuItem @select="$emit('fit')">Zoom to fit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    v-for="preset in [25, 50, 100, 200, 400]"
                    :key="preset"
                    @select="$emit('update:model-value', preset / 100)"
                >
                    {{ preset }}%
                    <CheckIcon v-if="modelValue === preset / 100" class="ml-auto size-3" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @select="$emit('reset')">Reset view</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { CheckIcon, ChevronDownIcon } from 'lucide-vue-next';

const props = defineProps({
    modelValue: { type: Number, required: true },
    compact: { type: Boolean, default: false },
});
const emit = defineEmits(['update:model-value', 'fit', 'reset']);
const percentage = ref('');
const edited = ref(false);

function fullPercentage() {
    return `${props.modelValue * 100}%`;
}

function formatPercentage() {
    const value = props.modelValue * 100;
    const rounded = Number(value.toFixed(2));

    return `${rounded || Number(value.toPrecision(3))}%`;
}

function startEditing(event) {
    percentage.value = fullPercentage();
    edited.value = false;
    nextTick(() => event.target.select());
}

watch(
    () => props.modelValue,
    () => (percentage.value = formatPercentage()),
    { immediate: true }
);

function applyPercentage() {
    const value = Number(percentage.value.trim().replace(/%$/, '')) / 100;

    if (edited.value && Number.isFinite(value) && value > 0) {
        emit('update:model-value', value);
    }

    percentage.value = formatPercentage();
    edited.value = false;
}

function revertPercentage(event) {
    edited.value = false;
    percentage.value = formatPercentage();
    event.target.blur();
}
</script>
