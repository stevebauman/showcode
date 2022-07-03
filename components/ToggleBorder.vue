<template>
    <Toggle v-bind="$attrs" v-on="$listeners" popover-title="Border Properties">
        <template #popover>
            <div class="flex flex-col divide-y divide-ui-gray-800">
                <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                    <Label class="w-full text-center"> Width </Label>

                    <Input
                        type="number"
                        class="w-20"
                        :value="borderWidth"
                        @input="$emit('update:border-width', $event)"
                    />
                </div>

                <div class="p-2">
                    <ButtonColorPicker
                        :value="borderColor"
                        @change="$emit('update:border-color', $event)"
                    />
                </div>
            </div>
        </template>
    </Toggle>
</template>

<script>
export default {
    props: {
        borderColor: {
            type: Object,
            required: true,
        },
        borderWidth: {
            type: [Number, String],
            required: true,
        },
    },
};
</script>
