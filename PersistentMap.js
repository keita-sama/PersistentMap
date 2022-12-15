const fs = require('fs');
const path = require('path');

class PersistentMap extends Map {
    constructor(name = 'persistent', writeOnOperation = true, directory = process.cwd()) {
        super();
        this.home = path.join(directory, `.${name}`);
        this.writeOnOperation = writeOnOperation;

        if (!fs.existsSync(this.home)) fs.writeFileSync(this.home, JSON.stringify({}), 'utf-8');

        const data = JSON.parse(fs.readFileSync(this.home).toString());
        if (Object.keys(data).length !== 0) for (const [key, value] of Object.entries(data)) super.set(key, value);
    }

    set(key, value, force) {
        super.set(key, value);
        this.save(force);
        return this;
    }

    delete(key, force) {
        if (super.has(key)) {
            super.delete(key);
            this.save(force);
            return true;
        }
        else {
            return false;
        }
    }

    forEach(func, force) {
        super.forEach(func);
        this.save(force);
        return;
    }

    clear(force) {
        super.clear();
        this.save(force);
        return;
    }

    write() {
        return fs.writeFileSync(this.home, JSON.stringify(Object.fromEntries(super.entries()), null, 4), 'utf-8');
    }

    save(force) {
        if (this.writeOnOperation === true || force === true) this.write();
    }
}

module.exports = PersistentMap;