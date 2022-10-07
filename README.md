# PersistentMap

A extended version of `Map` that allows you to keep data persistent with the help of JSON.

```js
const { PersistentMap } = require('@keita-sama69/persistent-map');

/**
 * @param {string} name - Name of the JSON file 
 * @param {boolean} writeOnOperation - Determines whether this will write on every operation
 * @param {string} path - Path of the JSON file.
*/
const persistent = new PersistentMap(name, writeOnOperation, path);
```

To load in data from another JSON, just copy it over into the persistent file.

By default, every operation that alters the map entries entries will immediately write to the JSON file.
If you want to opt-out of this behaviour and manually write to the JSON, instantiate the class with `writeOnOperation` set to false. <br><br>When setting lots of values, doing:
```js
// writeOnOperation = true
for (let i = 0; i <= 10000; i++) {
    persistent.set(somedata);
}
```
is *much* slower than doing:
```js
// writeOnOperation = false
for (let i = 0; i <= 10000; i++)  {
    persistent.set(somedata);
}
persistent.write();
```
so choose wisely!

Just be aware that when `writeOnOperation` is off, you'll have to manage all your data on your own.<br>
A potential way to keep data up-to-date:
```js
// Saves data every minute.
setInterval(() => persistent.write(), 1 * 1000 * 60)
```

### Changelog 1.0.1
- added `writeOnOperation`