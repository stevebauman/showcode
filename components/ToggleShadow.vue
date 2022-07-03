<template>
    <Toggle v-bind="$attrs" v-on="$listeners" popover-title="Shadow Properties">
        <template #popover>
            <div class="flex flex-col divide-y divide-ui-gray-800">
                <div class="grid grid-cols-2 gap-2 divide-x divide-ui-gray-800">
                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> X </Label>

                        <Input
                            type="number"
                            class="w-20"
                            :value="shadowX"
                            @input="$emit('update:shadow-x', $event)"
                        />
                    </div>

                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Blur </Label>

                        <Input
                            type="number"
                            class="w-20"
                            :value="shadowBlur"
                            @input="$emit('update:shadow-blur', $event)"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 divide-x divide-ui-gray-800">
                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Y </Label>

                        <Input
                            type="number"
                            class="w-20"
                            :value="shadowY"
                            @input="$emit('update:shadow-y', $event)"
                        />
                    </div>

                    <div class="flex items-center justify-between w-full gap-2 px-3 py-2">
                        <Label class="w-full text-center"> Spread </Label>

                        <Input
                            type="number"
                            class="w-20"
                            :value="shadowSpread"
                            @input="$emit('update:shadow-spread', $event)"
                        />
                    </div>
                </div>

                <div class="col-span-2 p-2">
                    <ButtonColorPicker
                        :value="shadowColor"
                        @change="$emit('update:shadow-color', $event)"
                    />
                </div>
            </div>
        </template>
    </Toggle>
</template>

<script>
export default {
    props: {
        shadowColor: {
            type: Object,
            required: true,
        },
        shadowX: {
            type: [Number, String],
            required: true,
        },
        shadowY: {
            type: [Number, String],
            required: true,
        },
        shadowBlur: {
            type: [Number, String],
            required: true,
        },
        shadowSpread: {
            type: [Number, String],
            required: true,
        },
    },
};
</script>
