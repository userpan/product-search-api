import { Client } from '@elastic/elasticsearch';
import { NextRequest, NextResponse } from 'next/server';

const client = new Client({
  node: process.env.ELASTICSEARCH_URL
});

interface SearchResult {
  id: string;
  title: string;
  description: string;
  sku: string;
  highlight?: {
    title?: string[];
    description?: string[];
  };
  [key: string]: any;  // for any additional fields
}

interface CategoryBucket {
  key: string;
  doc_count: number;
}

interface SearchResponse {
  results: SearchResult[];
  suggestions: string[];
  categories: { name: string; count: number }[];
  total: number;
}

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
          bool: {
            should: [
              {
                multi_match: {
                  query: query,
                  fields: ['title^3', 'description^2', 'sku'],
                  type: 'best_fields',
                  fuzziness: 'AUTO',
                  prefix_length: 1
                }
              },
              {
                match_phrase_prefix: {
                  title: {
                    query: query,
                    slop: 3,
                    max_expansions: 10
                  }
                }
              }
            ]
          }
        },
        suggest: {
          text: query,
          title_suggestion: {
            term: {
              field: 'title',
              suggest_mode: 'always'
            }
          },
          description_suggestion: {
            term: {
              field: 'description',
              suggest_mode: 'always'
            }
          }
        },
        highlight: {
          fields: {
            title: {},
            description: {}
          }
        },
        aggs: {
          categories: {
            terms: {
              field: 'category.keyword',
              size: 5
            }
          }
        },
        size: 20
      }
    });

    const hits = result.body.hits.hits.map((hit: any): SearchResult => ({
      id: hit._id,
      ...hit._source,
      highlight: {
        title: hit.highlight?.title,
        description: hit.highlight?.description
      }
    }));

    const suggestions = [
      ...(result.body.suggest.title_suggestion?.[0]?.options ?? []),
      ...(result.body.suggest.description_suggestion?.[0]?.options ?? [])
    ].map((option: any) => option.text);

    const categories = (result.body.aggregations?.categories?.buckets ?? []).map((bucket: CategoryBucket) => ({
      name: bucket.key,
      count: bucket.doc_count
    }));

    const response: SearchResponse = {
      results: hits,
      suggestions: [...new Set(suggestions)],
      categories,
      total: result.body.hits.total.value
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'An error occurred during the search' }, { status: 500 });
  }
}