import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { buildSite } from '../scripts/build.mjs';

test('buildSite generates deployable SEO assets from config', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'seo-site-'));

  try {
    await buildSite({
      siteName: '星屿相册',
      siteDescription: '一个可被搜索引擎收录的静态站模板',
      siteUrl: 'https://starsea.example.com',
      canonicalPath: '/',
      repoName: 'starsea-site',
      ownerName: 'hhx',
      cName: 'starsea.example.com',
      keywords: ['星屿相册', '静态网站', 'GitHub Pages'],
      socialLinks: {
        github: 'https://github.com/hhx/starsea-site',
        email: 'hello@starsea.example.com'
      }
    }, outDir);

    const indexHtml = await readFile(join(outDir, 'index.html'), 'utf8');
    const robots = await readFile(join(outDir, 'robots.txt'), 'utf8');
    const sitemap = await readFile(join(outDir, 'sitemap.xml'), 'utf8');
    const cname = await readFile(join(outDir, 'CNAME'), 'utf8');

    assert.match(indexHtml, /<title>星屿相册 - 一个可被搜索引擎收录的静态站模板<\/title>/);
    assert.match(indexHtml, /<h1>星屿相册<\/h1>/);
    assert.match(indexHtml, /content="星屿相册, 静态网站, GitHub Pages"/);
    assert.match(indexHtml, /https:\/\/starsea\.example\.com\//);

    assert.match(robots, /Sitemap: https:\/\/starsea\.example\.com\/sitemap\.xml/);
    assert.match(robots, /Allow: \//);

    assert.match(sitemap, /<loc>https:\/\/starsea\.example\.com\/<\/loc>/);
    assert.equal(cname.trim(), 'starsea.example.com');
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});

test('buildSite omits empty optional contact links', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'seo-site-'));

  try {
    await buildSite({
      siteName: 'transfer_site',
      siteDescription: 'GitHub Pages project site',
      siteUrl: 'https://jasonwong2012.github.io/transfer_site',
      repoName: 'transfer_site',
      ownerName: 'JasonWong2012',
      keywords: ['transfer_site'],
      socialLinks: {
        github: 'https://github.com/JasonWong2012/transfer_site',
        email: ''
      }
    }, outDir);

    const indexHtml = await readFile(join(outDir, 'index.html'), 'utf8');

    assert.doesNotMatch(indexHtml, /mailto:/);
    assert.match(indexHtml, /https:\/\/github\.com\/JasonWong2012\/transfer_site/);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});
