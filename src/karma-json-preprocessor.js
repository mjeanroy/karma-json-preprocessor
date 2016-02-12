/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var util = require('util');

var createTemplate = function(varName) {
  return '' +
    // Append to dictionary object
    'window.' + varName + ' = window.' + varName + ' || {};\n' +
    'window.' + varName + '[\'%s\'] = %s;\n' +

    // Append getter function that will clone object
    'window.' + varName + '.$get = window.' + varName + '.$get || function(path) {\n' +
    '  try { \n' +
    '    return JSON.parse(JSON.stringify(window.' + varName + '[path]));\n' +
    '  } catch (e) {\n' +
    '    console.warn("Unable to process json file: ", path);\n' +
    '    return null;\n' +
    '  }' +
    '};';
};

var createJsonPreprocessor = function(logger, basePath, config) {
  var log = logger.create('preprocessor.json');

  return function(content, file, done) {
    log.debug('Processing "%s".', file.originalPath);
    var conf = config || {};
    var jsonPath = file.originalPath.replace(basePath + '/', '');
    var template = createTemplate(conf.varName || '__json__');

    // Update file path
    file.path = file.path + '.js';

    try {
      var o = JSON.parse(content.trim());
      done(util.format(template, jsonPath, JSON.stringify(o)));
    } catch (e) {
      log.error('Json representation of %s is not valid !', file.originalPath);
      done('');
    }
  };
};

createJsonPreprocessor.$inject = ['logger', 'config.basePath', 'config.jsonPreprocessor'];

module.exports = {
  'preprocessor:json': ['factory', createJsonPreprocessor]
};