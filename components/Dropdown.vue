<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button :size="size" :variant="variant">
                <slot />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            class="w-56 bg-ui-gray-700 border-ui-gray-800 rounded-lg shadow-lg"
            dusk="dropdown-menu"
        >
            <DropdownMenuItem
                v-for="item in items"
                :key="item.name"
                :dusk="`option-${item.name}`"
                @select="item.click()"
                class="p-2 mx-1 my-1 text-xs font-medium rounded-md text-ui-gray-100 hover:bg-ui-gray-900 focus:bg-ui-gray-900 cursor-pointer"
            >
                {{ item.title }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup>
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

defineProps({
    items: {
        type: Array,
        default: () => [],
    },
    size: {
        type: String,
        default: null,
    },
    variant: {
        type: String,
        default: 'secondary',
    },
});
</script>
