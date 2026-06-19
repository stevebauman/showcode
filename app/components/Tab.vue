<template>
    <ContextMenu>
        <ContextMenuTrigger as-child>
            <div
                @click="$emit('navigate')"
                class="animate-tab-in group relative flex h-8 max-w-[200px] min-w-[120px] cursor-pointer items-center rounded-lg transition-all select-none"
                :class="[
                    active
                        ? 'z-10 bg-white/80 text-zinc-900 shadow-xs backdrop-blur-xl dark:bg-zinc-800/80 dark:text-zinc-100'
                        : 'text-zinc-500 hover:bg-white/40 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/30 dark:hover:text-zinc-300',
                ]"
            >
                <div class="flex size-full items-center gap-1 px-2">
                    <span
                        :title="name || 'Untitled Project'"
                        @dblclick.stop="rename"
                        class="flex-1 truncate text-center text-xs"
                    >
                        {{ name || 'Untitled Project' }}
                    </span>

                    <button
                        type="button"
                        @click.stop="close"
                        class="shrink-0 rounded-full p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                        :class="{ 'opacity-100': active }"
                    >
                        <XIcon class="size-3" />
                    </button>
                </div>
            </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
            <ContextMenuItem @select="$emit('save')">Save</ContextMenuItem>
            <ContextMenuItem @select="$emit('save-as')">Save As...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem @select="rename">Rename</ContextMenuItem>
            <ContextMenuItem @select="$emit('duplicate')">Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem @select="close">Close Tab</ContextMenuItem>
            <ContextMenuItem :disabled="!canCloseOthers" @select="$emit('close-others')">
                Close Other Projects
            </ContextMenuItem>
            <ContextMenuItem
                :disabled="!canCloseProjectsToLeft"
                @select="$emit('close-projects-to-left')"
            >
                Close Projects to the Left
            </ContextMenuItem>
            <ContextMenuItem
                :disabled="!canCloseProjectsToRight"
                @select="$emit('close-projects-to-right')"
            >
                Close Projects to the Right
            </ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
</template>

<script setup>
import { XIcon } from 'lucide-vue-next';

defineProps({
    name: String,
    active: Boolean,
    modified: Boolean,
    canCloseOthers: Boolean,
    canCloseProjectsToLeft: Boolean,
    canCloseProjectsToRight: Boolean,
});

const emit = defineEmits([
    'close',
    'navigate',
    'duplicate',
    'rename',
    'save',
    'save-as',
    'close-others',
    'close-projects-to-left',
    'close-projects-to-right',
]);

function close() {
    emit('close');
}

function rename() {
    emit('navigate');
    emit('rename');
}
</script>
