import collect from 'collect.js';
import { get, has, set, merge, isEmpty } from 'lodash';

export default class {
    constructor(key, data = {}) {
        this.key = key;
        this.data = data ?? {};
    }

    getKey() {
        return this.key;
    }

    get(key = null, defaultValue = null) {
        if (key === null) {
            return this.all();
        }

        return get(this.data, key, defaultValue);
    }

    has(key) {
        return has(this.data, key) && this.get(key);
    }

    set(key, value) {
        return set(this.data, key, value);
    }

    merge(key, defaultValue) {
        return merge(defaultValue, this.get(key, {}));
    }

    keys() {
        return Object.keys(this.data);
    }

    remove(key) {
        if (this.has(key)) {
            delete this.data[key];
        }
    }

    clone() {
        return new this.constructor(this.key, { ...this.data });
    }

    all() {
        return this.data;
    }

    toCollection(key = null) {
        return collect(this.get(key, {}));
    }

    isEmpty() {
        return isEmpty(this.data);
    }
}
