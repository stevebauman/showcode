<template>
    <div v-if="aspectRatios.length" class="flex items-center justify-between gap-3">
        <Label :for="id" class="text-ui-muted">Aspect ratio</Label>
        <Select :model-value="value" @update:model-value="selectRatio">
            <SelectTrigger :id="id" aria-label="Aspect ratio" class="w-36">
                <SelectValue>{{ value === 'custom' ? 'Custom' : value }}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="custom">
                    <span class="flex items-center gap-3">
                        <span aria-hidden="true" class="flex h-5 w-8 items-center justify-center">
                            <ScanIcon class="text-ui-muted size-4" />
                        </span>
                        Custom
                    </span>
                </SelectItem>
                <SelectItem
                    v-for="([x, y], index) in aspectRatios"
                    :key="index"
                    :value="`${x}:${y}`"
                    :disabled="lockWindowSize"
                >
                    <span class="flex items-center gap-3">
                        <span aria-hidden="true" class="flex h-5 w-8 items-center justify-center">
                            <span
                                class="border-ui-muted/70 bg-ui-hover rounded-sm border"
                                :style="{
                                    width: `${Math.min(32, (x / y) * 20)}px`,
                                    height: `${Math.min(20, (y / x) * 32)}px`,
                                }"
                            />
                        </span>
                        {{ x }}:{{ y }}
                    </span>
                </SelectItem>
            </SelectContent>
        </Select>
    </div>
</template>

<script setup>
import { computed, useId } from 'vue';
import { ScanIcon } from 'lucide-vue-next';

const props = defineProps({
    aspectRatio: { type: Array, required: false },
    aspectRatios: { type: Array, required: true },
    lockWindowSize: { type: Boolean, required: true },
});

const emit = defineEmits(['select', 'custom']);
const id = useId();
const value = computed(() => props.aspectRatio?.join(':') ?? 'custom');

function selectRatio(value) {
    if (value === 'custom') {
        emit('custom');
        return;
    }

    emit('select', ...value.split(':').map(Number));
}
</script>
