<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <button
                class="block px-4 py-1.5 text-sm active:bg-ui-gray-900 text-ui-gray-100 transition duration-100 ease-in-out bg-ui-gray-800 hover:bg-ui-gray-900 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <slot />
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
defineProps({ options: Array });
</script>
