<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="modelValue" class="z-40 bg-black fixed inset-0 bg-opacity-50" @click="close" />
        </Transition>

        <div
            v-if="modelValue"
            class="fixed inset-0 z-50 flex items-start justify-center py-12 pointer-events-none"
        >
            <div
                class="bg-ui-gray-700 shadow-xl rounded-xl w-full highlight pointer-events-auto relative"
                :class="{
                    'max-w-2xl': size === 'sm',
                    'max-w-4xl': size === 'md',
                    'max-w-6xl': size === 'lg',
                }"
            >
                <div v-if="header" class="py-3 px-6 rounded-t text-lg border-b font-medium text-ui-gray-100 border-ui-gray-800">
                    {{ header }}
                </div>

                <button
                    class="close-modal highlight rounded-full m-3 absolute right-0 top-0 h-8 w-8 transition duration-100 ease-in-out hover:bg-ui-gray-900 flex items-center justify-center"
                    @click="close"
                >
                    <XIcon class="text-ui-gray-300 h-4 w-4" />
                </button>

                <div class="px-6 pb-6" v-bind="$attrs">
                    <Scrollbar class="max-h-[50rem]">
                        <slot />
                    </Scrollbar>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script>
import { XIcon } from 'lucide-vue-next';

export default {
    inheritAttrs: false,

    components: { XIcon },

    props: {
        modelValue: {
            type: [Boolean, Object],
            default: false,
        },
        header: {
            type: String,
            default: null,
        },
        size: {
            type: String,
            default: 'lg',
        },
    },

    emits: ['update:modelValue'],

    setup(props, { emit }) {
        const close = () => emit('update:modelValue', false);

        return { close };
    },
};
</script>
