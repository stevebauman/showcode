<template>
    <Toggle
        v-bind="$attrs"
        popover-title="Social Badge Properties"
        settings-tooltip="Configure Social Badge"
    >
        <template #popover>
            <div class="space-y-4 px-3 pt-3 pb-4">
                <div v-for="group in positionGroups" :key="group.label">
                    <div class="text-ui-muted mb-2 text-xs">{{ group.label }}</div>
                    <div role="group" :aria-label="group.label" class="grid grid-cols-3 gap-2">
                        <button
                            v-for="position in group.positions"
                            :key="position.name"
                            type="button"
                            class="property-choice"
                            :aria-label="position.title"
                            :aria-pressed="socialPosition === position.name"
                            @click="$emit('update:social-position', position.name)"
                        >
                            <span aria-hidden="true" class="relative h-11 w-full">
                                <span
                                    class="border-ui-muted/50 bg-ui-canvas absolute inset-x-0 top-0 h-8 rounded-sm border"
                                />
                                <span
                                    class="bg-ui-text absolute h-1.5 w-4 rounded-full"
                                    :class="[
                                        position.name.startsWith('inside') ? 'top-5' : 'top-9',
                                        position.name.endsWith('left') && 'left-1',
                                        position.name.endsWith('center') &&
                                            'left-1/2 -translate-x-1/2',
                                        position.name.endsWith('right') && 'right-1',
                                    ]"
                                />
                            </span>
                            {{ position.title.split(' ').at(-1) }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="property-fields">
                <PropertyField label="Type" v-slot="{ id }">
                    <Select
                        :model-value="socialType"
                        @update:model-value="$emit('update:social-type', $event)"
                    >
                        <SelectTrigger :id="id"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="option in types"
                                :key="option.name"
                                :value="option.name"
                            >
                                {{ option.title }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </PropertyField>
                <PropertyField label="Username" v-slot="{ id }">
                    <Input
                        :id="id"
                        type="text"
                        autocomplete="off"
                        :model-value="socialUsername"
                        @update:model-value="$emit('update:social-username', $event)"
                    />
                </PropertyField>
                <PropertyField label="Display Name" v-slot="{ id }">
                    <Input
                        :id="id"
                        type="text"
                        autocomplete="off"
                        :model-value="socialDisplayName"
                        @update:model-value="$emit('update:social-display-name', $event)"
                    />
                </PropertyField>
                <PropertyField label="Radius" v-slot="{ id }">
                    <Input
                        :id="id"
                        type="number"
                        min="0"
                        max="25"
                        :model-value="socialBorderRadius"
                        @update:model-value="$emit('update:social-border-radius', Number($event))"
                    />
                </PropertyField>
            </div>
        </template>
    </Toggle>
</template>

<script setup>
import useSocials from '@/composables/useSocials';

defineProps({
    socialType: String,
    socialPosition: String,
    socialUsername: String,
    socialDisplayName: String,
    socialBorderRadius: Number,
});

const { types, positions } = useSocials();
const positionGroups = [
    {
        label: 'Inside window',
        positions: positions.filter((position) => position.name.startsWith('inside')),
    },
    {
        label: 'Below window',
        positions: positions.filter((position) => position.name.startsWith('bottom')),
    },
];
defineEmits([
    'update:social-type',
    'update:social-position',
    'update:social-username',
    'update:social-display-name',
    'update:social-border-radius',
]);
</script>
