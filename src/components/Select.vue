<template>
    <select
        :value="value"
        @change="$emit('input', $event.target.value)"
        class="text-xs text-gray-400 bg-gray-800 border-2 rounded-md cursor-pointer hover:bg-gray-900"
    >
        <option
            v-for="option in selectable"
            :value="option.name"
            :key="option.name"
        >
            {{ option.title }}
        </option>
    </select>
</template>

<script>
export default {
    props: ["options", "value"],

    computed: {
        selectable() {
            return this.options.map((option) =>
                typeof option === "object"
                    ? option
                    : { name: option, title: option }
            );
        },
    },
};
</script>
