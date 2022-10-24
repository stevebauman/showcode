<template>
    <div
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
        class="relative flex items-center h-full cursor-pointer group"
        :class="{
            'text-ui-gray-50 bg-ui-gray-700': active,
            'text-ui-gray-400 bg-ui-gray-600 hover:bg-ui-gray-900 focus-within:bg-ui-gray-900':
                !active,
        }"
    >
        <div class="absolute top-0 left-0 flex items-center h-full px-4">
            <Dot v-if="active" />
        </div>

        <button
            dusk="button-view-tab"
            @click="$emit('navigate')"
            @focus="focusing = true"
            @blur="focusing = false"
            :class="{ 'tracking-wide px-4': active, 'px-2': !active }"
            class="flex items-center h-full py-1 space-x-4 w-42 focus:outline-none"
        >
            <input
                dusk="input-tab-name"
                v-show="editingName"
                v-model="localName"
                ref="titleInput"
                type="text"
                @keyup.enter="save"
                class="w-full p-0 pl-4 text-xs font-semibold tracking-wide truncate bg-transparent border-0 shadow-none focus:ring-0"
            />

            <span v-show="!editingName" class="text-xs truncate">
                {{ name || 'Untitled Project' }}
            </span>
        </button>

        <TabButton
            v-if="!editingName"
            dusk="button-edit-tab"
            @click.native="$emit('duplicate')"
            @focus.native="focusing = true"
            @blur.native="focusing = false"
            v-tooltip="'Duplicate Project'"
        >
            <span v-if="hovering || focusing">
                <CopyIcon class="w-4 h-4" />
            </span>
        </TabButton>

        <TabButton
            dusk="button-edit-tab"
            @click.native="toggleEditing"
            @focus.native="focusing = true"
            @blur.native="focusing = false"
            v-tooltip="editingName ? 'Save Project Name' : 'Change Project Name'"
        >
            <span v-if="hovering || focusing || editingName">
                <CheckIcon class="w-4 h-4" v-if="editingName" />
                <Edit3Icon class="w-4 h-4" v-else />
            </span>
        </TabButton>

        <TabButton
            dusk="button-close-tab"
            @focus.native="focusing = true"
            @blur.native="focusing = false"
            @click.native="() => (editingName ? (editingName = false) : $emit('close'))"
            v-tooltip="'Close Project'"
        >
            <XIcon />
        </TabButton>
    </div>
</template>

<script>
import { ref, toRefs, nextTick } from '@nuxtjs/composition-api';
import { XIcon, CopyIcon, CheckIcon, Edit3Icon } from 'vue-feather-icons';

export default {
    props: {
        name: String,
        active: Boolean,
    },

    components: { XIcon, CopyIcon, CheckIcon, Edit3Icon },

    setup(props, { emit }) {
        const { name } = toRefs(props);

        const titleInput = ref(null);
        const localName = ref(name.value);
        const hovering = ref(false);
        const focusing = ref(false);
        const editingName = ref(false);

        const save = () => {
            const newName =
                (localName.value || '').trim().length > 0 ? localName.value : name.value;

            emit('update:name', newName);

            localName.value = newName;

            editingName.value = false;
        };

        const toggleEditing = () => {
            emit('navigate');

            if (editingName.value) {
                return save();
            }

            editingName.value = true;

            nextTick(() => titleInput.value.focus());
        };

        return {
            save,
            titleInput,
            localName,
            hovering,
            focusing,
            editingName,
            toggleEditing,
        };
    },
};
</script>
