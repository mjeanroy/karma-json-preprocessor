# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Karma preprocessor plugin (`preprocessor:json`) that turns `*.json` files into JS that registers their parsed content on a global (`window.__json__` by default), so tests can use JSON fixtures. The whole plugin is a single file: `src/karma-json-preprocessor.js`.

## Commands

Package manager is pnpm (version pinned in CI). Every npm script delegates to a gulp task defined in `gulpfile.js`, which wires up the task modules in `scripts/<task>/index.js`.

- `pnpm install`
- `pnpm run lint`: ESLint (airbnb-base) on root `*.js`, `src`, `test` and `scripts`. Warnings also fail the task.
- `pnpm run build`: clean, then lint, then Babel `src/` into `dist/`
- `pnpm test`: clean, lint, build, then unit tests (gulp-jasmine on `test/units/**`), then integration tests (Karma + headless Chrome, `test/it/karma.conf.js`)

Running one suite without the full gulp chain:

- Unit: `npx jasmine test/units/karma-json-preprocessor-spec.js`
- Integration: `npx karma start test/it/karma.conf.js`. Chrome comes from `CHROME_BIN` if it is set, and from puppeteer's download otherwise.

`pnpm run release[:patch|:minor|:major]` runs the full test chain, force-adds `dist/` (normally gitignored), runs `npm version`, then `git rm`s `dist/` in a follow-up "prepare next release" commit. Only run it when explicitly asked.

## Architecture notes

- The module exports `{ 'preprocessor:json': ['factory', createJsonPreprocessor] }`. Karma injects `logger`, `config.basePath` and `config.jsonPreprocessor` through `$inject`.
- Supported `jsonPreprocessor` options: `varName` (default `__json__`) and `stripPrefix` (a regex string removed from the start of the key).
- The registry key is `file.originalPath` with `basePath + '/'` and then `stripPrefix` removed. The preprocessor appends `.js` to `file.path`.
- The generated code also defines `window.<varName>.$get(path)`, which returns a deep clone (`JSON.parse(JSON.stringify(...))`).
- Invalid JSON is not fatal: the plugin logs an error and emits an empty string.
- `main` in `package.json` points to `dist/karma-json-preprocessor.js`. Tests (unit and integration) require `src/` directly.

## Conventions

- Every source, script, config and workflow file starts with the MIT license header. Keep it on new files.
- `pnpm-workspace.yaml` sets `lockfile: false`, exact versions (`saveExact`), and a 2-day `minimumReleaseAge` for new dependency versions.
- CI (`.github/workflows/build.yml`) runs on Windows, Linux and macOS with Node 22–26 (puppeteer 25 requires Node >= 22.12). The tests use the Chrome downloaded by puppeteer at install time.
