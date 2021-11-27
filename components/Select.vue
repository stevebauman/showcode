<template>
    <select
        :value="value"
        @change="$emit('input', $event.target.value)"
        class="text-xs font-medium text-ui-gray-400 bg-ui-gray-800 border-0 rounded-lg cursor-pointer hover:bg-ui-gray-900"
    >
        <option v-for="option in selectable" :value="option.name" :key="option.name">
            {{ option.title }}
        </option>
    </select>
</template>

<script>
export default {
    props: {
        options: Array,
        value: [String, Number],
    },

    computed: {
        selectable() {
            return this.options.map((option) =>
                typeof option === 'object' ? option : { name: option, title: option }
            );
        },
    },
};
</script>
