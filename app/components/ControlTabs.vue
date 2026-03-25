<template>
    <div
        class="flex flex-col items-stretch justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white/80 shadow-lg backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80"
    >
        <div class="flex items-center gap-1 p-1.5">
            <ControlTab
                v-for="{ name, title } in tabs"
                :key="name"
                :active="active === name && open"
                @click="
                    () => {
                        active = name;
                        open = true;
                    }
                "
            >
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
                class="max-h-52 w-full overflow-x-auto border-t border-zinc-200 scrollbar-hide dark:border-zinc-800 lg:max-h-max"
            >
                <slot :active="active" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { head } from 'lodash';
import { ChevronUpIcon } from 'lucide-vue-next';
import { ref, watch, toRefs } from 'vue';

const props = defineProps({ tabs: Array });
const emit = defineEmits(['changed']);

const { tabs } = toRefs(props);

const open = ref(true);
const active = ref(head(tabs.value).name);

watch(active, (value) => emit('changed', value));
</script>
