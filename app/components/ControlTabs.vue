<template>
    <div
        class="rounded-surface flex flex-col items-stretch justify-between overflow-hidden border border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90"
    >
        <div role="tablist" aria-label="Preview panels" class="flex items-center gap-0.5 p-1">
            <ControlTab
                v-for="{ name, title, icon, disabled, locked } in tabs"
                :key="name"
                :active="active === name && open"
                :disabled="disabled"
                @click="
                    () => {
                        if (disabled) return;
                        active = name;
                        open = true;
                    }
                "
            >
                <component :is="icon" v-if="icon" class="size-3.5 flex-none" />
                {{ title }}
                <LockIcon v-if="locked" class="size-3 flex-none" />
            </ControlTab>

            <button
                type="button"
                :aria-label="open ? 'Collapse preview panel' : 'Expand preview panel'"
                :aria-expanded="open"
                @click="open = !open"
                class="rounded-control ml-auto flex size-7 items-center justify-center text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:outline-hidden dark:text-zinc-500 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200 dark:focus-visible:ring-zinc-600"
            >
                <ChevronUpIcon
                    class="size-3.5 transition-transform"
                    :class="{ 'rotate-180': open }"
                />
            </button>
        </div>

        <div v-auto-animate>
            <div
                v-if="open"
                class="scrollbar-hide max-h-52 w-full overflow-x-auto border-t border-zinc-200/80 lg:max-h-max dark:border-white/10"
            >
                <slot :active="active" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { head } from 'lodash';
import { ref, watch, toRefs } from 'vue';
import { ChevronUpIcon, LockIcon } from 'lucide-vue-next';

const props = defineProps({ tabs: Array });
const emit = defineEmits(['changed']);

const { tabs } = toRefs(props);

const open = ref(true);
const active = ref(head(tabs.value).name);

watch(active, (value) => emit('changed', value));

watch(
    tabs,
    (value) => {
        if (!value.find((tab) => tab.name === active.value && !tab.disabled)) {
            active.value = value.find((tab) => !tab.disabled)?.name ?? head(value).name;
        }
    },
    { deep: true }
);
</script>
