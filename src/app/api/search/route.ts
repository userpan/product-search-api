// src/app/api/search/route.ts
import { Client } from '@elastic/elasticsearch';
import { NextRequest, NextResponse } from 'next/server';
import redis from '../../../lib/redis';
import { Pool } from 'pg';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL
});

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const ITEMS_PER_PAGE = 12; // 每页显示的项目数

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const apiKey = searchParams.get('api_key');
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!query) {
    return NextResponse.json({ error: '查询参数是必需的' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'API密钥是必需的' }, { status: 400 });
  }

  try {
    // 验证API密钥
    const pgClient = await pool.connect();
    const userResult = await pgClient.query('SELECT id FROM Users WHERE api_key = $1 AND is_active = TRUE', [apiKey]);
    pgClient.release();

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: '无效的API密钥' }, { status: 401 });
    }

    const userId = userResult.rows[0].id;

    // 检查使用限制
    const today = new Date().toISOString().split('T')[0];
    const usageKey = `usage:${userId}:${today}`;
    const usageCount = await redis.incr(usageKey);

    if (usageCount > 100) {
      console.log('已超过每日使用限制，现在使用次数是：', usageCount)
      return NextResponse.json({ error: '已超过每日使用限制' }, { status: 429 });
    }

    // 设置使用键的过期时间（24小时）
    await redis.expire(usageKey, 86400);

    // 执行搜索
    const result = await client.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title^2', 'description', 'sku']
          }
        },
        from: (page - 1) * ITEMS_PER_PAGE,
        size: ITEMS_PER_PAGE
      }
    });

    const hits = result.body.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source
    }));

    const totalHits = result.body.hits.total.value;
    const totalPages = Math.ceil(totalHits / ITEMS_PER_PAGE);

    return NextResponse.json({
      results: hits,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalHits: totalHits
      }
    });
  } catch (error) {
    console.error('搜索错误:', error);
    return NextResponse.json({ error: '搜索过程中发生错误' }, { status: 500 });
  }
}