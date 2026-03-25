<template>
    <Toggle
        v-bind="$attrs"
       
        popover-title="Header Properties"
        settings-tooltip="Configure Header"
    >
        <template #popover>
            <div class="grid grid-cols-2 grid-rows-2">
                <div
                    class="flex items-center justify-between border-r border-b border-zinc-200 dark:border-zinc-800 gap-2 p-2"
                >
                    <Label> Title </Label>

                    <div class="flex items-center">
                        <Toggle
                           
                            :model-value="showTitle"
                            @update:model-value="$emit('update:show-title', $event)"
                        />
                    </div>
                </div>

                <div
                    class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 gap-2 p-2"
                >
                    <Label> Accent </Label>

                    <div class="flex items-center">
                        <Toggle
                           
                            :model-value="showHeaderAccent"
                            @update:model-value="$emit('update:show-header-accent', $event)"
                        />
                    </div>
                </div>

                <div
                    class="flex items-center justify-between border-r border-zinc-200 dark:border-zinc-800 gap-2 p-2"
                >
                    <Label class="whitespace-nowrap"> Menu </Label>

                    <div class="flex items-center">
                        <Toggle
                           
                            :model-value="showMenu"
                            @update:model-value="$emit('update:show-menu', $event)"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between gap-2 p-2">
                    <Label class="whitespace-nowrap"> Menu Color </Label>

                    <div class="flex items-center">
                        <Toggle
                           
                            :model-value="showColorMenu"
                            @update:model-value="$emit('update:show-color-menu', $event)"
                        />
                    </div>
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
});

defineEmits(['update:show-title', 'update:show-menu', 'update:show-color-menu', 'update:show-header-accent']);
</script>
