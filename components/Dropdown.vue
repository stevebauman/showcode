<template>
    <div class="relative inline-block" v-click-outside="() => (open = false)">
        <Button :size="size" :variant="variant" @click="open = !open">
            <slot />
        </Button>

        <Transition
            enter-active-class="transition transform ease-out duration-100"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition transform ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-if="open"
                class="highlight origin-top-right absolute right-0 z-30 w-56 shadow bg-ui-gray-700 rounded-lg overflow-hidden ring-1 ring-ui-gray-800"
            >
                <div class="py-1 shadow-lg">
                    <a
                        href="#"
                        v-for="item in items"
                        :key="item.name"
                       
                        @click.prevent="() => { item.click(); open = false; }"
                        class="block p-2 mx-2 my-1 text-xs font-medium transition duration-150 ease-in-out rounded-md text-ui-gray-100 hover:bg-ui-gray-900 focus:outline-none focus:ring-0 focus:bg-ui-gray-900"
                    >
                        {{ item.title }}
                    </a>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    props: {
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
    },

    directives: {
        clickOutside: {
            mounted(el, binding) {
                el._clickOutside = (e) => {
                    if (!el.contains(e.target)) binding.value(e);
                };
                document.addEventListener('click', el._clickOutside);
            },
            unmounted(el) {
                document.removeEventListener('click', el._clickOutside);
            },
        },
    },

    setup() {
        const open = ref(false);
        return { open };
    },
};
</script>
