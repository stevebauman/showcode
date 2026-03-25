<template>
    <div
        @click="$emit('navigate')"
        class="relative flex items-center h-7 cursor-pointer group max-w-[200px] min-w-[120px] select-none transition-all rounded-lg animate-tab-in"
        :class="[
            closing ? 'animate-tab-out' : '',
            active
                ? 'bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl text-zinc-900 dark:text-zinc-100 z-10 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/40 dark:hover:bg-zinc-800/30 hover:text-zinc-700 dark:hover:text-zinc-300',
        ]"
    >
        <div class="flex items-center w-full h-full gap-1 px-2">
            <span
                v-show="!editingName"
                :title="name || 'Untitled Project'"
                @dblclick.stop="startEditing"
                class="flex-1 text-xs truncate text-center"
            >
                {{ name || 'Untitled Project' }}
            </span>

            <input
                v-show="editingName"
                v-model="localName"
                ref="titleInput"
                type="text"
                @click.stop
                @blur="save"
                @keyup.enter="save"
                @keyup.escape="cancelEditing"
                class="flex-1 w-full p-0 text-xs text-center truncate bg-transparent border-0 shadow-none text-zinc-900 dark:text-zinc-100 focus:ring-0 focus:outline-none"
            />

            <button
                v-if="!editingName"
                @click.stop="close"
                class="shrink-0 rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-opacity"
                :class="{ 'opacity-100': active }"
            >
                <XIcon class="w-3 h-3" />
            </button>
        </div>

        <DropdownMenu v-if="!editingName">
            <DropdownMenuTrigger as-child>
                <button
                    @click.stop
                    class="absolute right-0 top-0 bottom-0 flex items-center pr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    :class="{ 'opacity-0': true }"
                >
                    <span class="sr-only">Tab menu</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
                <DropdownMenuItem @select="$emit('duplicate')">
                    Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem @select="toggleEditing">
                    Change Project Name
                </DropdownMenuItem>
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
    if (!props.modified) return emit('close');
    if (confirm('Close this project?')) emit('close');
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
