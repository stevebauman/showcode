<template>
    <TDropdown
        v-bind="$attrs"
        toggle-on-hover
        :toggle-on-click="false"
        :hide-on-leave-timeout="0"
        :classes="{
            button:
                'block px-4 py-2 text-sm text-white transition duration-100 ease-in-out bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
            wrapper: 'inline-flex flex-col',
            dropdownWrapper: 'relative z-10',
            dropdown:
                'origin-top-left absolute left-0 w-56 rounded-md shadow bg-white mt-1',
            enterClass: 'opacity-0 scale-95',
            enterActiveClass: 'transition transform ease-out duration-100',
            enterToClass: 'opacity-100 scale-100',
            leaveClass: 'opacity-100 scale-100',
            leaveActiveClass: 'transition transform ease-in duration-75',
            leaveToClass: 'opacity-0 scale-95',
        }"
    >
        <div class="py-1 shadow-xs">
            <a
                href="#"
                v-for="item in items"
                :key="item.name"
                @click.prevent="item.click()"
                class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                role="menuitem"
            >
                {{ item.title }}
            </a>
        </div>
    </TDropdown>
</template>

<script>
export default {
    props: {
        items: Array,
    },
};
</script>
