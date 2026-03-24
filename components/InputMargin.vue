<template>
    <div class="flex flex-col divide-y divide-ui-gray-800">
        <div class="flex flex-col items-center justify-center gap-2 p-2">
            <Label>Top</Label>

            <Input
                type="number"
                class="w-16 text-center"
                :model-value="marginTop"
                @update:model-value="$emit('update:margin-top', Number($event))"
            />
        </div>

        <div class="flex justify-between items-center divide-x divide-ui-gray-800">
            <div class="flex w-full justify-center items-center gap-2 p-2">
                <Label>Left</Label>

                <Input
                    type="number"
                    class="w-16 text-center"
                    :model-value="marginLeft"
                    @update:model-value="$emit('update:margin-left', Number($event))"
                />
            </div>

            <div class="flex w-full justify-center items-center gap-2 p-2">
                <Input
                    type="number"
                    class="w-16 text-center"
                    :model-value="marginRight"
                    @update:model-value="$emit('update:margin-right', Number($event))"
                />

                <Label>Right</Label>
            </div>
        </div>

        <div class="flex flex-col items-center justify-center gap-2 p-2">
            <Input
                type="number"
                class="w-16 text-center"
                :model-value="marginBottom"
                @update:model-value="$emit('update:margin-bottom', Number($event))"
            />

            <Label>Bottom</Label>
        </div>
    </div>
</template>

<script setup>
defineProps({
    marginTop: Number,
    marginLeft: Number,
    marginRight: Number,
    marginBottom: Number,
});
</script>
