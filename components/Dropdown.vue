<template>
    <TDropdown
        v-bind="$attrs"
        :classes="{
            button: 'block px-4 py-2 text-sm font-semibold text-white rounded-lg transition duration-100 ease-in-out bg-violet-500 border border-transparent shadow-sm hover:bg-violet-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
            wrapper: 'inline-flex flex-col',
            dropdownWrapper: 'relative z-10 bg-gray-700',
            dropdown: 'origin-top-right absolute right-0 w-56 shadow bg-gray-700 rounded-lg',
            enterClass: 'opacity-0 scale-95',
            enterActiveClass: 'transition transform ease-out duration-100',
            enterToClass: 'opacity-100 scale-100',
            leaveClass: 'opacity-100 scale-100',
            leaveActiveClass: 'transition transform ease-in duration-75',
            leaveToClass: 'opacity-0 scale-95',
        }"
    >
        <div slot-scope="{ hide }" class="py-1 shadow-lg">
            <a
                href="#"
                v-for="item in items"
                :key="item.name"
                @click.prevent="() => item.click() && hide()"
                class="block px-4 py-2 text-sm leading-5 text-gray-100 transition duration-150 ease-in-out hover:bg-gray-900 focus:outline-none focus:bg-gray-900"
            >
                {{ item.title }}
            </a>
        </div>
    </TDropdown>
</template>

<script>
import { ChevronDownIcon } from 'vue-feather-icons';

export default {
    props: { items: Array },

    components: { ChevronDownIcon },
};
</script>
