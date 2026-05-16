<template>
    <div
        class="flex flex-col items-stretch justify-between overflow-hidden rounded-md border border-zinc-200 bg-white/80 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80"
    >
        <div class="flex items-center gap-1 p-1.5">
            <ControlTab
                v-for="{ name, title, disabled, locked } in tabs"
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
                <LockIcon v-if="locked" class="h-3 w-3" />
                {{ title }}
            </ControlTab>

            <button
                @click="open = !open"
                class="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
                <ChevronUpIcon
                    class="h-4 w-4 transition-transform"
                    :class="{ 'rotate-180': open }"
                />
            </button>
        </div>

        <div v-auto-animate>
            <div
                v-if="open"
                class="scrollbar-hide max-h-52 w-full overflow-x-auto border-t border-zinc-200 lg:max-h-max dark:border-zinc-800"
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
