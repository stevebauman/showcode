<template>
    <Toggle
        v-bind="$attrs"
        popover-title="Social Badge Properties"
        settings-tooltip="Configure Social Badge"
    >
        <template #popover>
            <div class="flex flex-col divide-y divide-ui-gray-800 w-80">
                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Type </Label>

                    <Select
                        :model-value="socialType"
                        :options="types"
                        @update:model-value="$emit('update:social-type', $event)"
                    />
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Username </Label>

                    <Input
                        size="sm"
                        type="text"
                        autocomplete="off"
                        :model-value="socialUsername"
                        @update:model-value="$emit('update:social-username', $event)"
                    />
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Display Name </Label>

                    <Input
                        size="sm"
                        type="text"
                        autocomplete="off"
                        :model-value="socialDisplayName"
                        @update:model-value="$emit('update:social-display-name', $event)"
                    />
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Position </Label>

                    <Select
                        :model-value="socialPosition"
                        :options="positions"
                        @update:model-value="$emit('update:social-position', $event)"
                    />
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2">
                        Border Radius

                        <span class="text-xs text-ui-gray-500">
                            ({{ socialBorderRadius }} px)
                        </span>
                    </Label>

                    <Range
                        max="25"
                        step="1"
                        :model-value="socialBorderRadius"
                        @update:model-value="$emit('update:social-border-radius', $event)"
                    />
                </div>
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
</script>
