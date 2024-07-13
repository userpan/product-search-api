import { Client } from '@elastic/elasticsearch';
import { NextRequest, NextResponse } from 'next/server';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const result = await client.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title', 'description', 'sku'],
            fuzziness: 'AUTO'
          }
        }
      }
    });

    const hits = result.body.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source
    }));

    return NextResponse.json({ results: hits });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'An error occurred during the search' }, { status: 500 });
  }
}