<template>
    <button
        type="button"
        class="highlight h-full px-2 py-0.5 outline-hidden ring-0 focus-visible:outline-hidden active:bg-white dark:active:bg-black"
        :class="{
            'text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-950':
                !$attrs.disabled,
            'cursor-not-allowed bg-zinc-50 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-400':
                $attrs.disabled,
        }"
    >
        <slot />
    </button>
</template>
