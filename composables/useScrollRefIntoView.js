import Vue from 'vue';
import { head } from 'lodash';

export default function (refs) {
    const scrollRefIntoView = (ref) => {
        const component = head(refs[ref] ?? []);

        if (!component) {
            return;
        }

        const el = component instanceof Vue ? component.$el : component;

        el.scrollIntoView({
            block: 'nearest',
            inline: 'center',
        });
    };

    return { scrollRefIntoView };
}
