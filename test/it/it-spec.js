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

describe('JsonPreprocessor', () => {
  it('should load JSON files', () => {
    // eslint-disable-next-line no-undef
    expect(__json__).toBeDefined();

    // eslint-disable-next-line no-undef
    expect(__json__.$get('data.json')).toEqual({
      id: 1,
      name: 'John Doe',
    });
  });

  it('should return different objects with $get', () => {
    // eslint-disable-next-line no-undef
    const o1 = __json__.$get('data.json');

    // eslint-disable-next-line no-undef
    const o2 = __json__.$get('data.json');
    expect(o1).not.toBe(o2);
    expect(o1).toEqual(o2);
  });
});
