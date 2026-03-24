<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <button class="flex items-center h-7 px-3 text-xs rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors select-none">
                {{ text }}
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
            <template v-for="(option, index) in options" :key="option.name ?? index">
                <DropdownMenuSeparator v-if="option.separator" />

                <DropdownMenuItem
                    v-else
                    @select="option.click()"
                >
                    {{ option.title }}
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup>
defineProps({
    text: { type: String, default: '' },
    options: { type: Array, default: () => [] },
});
</script>
