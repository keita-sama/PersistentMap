const fs = require('fs');
const node_path = require('path');

class PersistentMap extends Map {
    #home;
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
    set(key, value) {
        const val = super.set(key, value);
        this.#write(super.entries());
        return val;
    }
    delete(key) {
        const val = super.delete(key);
        this.#write(super.entries());
        return val;
    }
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