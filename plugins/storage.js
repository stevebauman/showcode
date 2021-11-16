import Vue from 'vue';
import Storage from 'vue-ls';

Vue.use(Storage, {
    namespace: 'showcode__', // key prefix
    name: 'settings', // name variable Vue.[ls] or this.[$ls],
    storage: 'local', // storage name session, local, memory
});

Vue.settings.all = () => {
    const namespace = Vue.settings.options.namespace;

    const data = {};

    Object.keys(Vue.settings.storage).forEach((key) => {
        const prop = key.replace(namespace, '');
        
        data[prop] = Vue.settings.get(prop);
    });

    return data;
};
