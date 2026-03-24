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

                    <Select :model-value="socialType" @update:model-value="$emit('update:social-type', $event)">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="type in types" :key="type.name" :value="type.name">{{ type.title }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Username </Label>

                    <Input
                        type="text"
                        autocomplete="off"
                        :value="socialUsername"
                        @update:model-value="$emit('update:social-username', $event)"
                    />
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Display Name </Label>

                    <Input
                        type="text"
                        autocomplete="off"
                        :value="socialDisplayName"
                        @update:model-value="$emit('update:social-display-name', $event)"
                    />
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2"> Position </Label>

                    <Select :model-value="socialPosition" @update:model-value="$emit('update:social-position', $event)">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="pos in positions" :key="pos.name" :value="pos.name">{{ pos.title }}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="grid grid-cols-2 items-center p-2">
                    <Label class="text-right p-2">
                        Border Radius

                        <span class="text-xs text-ui-gray-500">
                            ({{ socialBorderRadius }} px)
                        </span>
                    </Label>

                    <Slider
                        :max="25"
                        :step="1"
                        :model-value="[socialBorderRadius]"
                        @update:model-value="$emit('update:social-border-radius', $event[0])"
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
