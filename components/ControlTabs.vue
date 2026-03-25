<template>
    <div class="flex flex-col items-stretch justify-between overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg">
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
                class="ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <ChevronUpIcon class="w-4 h-4 transition-transform" :class="{ 'rotate-180': open }" />
            </button>
        </div>

        <div v-auto-animate>
            <div v-if="open" class="w-full overflow-x-auto scrollbar-hide max-h-52 lg:max-h-max border-t border-zinc-200 dark:border-zinc-800">
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
