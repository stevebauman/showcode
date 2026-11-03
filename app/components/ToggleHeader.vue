<template>
    <Toggle v-bind="$attrs" popover-title="Header Properties" settings-tooltip="Configure Header">
        <template #popover>
            <div
                class="property-preview relative mx-3 mt-3 flex h-20 items-start pt-3"
                aria-label="Header preview"
            >
                <div
                    class="border-ui-line bg-ui-field relative mx-3 flex h-8 w-full items-center rounded-t border"
                    :class="{ '!bg-ui-hover': showHeaderAccent }"
                >
                    <FauxMenu
                        v-if="showMenu"
                        class="absolute left-2 !gap-1 [&>div]:!size-1.5"
                        :appearance="{
                            theme: showColorMenu ? 'color' : 'dark',
                            themeBackground: '#303030',
                        }"
                    />
                    <span
                        v-if="showTitle"
                        class="mx-8 w-full truncate text-center text-[10px]"
                        :style="{
                            color: titleColor
                                ? `rgba(${titleColor.red}, ${titleColor.green}, ${titleColor.blue}, ${titleColor.alpha})`
                                : undefined,
                        }"
                    >
                        Untitled-1
                    </span>
                </div>
                <div aria-hidden="true" class="absolute inset-x-6 bottom-3 space-y-1">
                    <div class="bg-ui-muted/20 h-1 w-20 rounded" />
                    <div class="bg-ui-muted/10 h-1 w-28 rounded" />
                </div>
            </div>
            <div class="property-fields">
                <PropertyField label="Title" v-slot="{ id }">
                    <Toggle
                        :id="id"
                        :disabled="locked"
                        :model-value="showTitle"
                        @update:model-value="$emit('update:show-title', $event)"
                    />
                </PropertyField>
                <PropertyField label="Accent" v-slot="{ id }">
                    <Toggle
                        :id="id"
                        :disabled="locked"
                        :model-value="showHeaderAccent"
                        @update:model-value="$emit('update:show-header-accent', $event)"
                    />
                </PropertyField>
                <PropertyField label="Controls" v-slot="{ id }">
                    <Toggle
                        :id="id"
                        :disabled="locked"
                        :model-value="showMenu"
                        @update:model-value="$emit('update:show-menu', $event)"
                    />
                </PropertyField>
                <PropertyField label="Color controls" v-slot="{ id }">
                    <Toggle
                        :id="id"
                        :disabled="locked"
                        :model-value="showColorMenu"
                        @update:model-value="$emit('update:show-color-menu', $event)"
                    />
                </PropertyField>
                <PropertyField label="Title Color" v-slot="{ id }">
                    <ButtonColorPicker
                        :id="id"
                        :model-value="titleColor"
                        @change="$emit('update:title-color', $event)"
                    />
                </PropertyField>
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
    titleColor: { type: Object, default: null },
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
