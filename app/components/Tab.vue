<template>
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
                v-show="!editingName"
                :title="name || 'Untitled Project'"
                @dblclick.stop="startEditing"
                class="flex-1 truncate text-center text-xs"
            >
                {{ name || 'Untitled Project' }}
            </span>

            <input
                v-show="editingName"
                v-model="localName"
                ref="titleInput"
                type="text"
                @click.stop
                @blur-sm="save"
                @keyup.enter="save"
                @keyup.escape="cancelEditing"
                class="w-full flex-1 truncate border-0 bg-transparent p-0 text-center text-xs text-zinc-900 shadow-none focus:ring-0 focus:outline-hidden dark:text-zinc-100"
            />

            <button
                v-if="!editingName"
                @click.stop="close"
                class="shrink-0 rounded-full p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                :class="{ 'opacity-100': active }"
            >
                <XIcon class="size-3" />
            </button>
        </div>

        <DropdownMenu v-if="!editingName">
            <DropdownMenuTrigger as-child>
                <button
                    @click.stop
                    class="absolute top-0 right-0 bottom-0 flex items-center pr-1 opacity-0 transition-opacity group-hover:opacity-100"
                    :class="{ 'opacity-0': true }"
                >
                    <span class="sr-only">Tab menu</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
                <DropdownMenuItem @select="$emit('duplicate')">Duplicate</DropdownMenuItem>
                <DropdownMenuItem @select="toggleEditing">Change Project Name</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>

<script setup>
import { ref, toRefs, nextTick } from 'vue';
import { XIcon } from 'lucide-vue-next';

const props = defineProps({
    name: String,
    active: Boolean,
    modified: Boolean,
});

const emit = defineEmits(['close', 'navigate', 'duplicate', 'update:name']);

const { name } = toRefs(props);

const titleInput = ref(null);
const localName = ref(name.value);
const editingName = ref(false);
function close() {
    if (props.modified && !confirm('Close this project?')) return;

    emit('close');
}

function save() {
    const newName = (localName.value || '').trim().length > 0 ? localName.value : name.value;
    emit('update:name', newName);
    localName.value = newName;
    editingName.value = false;
}

function toggleEditing() {
    emit('navigate');
    if (editingName.value) return save();
    editingName.value = true;
    nextTick(() => titleInput.value.focus());
}

function startEditing() {
    if (!editingName.value) {
        emit('navigate');
        editingName.value = true;
        nextTick(() => titleInput.value.focus());
    }
}

function cancelEditing() {
    localName.value = name.value;
    editingName.value = false;
}
</script>
