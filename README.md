# GitHub Pages 搜索收录模板

这是一套可直接部署到 `GitHub Pages` 的静态站起步模板，已经包含：

- 首页基础 SEO
- `robots.txt`
- `sitemap.xml`
- `CNAME` 可选支持
- GitHub Pages 自动部署工作流

## 1. 本地准备

先改 [site.config.json](/Users/hhx/Documents/Codex/2026-08-30/new-chat/site.config.json)：

- `siteName`: 你想让别人搜索的网站名
- `siteDescription`: 一句清楚的站点介绍
- `siteUrl`: 部署后的正式地址
- `cName`: 如果你买了独立域名就填，比如 `www.example.com`
- `socialLinks.github`: 你的仓库地址
- `socialLinks.email`: 联系邮箱

## 2. 构建

```bash
npm test
npm run build
```

构建产物会在 `dist/`。

## 3. 部署到 GitHub Pages

1. 把整个目录推到 GitHub 仓库。
2. 在 GitHub 仓库里启用 `Pages`。
3. 选择 `GitHub Actions` 作为构建来源。
4. 推送到 `main` 分支后，工作流会自动发布 `dist/`。

## 4. 提交搜索引擎

部署成功后，优先提交：

1. 百度搜索资源平台
2. Bing Webmaster Tools
3. Google Search Console
4. 360 站长平台

需要你亲自完成的只有：

- 登录平台账号
- 验证站点所有权
- 如果用了独立域名，去域名后台加 DNS 记录

## 5. 验证

- 检查首页源码里是否有正确的 `title`、`description` 和 `canonical`
- 打开 `https://你的域名/robots.txt`
- 打开 `https://你的域名/sitemap.xml`
- 用 `site:你的域名` 查询收录状态
