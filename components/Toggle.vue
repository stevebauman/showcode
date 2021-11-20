<template>
    <TToggle
        @input="(value) => $emit('input', value)"
        v-model="localValue"
        :classes="{
            wrapper:
                'bg-gray-800 rounded-full border-2 border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none focus:ring-opacity-50',
            wrapperChecked:
                'bg-violet-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none focus:ring-opacity-50',
            wrapperDisabled:
                'bg-gray-100 rounded-full border-2 border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none focus:ring-opacity-50',
            wrapperCheckedDisabled:
                'bg-violet-500 rounded-full border-2 border-transparent focus:ring-2 focus:ring-violet-500 focus:outline-none focus:ring-opacity-50',
            button: 'h-4 w-4 rounded-full bg-white shadow flex items-center justify-center text-gray-400 text-xs',
            buttonChecked:
                'h-4 w-4 rounded-full bg-white shadow flex items-center justify-center text-violet-500 text-xs',
            checkedPlaceholder:
                'rounded-full w-4 h-4 flex items-center justify-center text-gray-400 text-xs',
            uncheckedPlaceholder:
                'rounded-full w-4 h-4 flex items-center justify-center text-gray-400 text-xs',
        }"
    />
</template>

<script>
export default {
    props: {
        value: Boolean,
    },

    data() {
        return { localValue: this.value };
    },

    watch: {
        value(value) {
            this.localValue = value;
        },
    },
};
</script>
