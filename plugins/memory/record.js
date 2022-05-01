import collect, { Collection } from 'collect.js';
import { get, has, set, merge, isEmpty } from 'lodash';

export default class Record {
    /**
     * @param {String} key
     * @param {Object} data
     */
    constructor(key, data = {}) {
        this.key = key;
        this.data = data ?? {};
    }

    /**
     * Get the key from the record.
     *
     * @returns {String}
     */
    getKey() {
        return this.key;
    }

    /**
     * Get the value of the key.
     *
     * @param {String} key
     * @param {*} defaultValue
     *
     * @returns {*}
     */
    get(key = null, defaultValue = null) {
        if (key === null) {
            return this.all();
        }

        return get(this.data, key, defaultValue);
    }

    /**
     * Determine if the record has the key.
     *
     * @param {String} key
     *
     * @returns {Boolean}
     */
    has(key) {
        return has(this.data, key) && this.get(key);
    }

    /**
     * Set the key's value.
     *
     * @param {String} key
     * @param {*} value
     *
     * @returns {Object}
     */
    set(key, value) {
        return set(this.data, key, value);
    }

    /**
     * Merge the value into the key.
     *
     * @param {String} key
     * @param {*} value
     *
     * @returns {Object}
     */
    merge(key, value) {
        return merge(value, this.get(key, {}));
    }

    /**
     * Get all of the keys in the record.
     *
     * @returns {String[]}
     */
    keys() {
        return Object.keys(this.data);
    }

    /**
     * Remove the key from the data.
     *
     * @param {String} key
     */
    remove(key) {
        if (this.has(key)) {
            delete this.data[key];
        }
    }

    /**
     * Clone the data into a new record instance.
     *
     * @returns {Record}
     */
    clone() {
        return new this.constructor(this.key, { ...this.data });
    }

    /**
     * Get the data in the record.
     *
     * @returns {Object}
     */
    all() {
        return this.data;
    }

    /**
     * Convert the record to a collection.
     *
     * @param {String|null} key
     *
     * @returns {Collection}
     */
    toCollection(key = null) {
        return collect(this.get(key, {}));
    }

    /**
     * Determine if the data is empty.
     *
     * @returns {Boolean}
     */
    isEmpty() {
        return isEmpty(this.data);
    }
}
