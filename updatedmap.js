const fs = require('fs');
const path = require('path');

class PersistentMap extends Map {
    constructor(
        name = 'persistent',
        writeOnOperation = true,
        directory = process.cwd(),
    ) {
        super();
        this.home = path.join(directory, `.${name}`);
        this.writeOnOperation = writeOnOperation;

        this.data = new Map();
        this.load();
    }

    load() {
        try {
            const data = JSON.parse(fs.readFileSync(this.home));
            if (Object.keys(data).length !== 0) {
                for (const [key, value] of Object.entries(data)) {
                    this.data.set(key, value);
                }
            }
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                fs.writeFileSync(this.home, '{}');
            }
            else {
                throw error;
            }
        }
    }

    set(key, value, force) {
        this.data.set(key, value);
        this.save(force);
        return this;
    }

    delete(key, force) {
        if (this.data.has(key)) {
            this.data.delete(key);
            this.save(force);
            return true;
        }
        else {
            return false;
        }
    }

    forEach(func, force) {
        this.data.forEach(func);
        this.save(force);
        return;
    }

    clear(force) {
        this.data.clear();
        this.save(force);
        return;
    }

    write() {
        fs.writeFile(this.home, JSON.stringify(Object.fromEntries(this.data.entries()), null, 4), 'utf-8', (error) => {
            if (error) {
                console.error(error);
            }
        });
        return;
    }

    save(force) {
        if (this.writeOnOperation === true || force === true) this.write();
    }
}

module.exports = PersistentMap;