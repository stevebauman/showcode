import Record from './record';
import localForage from 'localforage';

export default class {
    /**
     * @param {String} name
     */
    constructor(name) {
        this.storage = localForage.createInstance({
            name: name,
            driver: localForage.LOCALSTORAGE,
        });
    }

    /**
     * Get a record by its key.
     *
     * @param {String} key
     *
     * @returns {Record}
     */
    async get(key) {
        const data = await this.storage.getItem(key);

        return this.makeRecord(key, data);
    }

    /**
     * Get a value from the store.
     *
     * @param {String} key
     * @param {*} defaultValue
     *
     * @returns {*}
     */
    async value(key, defaultValue = null) {
        const value = await this.storage.getItem(key);

        return value !== null ? value : defaultValue;
    }

    /**
     * Set a valuein the store
     *
     * @param {String} key
     * @param {*} value
     */
    async set(key, value) {
        return await this.storage.setItem(key, value);
    }

    /**
     * Determine if the store contains the given key.
     *
     * @param {String} key
     *
     * @returns {Boolean}
     */
    async has(key) {
        return (await this.storage.getItem(key)) !== null;
    }

    /**
     * Remove an item from the store by its key.
     *
     * @param {String} key
     */
    async remove(key) {
        return await this.storage.removeItem(key);
    }

    /**
     * Get all of the keys in the store.
     *
     * @returns {String[]}
     */
    async keys() {
        return await this.storage.keys();
    }

    /**
     * Get all of the records in the store.
     *
     * @returns {Record[]}
     */
    async all() {
        const keys = await this.keys();

        return await Promise.all(keys.map(async (key) => await this.get(key)));
    }

    /**
     * Sync the key in storage with the callback.
     *
     * @param {String} key
     * @param {Function} callback
     */
    async sync(key, callback) {
        const record = await this.get(key);

        callback(record);

        await this.set(record.getKey(), record.all());
    }

    /**
     * Make a new record.
     *
     * @param {String} key
     * @param {*} data
     *
     * @returns {Record}
     */
    makeRecord(key, data) {
        return new Record(key, data);
    }
}
