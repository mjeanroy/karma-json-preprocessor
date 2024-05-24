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

const jsonPreprocessor = require('../../src/karma-json-preprocessor');

describe('json-preprocessor', () => {
  let mod;
  let newFile;

  beforeEach(() => {
    mod = jsonPreprocessor['preprocessor:json'];

    newFile = (path) => ({
      path,
      originalPath: path,
      contentPath: path,
      isUrl: false,
    });
  });

  it('should export module', () => {
    expect(mod).toBeDefined();
    expect(mod).toEqual(['factory', jasmine.any(Function)]);
    expect(mod[1].$inject).toEqual([
      'logger',
      'config.basePath',
      'config.jsonPreprocessor',
    ]);
  });

  describe('once initialized', () => {
    let file;
    let obj;
    let log;
    let logger;
    let basePath;
    let process;

    beforeEach(() => {
      log = jasmine.createSpyObj('log', [
        'debug',
        'error',
      ]);

      logger = jasmine.createSpyObj('logger', [
        'create',
      ]);

      logger.create.and.returnValue(log);

      basePath = '/base';
      process = mod[1](logger, basePath);
    });

    it('should process file and strip prefix', (done) => {
      process = mod[1](logger, basePath, {
        stripPrefix: 'path',
      });

      file = newFile('/base/path/file.json');
      obj = { id: 1 };

      process(JSON.stringify(obj), file, (processedContent) => {
        const window = {};

        expect(window.__json__).not.toBeDefined();

        // eslint-disable-next-line no-eval
        eval(processedContent);

        expect(window.__json__).toEqual({
          '/file.json': jasmine.anything(),
          '$get': jasmine.any(Function),
        });

        done();
      });
    });

    it('should process file', (done) => {
      file = newFile('/base/path/file.json');
      obj = { id: 1 };

      process(JSON.stringify(obj), file, () => {
        expect(file.path).toBe('/base/path/file.json.js');
        done();
      });
    });

    it('should log processing', (done) => {
      file = newFile('/base/path/file.json');
      obj = { id: 1 };

      process(JSON.stringify(obj), file, () => {
        expect(logger.create).toHaveBeenCalled();
        expect(log.debug).toHaveBeenCalledWith('Processing "%s".', '/base/path/file.json');
        done();
      });
    });

    it('should log error if json is not valid', (done) => {
      file = newFile('/base/path/file.json');
      obj = { id: 1 };

      process('foo', file, (processedContent) => {
        expect(processedContent).toBe('');
        expect(logger.create).toHaveBeenCalled();
        expect(log.error).toHaveBeenCalledWith('Json representation of %s is not valid !', '/base/path/file.json');
        done();
      });
    });

    it('should create getter function', (done) => {
      process = mod[1](logger, basePath);

      file = newFile('/base/path/file.json');
      obj = { id: 1 };

      process(JSON.stringify(obj), file, (processedContent) => {
        // Create local window variable and trigger eval
        const window = {};

        // eslint-disable-next-line no-eval
        eval(processedContent);

        window.__json__.foo = obj;

        const clone = window.__json__.$get('foo');
        expect(clone).not.toBe(obj);
        expect(clone).toEqual(obj);

        done();
      });
    });

    it('should not fail if json is not valid', (done) => {
      process = mod[1](logger, basePath);

      file = newFile('/base/path/file.json');
      obj = { id: 1 };

      process('{"id": 1}', file, (processedContent) => {
        // Create local window variable and trigger eval
        const window = {};

        // eslint-disable-next-line no-eval
        eval(processedContent);

        window.__json__.foo = null;

        const clone = window.__json__.$get('foo');
        expect(clone).toBe(null);
        done();
      });
    });
  });
});
