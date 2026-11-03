<template>
    <div class="flex w-full flex-col gap-3 p-4">
        <div
            class="flex items-center justify-between gap-2"
            role="toolbar"
            aria-label="Background actions"
        >
            <span class="text-ui-muted text-xs">Backgrounds</span>
            <div class="floating-toolbar flex items-center gap-1">
                <ColorPicker :value="backgroundColor" @change="$emit('color', $event)">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Pick background color"
                        :aria-pressed="!!backgroundColor"
                        v-tooltip.bottom="'Pick color'"
                    >
                        <DropletIcon />
                    </Button>
                    <template #popover="{ alpha }">
                        <div class="flex justify-center px-3 pt-1 pb-3">
                            <Button
                                size="sm"
                                class="w-full justify-center"
                                @click="addCustomBackground({ style: { backgroundColor: alpha } })"
                            >
                                Save
                            </Button>
                        </div>
                    </template>
                </ColorPicker>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Add custom background"
                    v-tooltip.bottom="'Add custom background'"
                    @click="$emit('add')"
                >
                    <PlusIcon />
                </Button>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
            <ButtonBackground
                v-for="{ id, custom, thumbnail, ...attrs } in backgrounds"
                :key="id"
                :custom="custom"
                :attributes="attrs"
                :thumbnail="thumbnail"
                :title="id"
                :aria-label="id"
                :data-ref="`button-background-${id}`"
                :active="background === id && !backgroundColor"
                @delete="$emit('delete', id)"
                @mousedown.prevent
                @click="selectBackground($event, id)"
            />
        </div>
    </div>
</template>

<script setup>
import useBackgrounds from '@/composables/useBackgrounds';
import { PlusIcon, DropletIcon } from 'lucide-vue-next';
import { onMounted, toRefs } from 'vue';
import useScrollRefIntoView from '@/composables/useScrollRefIntoView';

const props = defineProps({
    background: { type: String, required: true },
    backgrounds: { type: Array, required: true },
    backgroundColor: { type: Object, required: false },
});

const emit = defineEmits(['add', 'color', 'delete', 'select']);

const { addCustomBackground } = useBackgrounds();
const { background } = toRefs(props);
const { scrollRefIntoView } = useScrollRefIntoView();

onMounted(() => {
    scrollRefIntoView(`button-background-${background.value}`);
});

function selectBackground(event, id) {
    event.currentTarget.focus({ preventScroll: true });
    emit('select', id);
}
</script>
