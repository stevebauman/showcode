import { head } from 'lodash';

export default function (refs) {
    function scrollRefIntoView(ref) {
        const component = head(refs[ref] ?? []);

        if (!component) {
            return;
        }

        const el = component.$el ?? component;

        el.scrollIntoView({
            block: 'nearest',
            inline: 'center',
        });
    }

    return { scrollRefIntoView };
}
