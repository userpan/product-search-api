import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">产品搜索引擎</h1>
      
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">使用说明</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>在右上角的下拉菜单中选择一个用户。</li>
          <li>在上方的搜索栏中输入您要查找的产品关键词。</li>
          <li>按回车键或点击搜索按钮来查看结果。</li>
          <li>使用分页控件浏览搜索结果。</li>
          <li>点击产品卡片查看更多详情。</li>
        </ol>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">搜索功能与相关性</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>支持对产品标题、描述和 SKU 进行全文搜索。</li>
          <li>使用 Elasticsearch 的模糊匹配功能，容忍拼写错误和轻微的单词变化。</li>
          <li>实现了多字段搜索，标题字段权重更高（^2），提高相关结果的排序。</li>
          <li>使用 Elasticsearch 的 multi_match 查询，允许在多个字段中搜索相同的关键词。</li>
          <li>对于没有直接匹配的情况，系统会尝试匹配相近的词语或短语。</li>
          <li>搜索结果按相关性得分排序，考虑了字段权重、词频和倒排文档频率等因素。</li>
          <li>支持部分匹配，即使只输入产品名称或描述的一部分也能找到相关结果。</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">API 使用</h2>
        <p className="text-gray-600 mb-2">如需直接使用 API：</p>
        <code className="bg-gray-100 p-2 rounded block mb-4">
          GET /api/search?q=您的搜索关键词&api_key=您的API密钥&page=1
        </code>
        <p className="text-gray-600">
          注意：每个用户在任意 24 小时内限制使用 100 次搜索。超过此限制将返回 429 错误。
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">使用限制</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>每个经过身份验证的用户在任意 24 小时内限制使用搜索 API 100 次。</li>
          <li>使用 Redis 实现滑动窗口计数，确保高效和准确的限流。</li>
          <li>超过限制后，API 会返回 429 状态码（Too Many Requests）。</li>
          <li>限制是基于用户 ID 和时间戳的组合来实现的，每个请求都会更新使用计数。</li>
          <li>计数器会在 24 小时后自动过期，允许用户再次使用 API。</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">架构与技术</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>前端：Next.js 14 配合 React 和 TypeScript</li>
          <li>后端：Next.js API 路由</li>
          <li>数据库：PostgreSQL 用于存储用户数据和 API 密钥</li>
          <li>搜索引擎：Elasticsearch 用于快速高效的产品搜索</li>
          <li>缓存和限流：Redis</li>
          <li>样式：Tailwind CSS 实现响应式设计</li>
          <li>部署：使用 Docker 进行容器化，部署在阿里云服务器上</li>
          <li>版本控制：Git</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">主要功能</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>对产品标题、描述和 SKU 进行全文搜索</li>
          <li>高级模糊匹配和相关性排序</li>
          <li>用户认证和 API 密钥管理</li>
          <li>搜索结果分页</li>
          <li>基于滑动窗口的 API 使用限流，防止滥用</li>
          <li>适配移动端和桌面端的响应式设计</li>
          <li>产品数据实时同步到 Elasticsearch</li>
          <li>部署在阿里云上，确保高可用性和可扩展性</li>
        </ul>
      </div>
    </div>
  );
}