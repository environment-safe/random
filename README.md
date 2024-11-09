@environment-safe/random
========================
seed based multi type random number generation based on [seedrandom](https://github.com/davidbau/seedrandom) by [davidbau](https://github.com/davidbau) but as an ESM source compatible on the server and in the browser with a multitype generator allowing a single seed to generate many types.

Usage
-----

```js
const generator = new Random({seed: 'some-string-seed-value'});
const aFloatRatio = generator.random();
```

Testing
-------

Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless in chrome:
```bash
npm run headless-browser-test
```

to run the same test inside docker:
```bash
npm run container-test
```

Run the commonjs tests against the `/dist` commonjs source (generated with the `build-commonjs` target).
```bash
npm run require-test
```

Development
-----------
All work is done in the .mjs files and will be transpiled on commit to commonjs and tested.

If the above tests pass, then attempt a commit which will generate .d.ts files alongside the `src` files and commonjs classes in `dist`

