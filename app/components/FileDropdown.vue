<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <button
                class="flex h-7 w-7 select-none items-center justify-center rounded-lg transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800/50"
            >
                <Logo class="h-4 w-4" />
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
            <template v-for="(option, index) in options" :key="option.name ?? index">
                <DropdownMenuSeparator v-if="option.separator" />

                <DropdownMenuItem v-else @select="option.click()">
                    {{ option.title }}
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup>
defineProps({
    options: { type: Array, default: () => [] },
});
</script>
