import { merge } from 'lodash';
import Vue from 'vue';
import Storage from 'vue-ls';

Vue.use(Storage, {
    namespace: 'showcode.pages.',
    name: 'pages',
    storage: 'local',
});

Vue.use(Object.assign({}, Storage), {
    namespace: 'showcode.settings.',
    name: 'settings',
    storage: 'local',
});

Vue.pages.merge = (key, value) => {
    const current = Vue.pages.get(key) ?? {};

    return Vue.pages.set(key, merge(current, value));
}

Vue.pages.all = () => {
    const namespace = Vue.pages.options.namespace;

    const data = {};

    Object.keys(Vue.pages.storage).filter(
        (key) => key.includes(namespace)
    ).forEach((key) => {
        const prop = key.replace(namespace, '');

        data[prop] = Vue.pages.get(prop);
    });

    return data;
};
