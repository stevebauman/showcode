<template>
    <div ref="root" class="relative inline-flex">
        <Button :size="size" :variant="variant" @mousedown="toggle">
            <slot />
        </Button>

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
                dusk="dropdown-menu"
                class="highlight absolute right-0 top-full z-30 mt-1 w-56 origin-top-right overflow-hidden rounded-lg bg-ui-gray-700 shadow ring-1 ring-ui-gray-800"
            >
                <div class="py-1 shadow-lg">
                    <a
                        v-for="item in items"
                        :key="item.name"
                        href="#"
                        :dusk="`option-${item.name}`"
                        class="mx-2 my-1 block rounded-md p-2 text-xs font-medium text-ui-gray-100 transition duration-150 ease-in-out hover:bg-ui-gray-900 focus:bg-ui-gray-900 focus:outline-none focus:ring-0"
                        @click.prevent="select(item)"
                    >
                        {{ item.title }}
                    </a>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

defineProps({
    items: {
        type: Array,
        default: () => [],
    },
    size: {
        type: String,
        default: null,
    },
    variant: {
        type: String,
        default: 'secondary',
    },
});

const open = ref(false);
const root = ref(null);

function toggle() {
    open.value = !open.value;
}

function select(item) {
    const result = item.click?.();

    if (result !== false) {
        open.value = false;
    }
}

onClickOutside(root, () => {
    open.value = false;
});
</script>
