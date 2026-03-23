<template>
    <select
        :value="currentValue"
        class="highlight cursor-pointer rounded-lg border-0 bg-ui-gray-800 py-1.5 text-xs font-medium text-ui-gray-400 hover:bg-ui-gray-900 focus:bg-ui-gray-900 focus:outline-none focus:ring-0"
        @change="updateValue($event.target.value)"
    >
        <template v-if="group">
            <optgroup v-for="(options, name) in selectable" :key="name" :label="name">
                <option v-for="option in options" :key="option.name" :value="option.name">
                    {{ option.title }}
                </option>
            </optgroup>
        </template>

        <template v-else>
            <option v-for="option in selectable" :key="option.name" :value="option.name">
                {{ option.title }}
            </option>
        </template>
    </select>
</template>

<script setup>
import { computed } from 'vue';
import { map, groupBy } from 'lodash';

const props = defineProps({
    group: String,
    options: [Array, Object],
    modelValue: [String, Number],
    value: [String, Number],
});

const emit = defineEmits(['update:modelValue', 'input']);

const currentValue = computed(() => props.modelValue ?? props.value);

function getSelectableValue(option) {
    return typeof option === 'object' ? option : { name: option, title: option };
}

function getSelectableOptions(options) {
    return map(options, (option) => getSelectableValue(option));
}

const selectable = computed(() => {
    if (!props.group) {
        return getSelectableOptions(props.options);
    }

    const selectable = {};
    const grouped = groupBy(props.options, props.group);

    Object.keys(grouped).forEach((group) => {
        selectable[group] = getSelectableOptions(grouped[group]);
    });

    return selectable;
});

function updateValue(value) {
    emit('input', value);
    emit('update:modelValue', value);
}
</script>
