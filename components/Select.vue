<template>
    <select
        :value="value"
        @change="$emit('input', $event.target.value)"
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

<script>
import { map, groupBy } from 'lodash';
import { computed, toRefs } from '@nuxtjs/composition-api';

export default {
    props: {
        group: String,
        options: [Array, Object],
        value: [String, Number],
    },

    setup(props) {
        const { group, options } = toRefs(props);

        const getSelectableValue = (option) => {
            return typeof option === 'object' ? option : { name: option, title: option };
        };

        const getSelectableOptions = (options) => {
            return map(options, (option) => {
                return getSelectableValue(option);
            });
        };

        return {
            selectable: computed(() => {
                if (!group.value) {
                    return getSelectableOptions(options.value);
                }

                const selectable = {};

                const grouped = groupBy(options.value, group.value);

                Object.keys(grouped).forEach((group) => {
                    selectable[group] = getSelectableOptions(grouped[group]);
                });

                return selectable;
            }),
        };
    },
};
</script>
