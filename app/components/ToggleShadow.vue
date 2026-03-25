<template>
    <Toggle
        v-bind="$attrs"
       
        popover-title="Shadow Properties"
        settings-tooltip="Configure Shadow"
    >
        <template #popover>
            <div class="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                <div class="grid grid-cols-2 gap-2 divide-x divide-zinc-200 dark:divide-zinc-800">
                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> X </Label>

                        <Input
                            type="number"
                            :model-value="shadowX"
                            class="w-16 text-center"
                            @update:model-value="$emit('update:shadow-x', $event)"
                        />
                    </div>

                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Blur </Label>

                        <Input
                            type="number"
                            :model-value="shadowBlur"
                            class="w-16 text-center"
                            @update:model-value="$emit('update:shadow-blur', $event)"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 divide-x divide-zinc-200 dark:divide-zinc-800">
                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Y </Label>

                        <Input
                            type="number"
                            :model-value="shadowY"
                            class="w-16 text-center"
                            @update:model-value="$emit('update:shadow-y', $event)"
                        />
                    </div>

                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Spread </Label>

                        <Input
                            type="number"
                            :model-value="shadowSpread"
                            class="w-16 text-center"
                            @update:model-value="$emit('update:shadow-spread', $event)"
                        />
                    </div>
                </div>

                <div class="col-span-2 p-2">
                    <ButtonColorPicker
                        :model-value="shadowColor"
                        @change="$emit('update:shadow-color', $event)"
                    />
                </div>
            </div>
        </template>
    </Toggle>
</template>

<script setup>
defineProps({
    shadowColor: { type: Object, required: true },
    shadowX: { type: [Number, String], required: true },
    shadowY: { type: [Number, String], required: true },
    shadowBlur: { type: [Number, String], required: true },
    shadowSpread: { type: [Number, String], required: true },
});

defineEmits(['update:shadow-x', 'update:shadow-y', 'update:shadow-blur', 'update:shadow-spread', 'update:shadow-color']);
</script>
