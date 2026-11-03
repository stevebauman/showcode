<template>
    <button
        type="button"
        class="rounded-control focus-visible:outline-ui-focus flex h-7 items-center justify-center px-2 outline-hidden focus-visible:outline-2"
        :class="{
            'text-ui-muted hover:bg-ui-hover hover:text-ui-text': !$attrs.disabled,
            'text-ui-muted cursor-not-allowed opacity-40': $attrs.disabled,
        }"
    >
        <slot />
    </button>
</template>
