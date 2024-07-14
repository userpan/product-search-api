// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const GET = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, username FROM Users WHERE is_active = TRUE');
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('获取用户时出错:', error);
    return NextResponse.json({ error: '获取用户时发生错误' }, { status: 500 });
  }
}