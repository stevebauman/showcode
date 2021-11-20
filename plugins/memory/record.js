import collect from 'collect.js';
import { get, set, merge, isEmpty } from 'lodash';

export default class {
    constructor(key, data = {}) {
        this.key = key;
        this.data = data ?? {};
    }

    getKey() {
        return this.key;
    }

    get(key, defaultValue = null) {
        return get(this.data, key, defaultValue);
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

    clone() {
        return new this.constructor(this.key, { ...this.data });
    }

    all() {
        return this.data;
    }

    toCollection(key) {
        return collect(this.get(key, {}));
    }

    isEmpty() {
        return isEmpty(this.data);
    }
}