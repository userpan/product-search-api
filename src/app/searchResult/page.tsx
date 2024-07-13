import SearchBox from '../components/SearchBox';

interface SearchParams {
  q?: string;
}

interface SearchHit {
  id: string;
  title: string;
  description: string;
  sku: string;
}

async function searchProducts(query: string): Promise<SearchHit[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data.results;
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const query = searchParams.q;

  if (!query) {
    return (
      <div>
        <h1>Search Products</h1>
        <SearchBox />
        <p>Please enter a search query</p>
      </div>
    );
  }

  const hits = await searchProducts(query);

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <SearchBox />
      <ul>
        {hits.map((hit: SearchHit) => (
          <li key={hit.id}>
            <h2>{hit.title}</h2>
            <p>{hit.description}</p>
            <p>SKU: {hit.sku}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}