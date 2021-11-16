<template>
    <button
        type="button"
        class="py-0.5 px-2 h-full hover:bg-gray-100"
        :class="{ 'bg-gray-100 cursor-not-allowed text-gray-500': $attrs.disabled }"
    >
        <slot />
    </button>
</template>
