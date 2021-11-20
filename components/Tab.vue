<template>
    <div
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
        class="flex items-center h-full"
        :class="{
            'text-gray-600 bg-white hover:bg-gray-50': active,
            'text-gray-300 bg-gray-600 hover:bg-gray-500': !active,
        }"
    >
        <button
            @click="$emit('navigate')"
            :class="{ 'font-semibold tracking-wide': active }"
            class="flex items-center w-40 h-full px-4 py-1 space-x-4"
        >
            <input
                v-if="editingName"
                v-model="localName"
                type="text"
                @keyup.enter="save"
                class="w-full p-0 text-xs font-semibold truncate bg-transparent border-0 shadow-none  focus:ring-0"
            />

            <span v-else class="text-xs truncate">{{ name }}</span>
        </button>

        <button
            @click="toggleEditing"
            class="
                inline-flex
                items-center
                justify-center
                w-6
                h-6
                p-0.5
                mx-1
                text-gray-400
                rounded
                hover:bg-gray-400 hover:text-gray-100
            "
        >
            <span v-if="hovering || editingName">
                <CheckIcon v-if="editingName" />
                <Edit3Icon class="w-5 h-5" v-else />
            </span>
        </button>

        <button
            @click="$emit('close')"
            class="
                inline-flex
                items-center
                justify-center
                w-6
                h-6
                p-0.5
                mx-1
                text-gray-400
                rounded
                hover:bg-gray-400 hover:text-gray-100
            "
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
            this.$emit('change-name', this.localName);

            this.editingName = false;
        },
    },
};
</script>
