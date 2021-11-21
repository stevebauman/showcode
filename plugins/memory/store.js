import Record from './record';
import localForage from "localforage";

export default class {
    constructor(name) {
        this.storage = localForage.createInstance({
            name: name,
            driver: localForage.LOCALSTORAGE,
        });
    }

    async get(key) {
        const data = await this.storage.getItem(key);

        return this.makeRecord(key, data);
    }

    async set(key, value) {
        return await this.storage.setItem(key, value);
    }

    async remove(key) {
        return await this.storage.removeItem(key);
    }

    async keys() {
        return await this.storage.keys();
    }

    async all() {
        const keys = await this.keys();

        return await Promise.all(
            keys.map(async (key) => await this.get(key))
        );
    }

    async sync(key, callback) {
        const record = await this.get(key);

        callback(record);

        await this.set(record.getKey(), record.all());
    }

    makeRecord(key, data) {
        return new Record(key, data);
    }
}
