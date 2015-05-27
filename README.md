# karma-json-preprocessor

> Preprocessor for converting JSON files into JS variables.

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

This preprocessor converts JSON files into JS variables (using `JSON.parse`) and publishes them in the global `window.__json__`, so that you can use these for testing DOM operations.

For instance this `foo.json`

```json
{
  "id": 1,
  "name": 'foo'
}
```
This file will be served as `foo.json.js` and available in global `window.__json__`:

```js
console.log(window.__json__['foo.json'];
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com