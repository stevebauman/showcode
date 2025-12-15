import { head } from 'lodash-es';
import { unref } from 'vue';

export default function (refs) {
    function scrollRefIntoView(refName) {
        const refValue = refs[refName];
        const component = Array.isArray(refValue) ? head(refValue) : refValue;

        if (!component) {
            return;
        }

        // In Vue 3, we use unref to get the actual element
        const el = unref(component)?.$el ?? unref(component);

        el?.scrollIntoView({
            block: 'nearest',
            inline: 'center',
        });
    }

    return { scrollRefIntoView };
}
