<template>
    <button
        type="button"
        class="py-0.5 px-2 h-full hover:bg-gray-900"
        :class="{
            'bg-gray-800 text-gray-300': !$attrs.disabled,
            'bg-gray-900 cursor-not-allowed text-gray-700': $attrs.disabled,
        }"
    >
        <slot />
    </button>
</template>
