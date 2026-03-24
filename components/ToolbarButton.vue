<template>
    <button
        type="button"
        class="py-0.5 px-2 h-full highlight outline-none ring-0 active:bg-white dark:active:bg-black focus-visible:outline-none"
        :class="{
            'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-950': !$attrs.disabled,
            'bg-zinc-50 dark:bg-zinc-600 cursor-not-allowed text-zinc-800 dark:text-zinc-400': $attrs.disabled,
        }"
    >
        <slot />
    </button>
</template>
