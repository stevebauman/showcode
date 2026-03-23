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
            <div
                v-if="open"
                class="fixed inset-0 z-40 bg-black bg-opacity-50"
                @click="close"
            />
        </Transition>

        <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-50 flex items-start justify-center px-4 py-12"
                @click.self="close"
            >
                <div :class="sizes[size]" class="relative w-full">
                    <div class="w-full rounded-xl bg-ui-gray-700 shadow-xl highlight">
                        <div
                            v-if="header"
                            class="border-b border-ui-gray-800 px-6 py-3 text-lg font-medium text-ui-gray-100"
                        >
                            {{ header }}
                        </div>

                        <button
                            type="button"
                            class="close-modal absolute right-0 top-0 m-3 flex h-8 w-8 items-center justify-center rounded-full text-ui-gray-300 transition duration-100 ease-in-out hover:bg-ui-gray-900"
                            @click="close"
                        >
                            <XIcon class="h-4 w-4" />
                        </button>

                        <Scrollbar class="max-h-[50rem]">
                            <div class="px-6 pb-6">
                                <slot />
                            </div>
                        </Scrollbar>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { XIcon } from '@/utils/icons';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: undefined,
    },
    value: {
        type: Boolean,
        default: undefined,
    },
    header: {
        type: String,
        default: null,
    },
    size: {
        type: String,
        default: 'lg',
    },
});

const emit = defineEmits(['update:modelValue', 'input', 'close']);

const open = computed(() => props.modelValue ?? props.value ?? false);

const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
};

function close() {
    emit('update:modelValue', false);
    emit('input', false);
    emit('close');
}
</script>
