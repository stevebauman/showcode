<template>
    <TDropdown
        v-bind="$attrs"
        :classes="{
            button: [sizes[size], variants[variant], 'rounded-lg', ...classes],
            dropdownWrapper: 'relative z-20 bg-ui-gray-700',
            dropdown: 'origin-top-right absolute right-0 w-56 shadow bg-ui-gray-700 rounded-lg',
            enterClass: 'opacity-0 scale-95',
            enterActiveClass: 'transition transform ease-out duration-100',
            enterToClass: 'opacity-100 scale-100',
            leaveClass: 'opacity-100 scale-100',
            leaveActiveClass: 'transition transform ease-in duration-75',
            leaveToClass: 'opacity-0 scale-95',
        }"
    >
        <div slot-scope="{ hide, blurHandler }" class="py-1 shadow-lg">
            <a
                href="#"
                v-for="item in items"
                :key="item.name"
                @blur="blurHandler"
                @click.prevent="() => item.click() && hide()"
                class="block px-4 py-2 mx-2 my-1 text-sm font-medium transition duration-150 ease-in-out rounded-lg text-ui-gray-100 hover:bg-ui-gray-900 focus:outline-none focus:bg-ui-gray-900"
            >
                {{ item.title }}
            </a>
        </div>
    </TDropdown>
</template>

<script>
// block px-4 py-2 text-base font-semibold text-white rounded-lg transition duration-100 ease-in-out bg-ui-violet-500 border border-transparent shadow-sm hover:bg-ui-violet-600 focus:bg-ui-violet-600 focus:border-ui-violet-500 focus:ring-2 focus:ring-ui-focus focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
import { ChevronDownIcon } from 'vue-feather-icons';
import useButtonClasses from '../composables/useButtonClasses';

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

    components: { ChevronDownIcon },

    setup: () => useButtonClasses(),
};
</script>
