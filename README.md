# karma-json-preprocessor

Preprocessor for converting JSON files into JS variables.

## Installation

Using npm:

`npm install karma-json-preprocessor --save-dev`

## Usage

Following code shows the default configuration:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.json': ['json']
    },

    files: [
      '**/*.js',
      '**/*.json'
    ]
  });
};
```

## How does it work?

This preprocessor converts JSON files into JS variables and publishes them in the global `window.__json__`, so that you can use these to externalize your json fixtures.

Note that your files will be validated with `JSON.parse`: if parsing throws an error, an error is logged and the file is ignored.

For instance this `foo.json`

```json
{
  "id": 1,
  "name": "foo"
}
```

This file will be served as `foo.json.js` and available in global `window.__json__`:

```js
console.log(window.__json__['foo.json']);
console.log(window.__json__['foo.json'].id);
console.log(window.__json__['foo.json'].name);
```

Each file is registered with its path relative to the karma `basePath`. For instance, with `basePath: '.'`, the file `test/fixtures/foo.json` is available as `window.__json__['test/fixtures/foo.json']` (see the `stripPrefix` option below to shorten these keys).

This preprocessor will publish javascript on a global variable: it means that if you update an object, these updates will never be reverted. If your tests do not alter objects, you don't have to worry about this, otherwise, you should clone objects before using it.

Since version 0.3.0, you can also use the `$get` function to use a clone of the original object:

```js
console.log(window.__json__.$get('foo.json'));

// Following line will display 'true'
// Objects are equal, but a new instance is returned each time.
console.log(window.__json__.$get('foo.json') !== window.__json__.$get('foo.json'));
```

If no file is registered for the given path, `$get` logs a warning and returns `null`.

## Configuration

Options are set in the `jsonPreprocessor` entry of your karma configuration.

### `varName`

Default global variable name is `__json__`, but you can override it with your own name:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.json': ['json']
    },

    files: [
      '**/*.js',
      '**/*.json'
    ],

    jsonPreprocessor: {
      varName: '$json'
    }
  });
};
```

And now in your test:

```js
console.log(window.$json['foo.json']);
console.log(window.$json['foo.json'].id);
console.log(window.$json['foo.json'].name);
```

### `stripPrefix`

Since version 0.3.3, you can remove a prefix from the beginning of each file path:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      'test/fixtures/**/*.json': ['json']
    },

    files: [
      '**/*.js',
      'test/fixtures/**/*.json'
    ],

    jsonPreprocessor: {
      stripPrefix: 'test/fixtures/'
    }
  });
};
```

And now in your test, `test/fixtures/foo.json` is available as:

```js
console.log(window.__json__['foo.json']);
```

Note that `stripPrefix` is used as a regular expression (anchored at the beginning of the path), so special characters such as `.` must be escaped.

----

For more information on Karma see the [homepage].


[homepage]: https://karma-runner.github.io
