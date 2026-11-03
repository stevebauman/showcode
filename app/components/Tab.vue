<template>
    <div class="shrink-0">
        <ContextMenu>
            <ContextMenuTrigger as-child>
                <div
                    @click="$emit('navigate')"
                    class="animate-tab-in group relative flex h-8 max-w-72 min-w-40 cursor-pointer items-center rounded-lg border-[0.5px] transition-colors duration-100 select-none"
                    :class="[
                        active
                            ? 'bg-ui-hover text-ui-text z-10 border-black/10 dark:border-white/12'
                            : 'text-ui-muted hover:bg-ui-hover hover:text-ui-text border-transparent',
                    ]"
                >
                    <div class="flex size-full items-center gap-1.5 px-2.5">
                        <span
                            :title="name || (starting ? 'New Project' : 'Untitled Project')"
                            @dblclick.stop="rename"
                            class="flex-1 truncate text-[13px]"
                        >
                            {{ name || (starting ? 'New Project' : 'Untitled Project')
                            }}{{ modified ? ' *' : '' }} - Showcode
                        </span>

                        <button
                            type="button"
                            aria-label="Close tab"
                            @click.stop="close"
                            class="text-ui-muted hover:text-ui-text hover:bg-ui-selected shrink-0 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                            :class="{ 'opacity-100': active }"
                        >
                            <XIcon class="size-3" />
                        </button>
                    </div>
                </div>
            </ContextMenuTrigger>

            <ContextMenuContent>
                <ContextMenuItem :disabled="starting" @select="$emit('save')">Save</ContextMenuItem>
                <ContextMenuItem :disabled="starting" @select="$emit('save-as')">
                    Save As...
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem :disabled="starting" @select="rename">Rename</ContextMenuItem>
                <ContextMenuItem :disabled="starting" @select="$emit('duplicate')">
                    Duplicate
                </ContextMenuItem>
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
                <ContextMenuSeparator />
                <ContextMenuItem
                    :disabled="!canReopenClosedProject"
                    @select="$emit('reopen-closed')"
                >
                    Reopen Closed Project
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    </div>
</template>

<script setup>
import { XIcon } from 'lucide-vue-next';

const props = defineProps({
    name: String,
    active: Boolean,
    starting: Boolean,
    modified: Boolean,
    canCloseOthers: Boolean,
    canCloseProjectsToLeft: Boolean,
    canCloseProjectsToRight: Boolean,
    canReopenClosedProject: Boolean,
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
    'reopen-closed',
]);

function close() {
    emit('close');
}

function rename() {
    if (props.starting) {
        return;
    }

    emit('navigate');
    emit('rename');
}
</script>
