<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <button
                class="flex size-8 items-center justify-center rounded-lg transition-colors select-none hover:bg-zinc-200 dark:hover:bg-zinc-800/50"
            >
                <Logo class="size-4" />
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
            <template v-for="(option, index) in options" :key="option.name ?? index">
                <DropdownMenuSeparator v-if="option.separator" />

                <DropdownMenuLabel v-else-if="option.label" class="text-xs text-zinc-500">
                    {{ option.title }}
                </DropdownMenuLabel>

                <DropdownMenuSub v-else-if="option.children">
                    <DropdownMenuSubTrigger>
                        {{ option.title }}
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent>
                        <template
                            v-for="(child, childIndex) in option.children"
                            :key="child.name ?? childIndex"
                        >
                            <DropdownMenuSeparator v-if="child.separator" />

                            <DropdownMenuItem v-else-if="child.href" as-child>
                                <a :href="child.href" target="_blank">
                                    {{ child.title }}
                                </a>
                            </DropdownMenuItem>

                            <DropdownMenuItem v-else @select="child.click()">
                                {{ child.title }}
                            </DropdownMenuItem>
                        </template>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem v-else-if="option.href" as-child>
                    <a :href="option.href" target="_blank">
                        {{ option.title }}
                    </a>
                </DropdownMenuItem>

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
