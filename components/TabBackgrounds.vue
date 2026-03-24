<template>
    <div class="flex flex-col justify-start w-full gap-4">
        <Scrollbar force-vertical-scroll>
            <div class="grid grid-flow-col grid-rows-3 gap-4 p-4 auto-cols-max">
                <ButtonBackground
                    :active="false"
                    v-tooltip.bottom="{
                        content: 'Add Custom Background',
                    }"
                    @click="$emit('add')"
                    class="highlight flex items-center justify-center bg-ui-gray-600 active:bg-ui-gray-900 hover:bg-ui-gray-800"
                >
                    <PlusCircleIcon class="w-5 h-5 text-ui-gray-300" />
                </ButtonBackground>

                <ColorPicker :value="backgroundColor" @change="$emit('color', $event)">
                    <ButtonBackground
                        :active="!!backgroundColor"
                        v-tooltip.bottom="'Pick Color'"
                        class="highlight flex items-center justify-center bg-ui-gray-600 active:bg-ui-gray-900 hover:bg-ui-gray-800"
                    >
                        <DropletIcon class="w-5 h-5 text-ui-gray-300" />
                    </ButtonBackground>

                    <template #popover="{ alpha }">
                        <div class="p-2 flex justify-center border-t border-ui-gray-800">
                            <Button
                                size="xs"
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
                    v-for="{ id, custom, ...attrs } in backgrounds"
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
        </Scrollbar>
    </div>
</template>

<script setup>
import useBackgrounds from '@/composables/useBackgrounds';
import { PlusCircleIcon, DropletIcon } from 'lucide-vue-next';
import { onMounted, toRefs, watch } from 'vue';
import useScrollRefIntoView from '@/composables/useScrollRefIntoView';

const props = defineProps({
    background: { type: String, required: true },
    backgrounds: { type: Array, required: true },
    backgroundColor: { type: Object, required: false },
});

defineEmits(['add', 'color', 'delete', 'select']);

const { addCustomBackground } = useBackgrounds();
const { background, backgrounds } = toRefs(props);
const { scrollRefIntoView } = useScrollRefIntoView();

onMounted(() => {
    setTimeout(() => {
        scrollRefIntoView(`button-background-${background.value}`);
    }, 100);
});

watch(backgrounds, () => scrollRefIntoView(`button-background-${background.value}`));
</script>
