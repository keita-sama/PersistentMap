const fs = require('fs');
const node_path = require('path');

class PersistentMap extends Map {
    #home;
    /**
     * @param {string} name - name of your file
     * @param {string} path - path to your file
     */
    constructor(name = 'persistent', path = process.cwd()) {
        super();
        this.#home = node_path.join(path, `${name}.json`);

        if (!fs.existsSync(this.#home)) {
            fs.writeFileSync(this.#home, JSON.stringify({}), 'utf-8');
        }
        else {
            const data = JSON.parse(fs.readFileSync(this.#home));
            if (Object.keys(data).length !== 0) {
                Object.entries(data).forEach((entry) => {
                    const [key, value] = entry;
                    super.set(key, value);
                });
            }
        }
    }
    /**
     * @param {string|number|null|undefined|bigint|symbol|object} key
     * @param {string|number|null|undefined|bigint|symbol|object} value
     */
    set(key, value) {
        const val = super.set(key, value);
        this.#write(super.entries());
        return val;
    }
    /**
     * @param {string|number|null|undefined|bigint|symbol|object} key
     */
    delete(key) {
        const val = super.delete(key);
        this.#write(super.entries());
        return val;
    }
    /**
     * @param {*} _opts
     */
    forEach(_opts) {
        const val = super.forEach(...arguments);
        this.#write(super.entries());
        return val;
    }
    #write(data) {
        return fs.writeFileSync(this.#home, JSON.stringify(Object.fromEntries(data), null, 4), 'utf-8');
    }
}

module.exports = PersistentMap;