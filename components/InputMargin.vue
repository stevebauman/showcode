<template>
    <div class="flex flex-col divide-y divide-ui-gray-800">
        <div class="flex flex-col items-center justify-center gap-2 p-2">
            <Label>Top</Label>

            <Input
                size="sm"
                type="number"
                class="w-16 text-center"
                :value="marginTop"
                @input="$emit('update:margin-top', Number($event))"
            />
        </div>

        <div class="flex justify-between items-center divide-x divide-ui-gray-800">
            <div class="flex w-full justify-center items-center gap-2 p-2">
                <Label>Left</Label>

                <Input
                    size="sm"
                    type="number"
                    class="w-16 text-center"
                    :value="marginLeft"
                    @input="$emit('update:margin-left', Number($event))"
                />
            </div>

            <div class="flex w-full justify-center items-center gap-2 p-2">
                <Input
                    size="sm"
                    type="number"
                    class="w-16 text-center"
                    :value="marginRight"
                    @input="$emit('update:margin-right', Number($event))"
                />

                <Label>Right</Label>
            </div>
        </div>

        <div class="flex flex-col items-center justify-center gap-2 p-2">
            <Input
                size="sm"
                type="number"
                class="w-16 text-center"
                :value="marginBottom"
                @input="$emit('update:margin-bottom', Number($event))"
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
