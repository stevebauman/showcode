<template>
    <TDropdown
        v-bind="$attrs"
        :classes="{
            button: 'block px-4 py-2 text-sm font-semibold text-white rounded-r-lg transition duration-100 ease-in-out bg-ui-violet-500 border border-transparent shadow-sm hover:bg-ui-violet-600 focus:border-ui-violet-500 focus:ring-2 focus:bg-ui-violet-600 focus:ring-ui-focus focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            wrapper: 'inline-flex flex-col',
            dropdownWrapper: 'relative z-30 bg-ui-gray-700',
            dropdown:
                'origin-top-left absolute left-0 w-56 shadow bg-ui-gray-700 rounded-b-lg rounded-r-lg',
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
                v-for="option in options"
                :key="option.name"
                @blur="blurHandler"
                @click.prevent="() => option.click() && hide()"
                class="block px-4 py-2 mx-2 my-1 text-sm leading-5 transition duration-150 ease-in-out rounded-lg text-ui-gray-100 hover:bg-ui-gray-900 focus:outline-none focus:bg-ui-gray-900"
            >
                {{ option.title }}
            </a>
        </div>
    </TDropdown>
</template>

<script>
export default {
    props: { options: Array },
};
</script>
