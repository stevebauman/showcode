<template>
    <div
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
        class="relative flex items-center h-full rounded-lg hover:bg-gray-900"
        :class="{
            'text-gray-50 bg-gray-600': active,
            'text-gray-400 bg-gray-700': !active,
        }"
    >
        <div class="absolute top-0 left-0 flex items-center h-full px-2">
            <span
                v-if="active"
                class="flex items-center justify-center w-2 h-2 rounded-full bg-violet-300"
                aria-hidden="true"
            ></span>
        </div>

        <button
            @click="$emit('navigate')"
            :class="{ 'font-semibold tracking-wide': active }"
            class="flex items-center w-40 h-full px-6 py-1 space-x-4"
        >
            <input
                v-if="editingName"
                v-model="localName"
                type="text"
                @keyup.enter="save"
                class="w-full p-0 text-xs font-semibold tracking-wide truncate bg-transparent border-0 shadow-none focus:ring-0"
            />

            <span v-else class="text-xs truncate">{{ name }}</span>
        </button>

        <button
            @click="toggleEditing"
            class="inline-flex items-center justify-center w-6 h-6 p-0.5 mx-1 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-gray-100"
        >
            <span v-if="hovering || editingName">
                <CheckIcon v-if="editingName" />
                <Edit3Icon class="w-5 h-5" v-else />
            </span>
        </button>

        <button
            @click="$emit('close')"
            class="inline-flex items-center justify-center w-6 h-6 p-0.5 mx-1 text-gray-400 rounded-lg hover:bg-gray-900 hover:text-gray-100"
        >
            <XIcon />
        </button>
    </div>
</template>

<script>
import { XIcon, CheckIcon, Edit3Icon } from 'vue-feather-icons';

export default {
    props: {
        name: String,
        active: Boolean,
    },

    components: { XIcon, CheckIcon, Edit3Icon },

    data() {
        return {
            localName: this.name,
            hovering: false,
            editingName: false,
        };
    },

    methods: {
        toggleEditing() {
            this.$emit('navigate');

            this.editingName ? this.save() : (this.editingName = true);
        },

        save() {
            const newName = this.localName.trim().length > 0 ? this.localName : this.name;

            this.$emit('update:name', newName);

            this.localName = newName;

            this.editingName = false;
        },
    },
};
</script>
