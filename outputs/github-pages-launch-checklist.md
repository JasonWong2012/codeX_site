# GitHub Pages 上线与收录清单

## 我已经帮你准备好的部分

- 静态首页模板
- GitHub Pages 自动部署工作流
- `robots.txt`
- `sitemap.xml`
- `CNAME` 可选支持
- 基础 SEO 标签和结构化数据

## 你现在只要做这些

1. 修改 `site.config.json`
2. 把项目推到 GitHub 仓库
3. 在仓库里启用 `Pages`，选择 `GitHub Actions`
4. 等待 Actions 发布成功
5. 如果你有独立域名，去域名服务商后台配置 DNS
6. 到百度、Bing、Google、360 提交站点并完成所有权验证

## 最关键的配置项

- `siteName`: 你希望用户搜索的名字
- `siteDescription`: 一句清晰介绍
- `siteUrl`: 正式访问地址
- `cName`: 可选，自定义域名

## 验证方式

- 打开 `/robots.txt`
- 打开 `/sitemap.xml`
- 搜索 `site:你的域名`
- 搜索你设置的网站名

## 现实预期

- 部署通常当天就能完成
- 搜索引擎收录通常需要几天到几周
- 即使技术配置都正确，也不能保证立刻排到第一
