// src/app/api/users/[id]/api-key/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const GET = async(request: NextRequest, { params }: { params: { id: string } }) => {
  const userId = params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT api_key FROM Users WHERE id = $1', [userId]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    return NextResponse.json({ api_key: result.rows[0].api_key });
  } catch (error) {
    console.error('获取API密钥时出错:', error);
    return NextResponse.json({ error: '获取API密钥时发生错误' }, { status: 500 });
  }
}