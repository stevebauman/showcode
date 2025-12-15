<template>
    <DropdownMenu>
        <DropdownMenuTrigger
            class="block px-4 py-1.5 text-sm active:bg-ui-gray-900 text-ui-gray-100 transition duration-100 ease-in-out bg-ui-gray-800 hover:bg-ui-gray-900 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <slot />
        </DropdownMenuTrigger>

        <DropdownMenuContent
            dusk="dropdown-file"
            align="start"
            class="w-56 bg-ui-gray-700 border-ui-gray-800 rounded-lg shadow-lg py-2"
        >
            <template v-for="(option, index) in options" :key="index">
                <DropdownMenuSeparator
                    v-if="option.separator"
                    class="h-px bg-ui-gray-800 mx-2"
                />

                <DropdownMenuItem
                    v-else
                    @select="option.click()"
                    class="p-2 text-xs mx-1 font-medium text-ui-gray-100 rounded-md hover:bg-ui-gray-900 focus:bg-ui-gray-900 cursor-pointer"
                >
                    {{ option.title }}
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup>
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

defineProps({
    options: {
        type: Array,
        required: true,
    },
});
</script>
