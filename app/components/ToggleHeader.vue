<template>
    <Toggle v-bind="$attrs" popover-title="Header Properties" settings-tooltip="Configure Header">
        <template #popover>
            <div class="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                <div
                    class="grid grid-cols-2 grid-rows-2"
                    :class="{
                        'pointer-events-none opacity-40 grayscale select-none': locked,
                    }"
                >
                    <div
                        class="flex items-center justify-between gap-2 border-r border-b border-zinc-200 p-2 dark:border-zinc-800"
                    >
                        <Label>Title</Label>

                        <div class="flex items-center">
                            <Toggle
                                :model-value="showTitle"
                                @update:model-value="$emit('update:show-title', $event)"
                            />
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between gap-2 border-b border-zinc-200 p-2 dark:border-zinc-800"
                    >
                        <Label>Accent</Label>

                        <div class="flex items-center">
                            <Toggle
                                :model-value="showHeaderAccent"
                                @update:model-value="$emit('update:show-header-accent', $event)"
                            />
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between gap-2 border-r border-zinc-200 p-2 dark:border-zinc-800"
                    >
                        <Label class="whitespace-nowrap">Menu</Label>

                        <div class="flex items-center">
                            <Toggle
                                :model-value="showMenu"
                                @update:model-value="$emit('update:show-menu', $event)"
                            />
                        </div>
                    </div>

                    <div class="flex items-center justify-between gap-2 p-2">
                        <Label class="whitespace-nowrap">Menu Color</Label>

                        <div class="flex items-center">
                            <Toggle
                                :model-value="showColorMenu"
                                @update:model-value="$emit('update:show-color-menu', $event)"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between gap-3 p-2">
                    <Label class="whitespace-nowrap">Title Color</Label>

                    <ButtonColorPicker
                        :model-value="titleColor"
                        @change="$emit('update:title-color', $event)"
                    />
                </div>
            </div>
        </template>
    </Toggle>
</template>

<script setup>
defineProps({
    showTitle: { type: Boolean, required: true },
    showMenu: { type: Boolean, required: true },
    showColorMenu: { type: Boolean, required: true },
    showHeaderAccent: { type: Boolean, required: true },
    titleColor: { type: Object, required: true },
    locked: { type: Boolean, default: false },
});

defineEmits([
    'update:show-title',
    'update:show-menu',
    'update:show-color-menu',
    'update:show-header-accent',
    'update:title-color',
]);
</script>
