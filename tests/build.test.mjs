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

test('buildSite renders custom hero and about copy for Chinese SEO branding', async () => {
  const outDir = await mkdtemp(join(tmpdir(), 'seo-site-'));

  try {
    await buildSite({
      siteName: '码上go',
      siteDescription: '码上go专注 Codex、Claude Code、Gemini、Open Code 等海外 AI 模型与 AI 工具的中转和快速接入，覆盖 API Key、密钥配置、登录验证等常见场景，帮助用户降低国外手机号门槛，更快开始使用。',
      siteUrl: 'https://jasonwong2012.github.io/transfer_site',
      repoName: 'transfer_site',
      ownerName: 'JasonWong2012',
      keywords: ['码上go', 'Codex', 'Claude Code', 'Gemini', 'Open Code', 'API Key', '密钥', '登录验证', '中转', 'AI工具'],
      tagline: 'Codex、Claude Code、Gemini 等海外 AI 模型中转与快速接入',
      heroBody: '围绕 API Key、密钥配置、登录验证和 AI 工具使用场景，帮助用户更顺畅接入 Codex、Claude Code、Gemini、Open Code 等海外模型与服务，更快开始使用。',
      aboutTitle: '关于码上go',
      aboutBody: '码上go专注于 Codex、Claude Code、Gemini、Open Code 等海外 AI 模型和 AI 工具的中转与接入体验优化，覆盖 API Key、密钥、登录验证等常见需求。我们希望把原本分散、繁琐的接入流程整理得更清晰，让用户更快开始使用各类国外模型与 AI 服务。',
      socialLinks: {
        github: 'https://github.com/JasonWong2012/transfer_site',
        email: ''
      }
    }, outDir);

    const indexHtml = await readFile(join(outDir, 'index.html'), 'utf8');

    assert.match(indexHtml, /<title>码上go - 码上go专注 Codex、Claude Code、Gemini、Open Code 等海外 AI 模型与 AI 工具的中转和快速接入/);
    assert.match(indexHtml, /<h1>码上go<\/h1>/);
    assert.match(indexHtml, /Codex、Claude Code、Gemini 等海外 AI 模型中转与快速接入/);
    assert.match(indexHtml, /帮助用户更顺畅接入 Codex、Claude Code、Gemini、Open Code 等海外模型与服务/);
    assert.match(indexHtml, /关于码上go/);
    assert.match(indexHtml, /各类国外模型与 AI 服务/);
    assert.match(indexHtml, /content="码上go, Codex, Claude Code, Gemini, Open Code, API Key, 密钥, 登录验证, 中转, AI工具"/);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});
