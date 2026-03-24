<template>
    <div class="inline-flex flex-col relative" v-click-outside="() => (open = false)">
        <button
            class="block px-4 py-1.5 text-sm active:bg-ui-gray-900 text-ui-gray-100 transition duration-100 ease-in-out bg-ui-gray-800 hover:bg-ui-gray-900 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="open = !open"
        >
            <slot />
        </button>

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
                class="highlight origin-top-left absolute left-0 top-full mt-1 z-30 w-56 shadow bg-ui-gray-700 overflow-hidden rounded-lg ring-1 ring-ui-gray-800"
            >
                <div dusk="dropdown-file" class="py-2 shadow-lg space-y-1">
                    <template v-for="(option, index) in options" :key="option.name ?? index">
                        <div v-if="option.separator" class="h-px bg-ui-gray-800 mx-2"></div>

                        <a
                            v-else
                            href="#"
                            @click.prevent="() => { option.click(); open = false; }"
                            class="block p-2 text-xs transition duration-150 ease-in-out mx-2 font-medium text-ui-gray-100 rounded-md hover:bg-ui-gray-900 focus:outline-none focus:ring-0 focus:bg-ui-gray-900"
                        >
                            {{ option.title }}
                        </a>
                    </template>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    props: { options: Array },

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
