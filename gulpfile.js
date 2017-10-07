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

'use strict';

const path = require('path');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
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

gulp.task('clean', () => {
  return del(DIST);
});

gulp.task('lint', () => {
  const src = [
    path.join(SRC, '**', '*.js'),
    path.join(TEST, '**', '*.js'),
    path.join(ROOT, '*.js'),
  ];

  return gulp.src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', ['clean', 'lint'], () => {
  return gulp.src(path.join(SRC, '**', '*.js'))
    .pipe(babel())
    .pipe(gulp.dest(DIST));
});

gulp.task('test:unit', ['build'], () => {
  return gulp.src(path.join(TEST, 'units', '**', '*.js')).pipe(jasmine());
});

gulp.task('test:it', ['test:unit'], (done) => {
  const configFile = path.join(TEST, 'it', 'karma.conf.js');
  startKarma(configFile, () => done());
});

gulp.task('test', ['test:unit', 'test:it']);

['minor', 'major', 'patch'].forEach((type) => {
  gulp.task(`release:${type}`, ['test'], () => {
    gulp.src(path.join(ROOT, 'package.json'))

      // bump the version number in those files
      .pipe(bump({type}))

      // save it back to filesystem
      .pipe(gulp.dest(ROOT))

      // commit the changed version number
      .pipe(git.commit('release: bumps package version'))

      // tag it in the repository
      .pipe(tagVersion());
  });
});

gulp.task('default', ['test']);

/**
 * Run Karma with configuration file.
 *
 * @param {string} configFile Karma configuration file.
 * @param {function} done Gulp done function.
 */
function startKarma(configFile, done) {
  const karma = new KarmaServer({configFile}, () => {
    gutil.log(gutil.colors.grey('Calling done callback of Karma'));
    done();
  });

  gutil.log(gutil.colors.grey(`Running karma with configuration: ${configFile}`));
  karma.start();
}
