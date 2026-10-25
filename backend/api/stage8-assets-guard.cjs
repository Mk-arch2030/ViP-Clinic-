'use strict';

// Stage 8 acceptance-only asset integrity guard.
// No Stage 6 assets, migrations, listeners or database writes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { MANIFEST } = require('./stage8-acceptance-manifest.cjs');

const ENTRY = 'stage8-acceptance.html';
const digest = bytes =>
  createHash('sha256').update(bytes).digest('hex');

function verifyStage8Assets(directory) {
  assert.equal(typeof directory, 'string');
  assert.ok(path.isAbsolute(directory));
  assert.ok(fs.lstatSync(directory).isDirectory());
  assert.ok(!fs.lstatSync(directory).isSymbolicLink());
  assert.equal(fs.realpathSync(directory), directory);

  const entries = Object.entries(MANIFEST);
  assert.equal(entries.length, 4);
  assert.ok(Object.hasOwn(MANIFEST, ENTRY));

  const assetsDir = path.join(directory, 'assets');
  assert.ok(fs.lstatSync(assetsDir).isDirectory());
  assert.ok(!fs.lstatSync(assetsDir).isSymbolicLink());

  const routes = new Map();
  let total = 0;

  for (const [name, expectedHash] of entries) {
    assert.ok(
      name === ENTRY ||
      /^assets\/[A-Za-z0-9_-][A-Za-z0-9._-]*\.(js|css)$/.test(name)
    );
    assert.match(expectedHash, /^[a-f0-9]{64}$/);

    const filename = path.join(directory, name);
    const stat = fs.lstatSync(filename);

    assert.ok(stat.isFile());
    assert.ok(!stat.isSymbolicLink());
    assert.equal(fs.realpathSync(filename), filename);

    const bytes = fs.readFileSync(filename);
    total += bytes.length;

    assert.ok(total <= 16 * 1024 * 1024);
    assert.equal(digest(bytes), expectedHash);

    const type = name.endsWith('.html')
      ? 'text/html; charset=utf-8'
      : name.endsWith('.css')
        ? 'text/css; charset=utf-8'
        : 'text/javascript; charset=utf-8';

    routes.set(
      name === ENTRY ? '/' : '/' + name,
      Object.freeze({ bytes, type })
    );
  }

  const html = routes.get('/').bytes.toString('utf8');

  assert.match(html, /<div id="root"><\/div>/);
  assert.match(
    html,
    /src="\/assets\/stage8-acceptance-[A-Za-z0-9_-]+\.js"/
  );
  assert.match(
    html,
    /href="\/assets\/stage8-acceptance-[A-Za-z0-9_-]+\.css"/
  );

  assert.ok(
    [...routes.keys()].some(route => route.endsWith('.js'))
  );
  assert.ok(
    [...routes.keys()].some(route => route.endsWith('.css'))
  );

  return routes;
}

module.exports = { verifyStage8Assets };
