<template>
    <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="highlight text-xs font-medium border-0 py-1.5 rounded-lg cursor-pointer text-ui-gray-400 bg-ui-gray-800 hover:bg-ui-gray-900 focus:outline-none focus:bg-ui-gray-900 focus:ring-0"
    >
        <template v-if="group">
            <optgroup v-for="(options, name) in selectable" :label="name" :key="name">
                <option v-for="option in options" :value="option.name" :key="option.name">
                    {{ option.title }}
                </option>
            </optgroup>
        </template>

        <template v-else>
            <option v-for="option in selectable" :value="option.name" :key="option.name">
                {{ option.title }}
            </option>
        </template>
    </select>
</template>

<script setup>
import { map, groupBy } from 'lodash';
import { computed, toRefs } from 'vue';

const props = defineProps({
    group: String,
    options: [Array, Object],
    modelValue: [String, Number],
});

defineEmits(['update:modelValue']);

const { group, options } = toRefs(props);

function getSelectableValue(option) {
    return typeof option === 'object' ? option : { name: option, title: option };
}

function getSelectableOptions(opts) {
    return map(opts, (option) => getSelectableValue(option));
}

const selectable = computed(() => {
    if (!group.value) {
        return getSelectableOptions(options.value);
    }

    const result = {};
    const grouped = groupBy(options.value, group.value);

    Object.keys(grouped).forEach((g) => {
        result[g] = getSelectableOptions(grouped[g]);
    });

    return result;
});
</script>
