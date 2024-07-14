# 产品搜索引擎

## 项目简介

这是一个基于 Next.js 和 Elasticsearch 的高效产品搜索引擎。它提供了强大的全文搜索功能，支持模糊匹配和相关性排序，适用于大规模产品数据库的快速检索。

## 主要特性

- 全文搜索：支持对产品标题、描述和 SKU 进行搜索
- 模糊匹配：容忍拼写错误和轻微的单词变化
- 相关性排序：结果按相关性得分排序，考虑字段权重、词频等因素
- 多字段搜索：使用 Elasticsearch 的 multi_match 查询
- 分页功能：支持大量搜索结果的高效浏览
- API 限流：基于滑动窗口的使用限制，防止 API 滥用
- 响应式设计：适配移动端和桌面端
- 实时同步：产品数据实时同步到 Elasticsearch

## 技术栈

- 前端：Next.js 14, React, TypeScript
- 后端：Next.js API 路由
- 数据库：PostgreSQL（用户数据和 API 密钥）
- 搜索引擎：Elasticsearch
- 缓存和限流：Redis
- 样式：Tailwind CSS
- 部署：Docker, 阿里云

## 快速开始

1. 克隆仓库
git clone [your-repository-url]

2. 安装依赖
npm install

3. 设置环境变量
创建 `.env.local` 文件并添加必要的环境变量（参考 `.env.example`）

4. 运行开发服务器
npm run dev

5. 访问 `http://localhost:3000` 查看应用

## API 使用

API 端点：`/api/search`

示例请求：
GET /api/search?q=您的搜索关键词&api_key=您的API密钥&page=1

注意：每个用户在任意 24 小时内限制使用 100 次搜索。超过此限制将返回 429 错误。

## 搜索功能详解

- 支持部分匹配和完整匹配
- 标题字段权重较高（^2），提高相关结果的排序
- 使用 Elasticsearch 的模糊匹配功能，提高搜索容错性
- 搜索结果考虑字段权重、词频和倒排文档频率等因素

## 部署

项目使用 Docker 进行容器化，并部署在阿里云服务器上。详细的部署步骤请参考 `DEPLOYMENT.md` 文件。

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大更改，请先开 issue 讨论您想要改变的内容。

## 许可证

[MIT License](LICENSE)