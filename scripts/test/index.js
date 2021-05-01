/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2018 Mickael Jeanroy
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

const path = require('path');
const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const karma = require('karma');
const log = require('fancy-log');
const colors = require('ansi-colors');
const config = require('../config');

/**
 * Run unit test suite.
 *
 * @return {WritableStream} The pipe stream.
 */
function testUnit() {
  return gulp.src(path.join(config.test, 'units', '**', '*.js')).pipe(jasmine());
}

/**
 * Run integration tests on Karma.
 *
 * @param {function} done The `done` callback.
 * @return {void}
 */
function testIntegration(done) {
  const configFile = path.join(config.test, 'it', 'karma.conf.js');
  startKarma(configFile, done);
}

/**
 * Run tests on karma.
 *
 * @param {string} configFilePath The configuration file to use.
 * @param {function} done The `done` callback.
 * @return {void}
 */
function startKarma(configFilePath, done) {
  log(colors.grey(`Parsing karma configuration from: ${configFilePath}`));
  karma.config.parseConfig(configFilePath, null, {promiseConfig: true, throwErrors: true}).then((config) => {
    const srv = new karma.Server(config, (err) => {
      log(colors.grey('Calling done callback of Karma'));
      done(err);
    });

    log(colors.grey(`Starting karma server`));
    srv.start();
  });
}

module.exports = function test(done) {
  const taskFn = gulp.series(
      testUnit,
      testIntegration
  );

  taskFn(done);
};

