<template>
    <Toggle v-bind="$attrs" v-on="$listeners">
        <template #settings>
            <div ref="boundary" class="flex flex-col divide-y divide-ui-gray-800">
                <div class="grid grid-cols-2 gap-2 divide-x divide-ui-gray-800">
                    <div class="flex items-center w-full gap-2 px-3 py-2">
                        <Label> X </Label>

                        <Input
                            :value="shadowX"
                            @input="$emit('update:shadow-x', $event)"
                            type="number"
                            min="1"
                            max="5000"
                            class="w-full"
                        />
                    </div>

                    <div class="flex items-center w-full gap-2 px-3 py-2">
                        <Label> Blur </Label>

                        <Input
                            :value="shadowBlur"
                            @input="$emit('update:shadow-blur', $event)"
                            type="number"
                            min="1"
                            max="5000"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 divide-x divide-ui-gray-800">
                    <div class="flex items-center w-full gap-2 px-3 py-2">
                        <Label> Y </Label>

                        <Input
                            :value="shadowY"
                            @input="$emit('update:shadow-y', $event)"
                            type="number"
                            min="1"
                            max="5000"
                            class="w-full"
                        />
                    </div>

                    <div class="flex items-center w-full gap-2 px-3 py-2">
                        <Label> Spread </Label>

                        <Input
                            :value="shadowSpread"
                            @input="$emit('update:shadow-spread', $event)"
                            type="number"
                            min="1"
                            max="5000"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="col-span-2 p-2">
                    <V-Popover
                        boundaries-element="body"
                        class="flex items-center w-full h-full py-1 mx-1"
                        popover-inner-class="p-2 rounded-lg shadow-lg bg-ui-gray-700"
                    >
                        <button class="w-6 h-6 rounded-full" :style="{ backgroundColor: color }">
                            Show
                        </button>

                        <template #popover>
                            <ColorPicker
                                :color="shadowColor"
                                :on-change="
                                    (color) =>
                                        $emit('update:shadow-color', {
                                            red: color.red,
                                            green: color.green,
                                            blue: color.blue,
                                            alpha: color.alpha,
                                        })
                                "
                            />
                        </template>
                    </V-Popover>
                </div>
            </div>
        </template>
    </Toggle>
</template>

<style>
.ui-color-picker {
    background-color: inherit;
}
</style>

<script>
import 'vue-color-gradient-picker/dist/index.css';
import { computed } from '@nuxtjs/composition-api';
import { ColorPicker } from 'vue-color-gradient-picker';

export default {
    props: {
        shadowX: [Number, String],
        shadowY: [Number, String],
        shadowBlur: [Number, String],
        shadowSpread: [Number, String],
        shadowColor: Object,
    },

    components: { ColorPicker },

    setup(props) {
        const color = computed(
            () =>
                `rgb(${props.shadowColor.red}, ${props.shadowColor.green}, ${props.shadowColor.blue})`
        );

        return { color };
    },
};
</script>
