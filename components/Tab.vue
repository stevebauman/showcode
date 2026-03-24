<template>
    <div
        @click="$emit('navigate')"
        class="relative flex items-center h-full cursor-pointer group w-48 px-1"
        :class="{
            'text-ui-gray-50 bg-ui-gray-700': active,
            'text-ui-gray-400 bg-ui-gray-800 hover:bg-ui-gray-900 focus-within:bg-ui-gray-900':
                !active,
        }"
    >
        <div class="flex items-center h-full justify-center w-10">
            <Button
                @click="close"
                size="sm"
                variant="ghost"
                class="group-hover:visible h-auto px-1 py-0.5"
                :class="{ visible: active, invisible: !active }"
            >
                <XIcon class="h-4 w-4" />
            </Button>
        </div>

        <div class="flex items-center justify-center text-center w-full truncate">
            <button
               
                @focus="focusing = true"
                @blur="focusing = false"
                @dblclick="startEditing"
                class="flex items-center h-full py-1 w-42 focus:outline-none truncate px-2"
            >
                <input
                   
                    v-show="editingName"
                    v-model="localName"
                    ref="titleInput"
                    type="text"
                    @blur="save"
                    @keyup.enter="save"
                    @keyup.escape="cancelEditing"
                    class="w-full p-0 pl-4 text-xs text-center tracking-wide truncate bg-transparent border-0 shadow-none focus:ring-0"
                />

                <span v-show="!editingName" :title="name" class="text-xs truncate">
                    {{ name || 'Untitled Project' }}
                </span>
            </button>
        </div>

        <Dropdown
            size="sm"
           
            v-if="!editingName"
            :class="{ visible: active, invisible: !active }"
            class="flex items-center justify-center w-10"
            :items="[
                {
                    name: 'duplicate',
                    click: () => $emit('duplicate'),
                    title: 'Duplicate',
                },
                {
                    name: 'edit',
                    click: () => toggleEditing(),
                    title: 'Change Project Name',
                },
            ]"
        >
            <MoreVerticalIcon class="w-4 h-4" />
        </Dropdown>

        <TabButton
            v-if="active && editingName"
           
            @click="toggleEditing"
            @focus="focusing = true"
            @blur="focusing = false"
            v-tooltip="'Save Project Name'"
        >
            <CheckIcon class="w-4 h-4" />
        </TabButton>
    </div>
</template>

<script setup>
import { ref, toRefs, nextTick } from 'vue';
import { XIcon, CheckIcon, MoreVerticalIcon } from 'lucide-vue-next';

const props = defineProps({
    name: String,
    active: Boolean,
    modified: Boolean,
});

const emit = defineEmits(['close', 'navigate', 'duplicate', 'update:name']);

const { name } = toRefs(props);

const titleInput = ref(null);
const localName = ref(name.value);
const focusing = ref(false);
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
