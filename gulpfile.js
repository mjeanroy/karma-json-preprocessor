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

/* eslint-disable require-jsdoc */

'use strict';

const path = require('path');
const del = require('del');
const log = require('fancy-log');
const colors = require('ansi-colors');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const bump = require('gulp-bump');
const tagVersion = require('gulp-tag-version');
const git = require('gulp-git');
const jasmine = require('gulp-jasmine');
const KarmaServer = require('karma').Server;

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const TEST = path.join(ROOT, 'test');
const DIST = path.join(ROOT, 'dist');
const PKG = path.join(ROOT, 'package.json');

function clean() {
  return del(DIST);
}

function lint() {
  const src = [
    path.join(SRC, '**', '*.js'),
    path.join(TEST, '**', '*.js'),
    path.join(ROOT, '*.js'),
  ];

  return gulp.src(src)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
}

function compile() {
  return gulp.src(path.join(SRC, '**', '*.js'))
      .pipe(babel())
      .pipe(gulp.dest(DIST));
}

function testUnit() {
  return gulp.src(path.join(TEST, 'units', '**', '*.js')).pipe(jasmine());
}

function testIntegration(done) {
  const configFile = path.join(TEST, 'it', 'karma.conf.js');
  startKarma(configFile, done);
}

function startKarma(configFile, done) {
  const karma = new KarmaServer({configFile}, (err) => {
    log(colors.grey('Calling done callback of Karma'));
    done(err);
  });

  log(colors.grey(`Running karma with configuration: ${configFile}`));
  karma.start();
}

const build = gulp.series(
    gulp.parallel(clean, lint),
    compile
);

const test = gulp.series(
    build,
    testUnit,
    testIntegration
);

function bumpRelease(type) {
  return gulp.src(PKG)
      .pipe(bump({type}))
      .pipe(gulp.dest(ROOT));
}

function performRelease() {
  return gulp.src([PKG, DIST])
      .pipe(git.add({args: '-f'}))
      .pipe(git.commit('release: release version'));
}

function tagRelease() {
  return gulp.src(PKG).pipe(tagVersion());
}

function prepareNextRelease() {
  return gulp.src(DIST)
      .pipe(git.rm({args: '-rf'}))
      .pipe(git.commit('release: prepare next release'));
}

module.exports.clean = clean;
module.exports.lint = lint;
module.exports.build = build;
module.exports.test = test;

['minor', 'major', 'patch'].forEach((type) => {
  function prepareRelease() {
    return bumpRelease(type);
  }

  const release = gulp.series(
      prepareRelease,
      performRelease,
      tagRelease,
      prepareNextRelease
  );

  module.exports[`release:${type}`] = gulp.series(
      test,
      release
  );
});
