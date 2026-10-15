import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Validate both the authoring template and the production HTML after Vite transforms it.
for (const filename of ['index.html', 'dist/index.html']) {
  test(filename + ' exposes crawlable REX Guard content', () => {
    const html = readFileSync(new URL('../' + filename, import.meta.url), 'utf8');
    const root = html.match(/<div\s+id=["']root["']\s*>([\s\S]*?)<\/div>/i);
    assert.ok(root, 'React mount #root must be present');
    const fallback = root[1];

    assert.match(fallback, /<main\b[^>]*>/i);
    assert.match(fallback, /<h1\b[^>]*>AI can propose\. Authority must be verified\.<\/h1>/i);
    assert.match(fallback, /REX Guard is Auditable Trust Infrastructure for consequential AI actions\./i);
    assert.match(fallback, /Deterministic, fail-closed policy enforcement\./i);
    assert.match(fallback, /href=["']mailto:commercial@foundlab\.com\.br["']/i);
    assert.doesNotMatch(fallback, /<script\b/i, 'content must be accessible without JavaScript');

    assert.match(html, /<html\s+lang=["']en["']/i);
    assert.match(html, /<meta\s+name=["']description["']/i);
    assert.match(html, /<link\s+rel=["']canonical["']\s+href=["']https:\/\/www\.foundlab\.com\.br\/["']/i);
  });
}
