<template>
    <button
        type="button"
        class="py-0.5 px-2 h-full highlight outline-none ring-0 active:bg-ui-gray-900 focus-visible:outline-none"
        :class="{
            'text-ui-gray-300 hover:bg-ui-gray-800': !$attrs.disabled,
            'bg-ui-gray-600 cursor-not-allowed text-ui-gray-400': $attrs.disabled,
        }"
    >
        <slot />
    </button>
</template>
