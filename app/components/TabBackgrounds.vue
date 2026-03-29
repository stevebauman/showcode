<template>
    <div class="flex w-full flex-col justify-start gap-4">
        <ScrollArea orientation="horizontal" force-vertical-scroll>
            <div class="grid auto-cols-max grid-flow-col grid-rows-3 gap-4 p-4">
                <ButtonBackground
                    :active="false"
                    v-tooltip.bottom="{
                        content: 'Add Custom Background',
                    }"
                    @click="$emit('add')"
                    class="flex items-center justify-center border border-zinc-200 bg-zinc-50 hover:bg-zinc-200 active:bg-white dark:border-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-950 dark:active:bg-black"
                >
                    <PlusCircleIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                </ButtonBackground>

                <ColorPicker :value="backgroundColor" @change="$emit('color', $event)">
                    <ButtonBackground
                        :active="!!backgroundColor"
                        v-tooltip.bottom="'Pick Color'"
                        class="flex items-center justify-center border border-zinc-200 bg-zinc-50 hover:bg-zinc-200 active:bg-white dark:border-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-950 dark:active:bg-black"
                    >
                        <DropletIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                    </ButtonBackground>

                    <template #popover="{ alpha }">
                        <div
                            class="flex justify-center border-t border-zinc-200 p-2 dark:border-zinc-800"
                        >
                            <Button
                                size="sm"
                                class="w-full justify-center"
                                @click="
                                    addCustomBackground({
                                        style: { backgroundColor: alpha },
                                    })
                                "
                            >
                                Save
                            </Button>
                        </div>
                    </template>
                </ColorPicker>

                <ButtonBackground
                    v-for="{ id, custom, ...attrs } in visibleBackgrounds"
                    v-tooltip="{ content: id, delay: 500 }"
                    class="highlight"
                    :key="id"
                    :custom="custom"
                    :attributes="attrs"
                    :data-ref="`button-background-${id}`"
                    :active="background === id && !backgroundColor"
                    @delete="$emit('delete', id)"
                    @click="$emit('select', id)"
                />
            </div>
        </ScrollArea>
    </div>
</template>

<script setup>
import useBackgrounds from '@/composables/useBackgrounds';
import { PlusCircleIcon, DropletIcon } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import useScrollRefIntoView from '@/composables/useScrollRefIntoView';

const INITIAL_BATCH = 30;
const BATCH_SIZE = 30;

const props = defineProps({
    background: { type: String, required: true },
    backgrounds: { type: Array, required: true },
    backgroundColor: { type: Object, required: false },
});

defineEmits(['add', 'color', 'delete', 'select']);

const { addCustomBackground } = useBackgrounds();
const { background, backgrounds } = toRefs(props);
const { scrollRefIntoView } = useScrollRefIntoView();

const renderedCount = ref(INITIAL_BATCH);
let idleCallbackId = null;

const visibleBackgrounds = computed(() => backgrounds.value.slice(0, renderedCount.value));

const renderNextBatch = () => {
    if (renderedCount.value >= backgrounds.value.length) return;

    const callback = () => {
        renderedCount.value = Math.min(renderedCount.value + BATCH_SIZE, backgrounds.value.length);

        if (renderedCount.value < backgrounds.value.length) {
            renderNextBatch();
        }
    };

    if ('requestIdleCallback' in window) {
        idleCallbackId = window.requestIdleCallback(callback);
    } else {
        idleCallbackId = setTimeout(callback, 50);
    }
};

onMounted(() => {
    renderNextBatch();

    setTimeout(() => {
        scrollRefIntoView(`button-background-${background.value}`);
    }, 100);
});

onBeforeUnmount(() => {
    if (idleCallbackId !== null) {
        if ('cancelIdleCallback' in window) {
            window.cancelIdleCallback(idleCallbackId);
        } else {
            clearTimeout(idleCallbackId);
        }
    }
});

watch(backgrounds, () => {
    renderedCount.value = backgrounds.value.length;
    scrollRefIntoView(`button-background-${background.value}`);
});
</script>
