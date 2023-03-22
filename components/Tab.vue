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
                @click.native="close"
                size="2xs"
                dusk="button-close-tab"
                class="group-hover:visible"
                :class="{ visible: active, invisible: !active }"
            >
                <XIcon class="h-4 w-4" />
            </Button>
        </div>

        <div class="flex items-center justify-center text-center w-full">
            <button
                dusk="button-view-tab"
                @focus="focusing = true"
                @blur="focusing = false"
                :class="{ 'tracking-wide px-4': active, 'px-2': !active }"
                class="flex items-center h-full py-1 w-42 focus:outline-none"
            >
                <input
                    dusk="input-tab-name"
                    v-show="editingName"
                    v-model="localName"
                    ref="titleInput"
                    type="text"
                    @keyup.enter="save"
                    class="w-full p-0 pl-4 text-xs text-center font-semibold tracking-wide truncate bg-transparent border-0 shadow-none focus:ring-0"
                />

                <span v-show="!editingName" class="text-xs truncate">
                    {{ name || 'Untitled Project' }}
                </span>
            </button>
        </div>

        <Dropdown
            size="2xs"
            dusk="dropdown-actions"
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
            dusk="button-edit-tab"
            @click.native="toggleEditing"
            @focus.native="focusing = true"
            @blur.native="focusing = false"
            v-tooltip="'Save Project Name'"
        >
            <CheckIcon class="w-4 h-4" />
        </TabButton>
    </div>
</template>

<script>
import { ref, toRefs, nextTick } from '@nuxtjs/composition-api';
import { XIcon, CheckIcon, MoreVerticalIcon } from 'vue-feather-icons';

export default {
    props: {
        name: String,
        active: Boolean,
        modified: Boolean,
    },

    components: { XIcon, CheckIcon, MoreVerticalIcon },

    setup(props, { emit }) {
        const { name } = toRefs(props);

        const titleInput = ref(null);
        const localName = ref(name.value);
        const focusing = ref(false);
        const editingName = ref(false);

        const close = () => {
            if (!props.modified) {
                return emit('close');
            }

            if (confirm('Close this project?')) {
                emit('close');
            }
        };

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
            close,
            titleInput,
            localName,
            focusing,
            editingName,
            toggleEditing,
        };
    },
};
</script>
