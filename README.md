# karma-json-preprocessor

Preprocessor for converting JSON files into JS variables.

## Installation

Using npm:

`npm install karma-json-preprocessor --save-dev`

## Configuration

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

## How does it work ?

This preprocessor converts JSON files into JS variables and publishes them in the global `window.__json__`, so that you can use these to externalize your json fixtures.

Note that your files will be validated with JSON.parse and ignored if parsing throw an error.

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

This preprocessor will publish javascript on a global variable: it means that if you update an object, theses updates will never be reverted. If your tests do not alter objects, you don't have to worry about this, otherwise, you should clone objects before using it.

Since version 0.3.0, you can also use the `$get` function to use a clone of the original object:

```js
console.log(window.__json__.$get('foo.json'));

// Following line will display 'true'
// Objects are equals, but new instance is returned each time.
console.log(window.__json__.$get('foo.json') !== window.__json__.$get('foo.json'));
```

## Configuration

Default global variable name is by default `__json__`, but you can override it with your own name in karma configuration:

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

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
