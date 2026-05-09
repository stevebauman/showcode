<template>
    <ControlRow>
        <button
            v-for="frame in frames"
            :key="frame.id"
            type="button"
            class="flex w-28 flex-col items-center gap-2 rounded-xl p-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            :class="
                activeFrame === frame.id
                    ? 'bg-zinc-200/80 text-zinc-950 ring-[3px] ring-violet-500 dark:bg-zinc-700/80 dark:text-zinc-50 dark:ring-violet-400'
                    : ''
            "
            @click="$emit('select', frame.id)"
        >
            <span
                class="relative h-16 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
                <span
                    v-if="frame.id === 'stripe'"
                    class="absolute inset-0 overflow-hidden bg-[#0a2540]"
                >
                    <span
                        class="absolute inset-x-0 bottom-0 h-7 origin-top-right -skew-y-6 bg-[#f6f9fc]"
                    ></span>
                    <span
                        class="absolute top-0 left-[18%] h-full border-l border-dashed border-white/15"
                    ></span>
                    <span
                        class="absolute top-0 left-1/2 h-full border-l border-dashed border-white/15"
                    ></span>
                    <span
                        class="absolute top-0 right-[18%] h-full border-l border-dashed border-white/15"
                    ></span>
                    <span
                        class="absolute bottom-5 left-[58%] h-3 w-16 -skew-y-6 bg-[#11efe3]"
                    ></span>
                    <span
                        class="absolute bottom-2 left-[70%] h-2 w-16 -skew-y-6 bg-[#9966ff]"
                    ></span>
                    <span
                        class="absolute bottom-4 left-[70%] h-1.5 w-16 -skew-y-6 bg-[#0147e6]"
                    ></span>
                    <span
                        class="absolute inset-x-4 top-4 h-8 rounded-md border border-[#0f395e] bg-[#0c2e4e] shadow-lg"
                    ></span>
                </span>

                <span
                    v-else
                    class="absolute inset-0 bg-zinc-100 dark:bg-zinc-900"
                    style="
                        background-size: 16px 16px;
                        background-position:
                            0 0,
                            0 8px,
                            8px -8px,
                            -8px 0;
                        background-image:
                            linear-gradient(45deg, rgb(161 161 170 / 0.35) 25%, transparent 0),
                            linear-gradient(-45deg, rgb(161 161 170 / 0.35) 25%, transparent 0),
                            linear-gradient(45deg, transparent 75%, rgb(161 161 170 / 0.35) 0),
                            linear-gradient(-45deg, transparent 75%, rgb(161 161 170 / 0.35) 0);
                    "
                ></span>
            </span>

            <span>{{ frame.title }}</span>
        </button>
    </ControlRow>
</template>

<script setup>
defineProps({
    frames: { type: Array, required: true },
    activeFrame: { type: String, required: true },
});

defineEmits(['select']);
</script>
