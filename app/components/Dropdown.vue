<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                :aria-label="buttonAriaLabel"
                :size="size"
                :variant="variant"
                :class="buttonClass"
            >
                <slot />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
            <DropdownMenuItem v-for="item in items" :key="item.name" @select="item.click()">
                {{ item.title }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup>
defineProps({
    items: { type: Array, default: () => [] },
    size: { type: String, default: 'default' },
    variant: { type: String, default: 'secondary' },
    buttonClass: { type: [String, Object, Array], default: null },
    buttonAriaLabel: { type: String, default: null },
});
</script>
