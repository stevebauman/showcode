<template>
    <Toggle
        v-bind="$attrs"
        v-on="$listeners"
        popover-title="Shine Properties"
        settings-tooltip="Configure Shine"
    >
        <template #popover>
            <div class="flex flex-col divide-y divide-ui-gray-800">
                <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                    <Label class="w-full text-center"> Width </Label>

                    <Range
                        max="100"
                        step="1"
                        dusk="range-width"
                        :value="shineWidth"
                        @input="$emit('update:shine-width', Number($event))"
                    />

                    <Input
                        size="sm"
                        type="number"
                        class="w-16 text-center"
                        :value="shineWidth"
                        @input="$emit('update:shine-width', Number($event))"
                    />
                </div>

                <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                    <Label class="w-full text-center"> Height </Label>

                    <Range
                        max="200"
                        step="1"
                        dusk="range-height"
                        :value="shineHeight"
                        @input="$emit('update:shine-height', Number($event))"
                    />

                    <Input
                        size="sm"
                        type="number"
                        class="w-16 text-center"
                        :value="shineHeight"
                        @input="$emit('update:shine-height', Number($event))"
                    />
                </div>

                <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                    <Label class="w-full text-center"> Opacity </Label>

                    <Range
                        max="0.1"
                        step="0.01"
                        dusk="range-opacity"
                        :value="shineOpacity"
                        @input="$emit('update:shine-opacity', Number($event))"
                    />

                    <Input
                        size="sm"
                        step="0.01"
                        type="number"
                        class="w-16 text-center"
                        :value="shineOpacity"
                        @input="$emit('update:shine-opacity', Number($event))"
                    />
                </div>
            </div>
        </template>
    </Toggle>
</template>

<script setup>
defineProps({
    shineWidth: {
        type: Number,
        required: true,
    },
    shineHeight: {
        type: Number,
        required: true,
    },
    shineOpacity: {
        type: Number,
        required: true,
    },
});
</script>
