import { mkdir, readFile, rm, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const defaultConfigPath = join(rootDir, 'site.config.json');
const defaultOutDir = join(rootDir, 'dist');

function normalizeUrl(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function withDefaults(config) {
  return {
    canonicalPath: '/',
    cName: '',
    keywords: [],
    tagline: config.siteDescription,
    socialLinks: {
      github: '',
      email: ''
    },
    ...config,
    socialLinks: {
      github: '',
      email: '',
      ...(config.socialLinks ?? {})
    }
  };
}

function buildIndexHtml(config) {
  const siteName = escapeHtml(config.siteName);
  const siteDescription = escapeHtml(config.siteDescription);
  const keywords = escapeHtml(config.keywords.join(', '));
  const canonicalUrl = escapeHtml(normalizeUrl(config.siteUrl));
  const tagline = escapeHtml(config.tagline);
  const githubUrl = escapeHtml(config.socialLinks.github);
  const email = escapeHtml(config.socialLinks.email);
  const year = new Date().getUTCFullYear();
  const githubAction = config.socialLinks.github
    ? `<a href="${githubUrl}" target="_blank" rel="noreferrer">查看 GitHub</a>`
    : '';
  const emailLine = config.socialLinks.email
    ? `<p><a href="mailto:${email}">${email}</a></p>`
    : '';

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${siteName} - ${siteDescription}</title>
    <meta name="description" content="${siteDescription}">
    <meta name="keywords" content="${keywords}">
    <meta name="robots" content="index,follow">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${siteName}">
    <meta property="og:description" content="${siteDescription}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:locale" content="zh_CN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${siteName}">
    <meta name="twitter:description" content="${siteDescription}">
    <link rel="canonical" href="${canonicalUrl}">
    <link rel="stylesheet" href="./styles.css">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "${siteName}",
        "url": "${canonicalUrl}",
        "description": "${siteDescription}"
      }
    </script>
  </head>
  <body>
    <main class="page">
      <section class="hero">
        <p class="eyebrow">GitHub Pages SEO Starter</p>
        <h1>${siteName}</h1>
        <p class="lead">${tagline}</p>
        <p class="body">${siteDescription}</p>
        <div class="actions">
          <a href="${canonicalUrl}" target="_blank" rel="noreferrer">打开首页</a>
          ${githubAction}
        </div>
      </section>

      <section class="grid">
        <article class="card">
          <h2>为什么能被搜到</h2>
          <p>这个模板已经带上首页标题、描述、结构化数据、robots 和 sitemap，搜索引擎看到的是完整站点，而不是只有一个空壳页面。</p>
        </article>
        <article class="card">
          <h2>下一步怎么做</h2>
          <p>部署后，优先把同一个域名提交到百度、Bing 和 Google。这样比逐个研究浏览器入口更省力。</p>
        </article>
        <article class="card">
          <h2>你需要改什么</h2>
          <p>只需要把网站名、网站地址、仓库地址和邮箱替换成你的信息，然后把 dist 发布到 GitHub Pages。</p>
        </article>
      </section>

      <section class="about card wide">
        <h2>About ${siteName}</h2>
        <p>${siteName} 的目标是让用户通过明确的网站名、简介和固定域名更快建立搜索关联。建议你在 GitHub 仓库简介、社交主页和页脚继续复用同一个名字。</p>
      </section>
    </main>

    <footer class="footer">
      <p>${siteName}</p>
      ${emailLine}
      <p>Copyright ${year}</p>
    </footer>
  </body>
</html>
`;
}

function buildRobotsTxt(config) {
  const sitemapUrl = `${normalizeUrl(config.siteUrl)}sitemap.xml`;
  return `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;
}

function buildSitemapXml(config) {
  const loc = normalizeUrl(config.siteUrl);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

async function loadConfig(configPath = defaultConfigPath) {
  const content = await readFile(configPath, 'utf8');
  return JSON.parse(content);
}

async function cleanOutDir(outDir) {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
}

export async function buildSite(config, outDir = defaultOutDir) {
  const resolvedConfig = withDefaults(config);
  await cleanOutDir(outDir);

  await writeFile(join(outDir, 'index.html'), buildIndexHtml(resolvedConfig), 'utf8');
  await writeFile(join(outDir, '404.html'), buildIndexHtml(resolvedConfig), 'utf8');
  await writeFile(join(outDir, 'robots.txt'), buildRobotsTxt(resolvedConfig), 'utf8');
  await writeFile(join(outDir, 'sitemap.xml'), buildSitemapXml(resolvedConfig), 'utf8');
  await writeFile(join(outDir, '.nojekyll'), '', 'utf8');
  await copyFile(join(rootDir, 'styles.css'), join(outDir, 'styles.css'));

  if (resolvedConfig.cName?.trim()) {
    await writeFile(join(outDir, 'CNAME'), `${resolvedConfig.cName.trim()}\n`, 'utf8');
  }
}

async function main() {
  const config = await loadConfig();
  await buildSite(config);
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
