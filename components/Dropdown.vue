<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button :size="size" :variant="variant">
                <slot />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
            <DropdownMenuItem
                v-for="item in items"
                :key="item.name"
                @select="item.click()"
            >
                {{ item.title }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup>
defineProps({
    items: { type: Array, default: () => [] },
    size: { type: String, default: null },
    variant: { type: String, default: 'secondary' },
});
</script>
