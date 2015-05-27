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

var gulp = require('gulp');
var bump = require('gulp-bump');
var tag_version = require('gulp-tag-version');
var git = require('gulp-git');
var jasmine = require('gulp-jasmine');

gulp.task('test', function () {
    return gulp.src('test/*.js')
        .pipe(jasmine());
});

['minor', 'major', 'patch'].forEach(function(level) {
  gulp.task('release:' + level, ['test'], function() {
    gulp.src(['./package.json'])

      // bump the version number in those files 
      .pipe(bump({type: level}))

      // save it back to filesystem 
      .pipe(gulp.dest('./'))

      // commit the changed version number 
      .pipe(git.commit('release: bumps package version'))
 
      // tag it in the repository
      .pipe(tag_version());
  });
});

gulp.task('default', ['test']);
