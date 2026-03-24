<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="rounded-none h-full px-4 text-sm">
                {{ text }}
            </Button>
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
