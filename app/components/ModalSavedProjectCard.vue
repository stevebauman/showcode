<template>
    <div
        class="rounded-control absolute top-1.5 right-1.5 z-10 flex items-center gap-0.5 bg-white/80 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100 dark:bg-zinc-900/80"
    >
        <Button size="icon-sm" variant="ghost" v-tooltip.bottom="'Rename'" @click="$emit('rename')">
            <EditIcon class="size-3.5" />
        </Button>

        <Button
            size="icon-sm"
            variant="ghost"
            class="text-red-500 hover:text-red-600 dark:hover:text-red-400"
            v-tooltip.bottom="'Delete'"
            @click="$emit('remove')"
        >
            <XIcon class="size-3.5" />
        </Button>
    </div>

    <button
        :data-saved-project-id="project.tab.id"
        class="flex h-36 w-full cursor-pointer flex-col items-center text-left"
        @click="$emit('open')"
    >
        <div
            v-if="project.settings.image"
            class="w-full flex-1 bg-cover bg-center bg-no-repeat"
            :style="{ backgroundImage: `url(${project.settings.image})` }"
        />

        <div v-else class="bg-ui-chrome flex w-full flex-1 items-center justify-center">
            <ImageIcon class="size-8 text-zinc-300 dark:text-zinc-600" />
        </div>
    </button>

    <div class="border-ui-line bg-ui-panel w-full border-t px-3 py-2">
        <div class="text-ui-text truncate text-xs font-medium">
            {{ project.tab.name }}
        </div>
        <div class="text-[10px] text-zinc-400 dark:text-zinc-500">
            {{ new Date(project.tab.saved_at).toLocaleString() }}
        </div>
    </div>
</template>

<script setup>
import { EditIcon, ImageIcon, XIcon } from 'lucide-vue-next';

defineProps({
    project: { type: Object, required: true },
});

defineEmits(['open', 'remove', 'rename']);
</script>
