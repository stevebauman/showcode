<template>
    <div ref="root" class="relative inline-flex flex-col">
        <button
            dusk="dropdown-file-button"
            type="button"
            class="block bg-ui-gray-800 px-4 py-1.5 text-sm text-ui-gray-100 transition duration-100 ease-in-out hover:bg-ui-gray-900 focus:outline-none focus:ring-0 active:bg-ui-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            @click="open = !open"
        >
            {{ text }}
        </button>

        <Transition
            enter-active-class="transition transform ease-out duration-100"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition transform ease-in duration-75"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
        >
            <div
                v-if="open"
                dusk="dropdown-file"
                class="highlight absolute left-1 top-full z-30 mt-1 w-56 origin-top-left overflow-hidden rounded-lg bg-ui-gray-700 shadow ring-1 ring-ui-gray-800"
            >
                <div class="space-y-1 py-2 shadow-lg">
                    <template v-for="(option, index) in options" :key="option.name ?? index">
                        <div v-if="option.separator" class="mx-2 h-px bg-ui-gray-800" />

                        <a
                            v-else
                            href="#"
                            class="mx-2 block rounded-md p-2 text-xs font-medium text-ui-gray-100 transition duration-150 ease-in-out hover:bg-ui-gray-900 focus:bg-ui-gray-900 focus:outline-none focus:ring-0"
                            @click.prevent="select(option)"
                        >
                            {{ option.title }}
                        </a>
                    </template>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

defineProps({
    options: {
        type: Array,
        default: () => [],
    },
    text: {
        type: String,
        default: 'File',
    },
});

const open = ref(false);
const root = ref(null);

function select(option) {
    const result = option.click?.();

    if (result !== false) {
        open.value = false;
    }
}

onClickOutside(root, () => {
    open.value = false;
});
</script>
