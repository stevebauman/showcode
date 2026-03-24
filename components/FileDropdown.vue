<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <button class="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors select-none">
                <Logo class="w-4 h-4" />
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
    options: { type: Array, default: () => [] },
});
</script>
