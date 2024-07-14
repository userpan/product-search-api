// scripts/syncToES.js
require('dotenv').config();
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local', override: true });
}

const { Client } = require('pg');
const { Client: ESClient } = require('@elastic/elasticsearch');

const pgClient = new Client({
  connectionString: process.env.POSTGRES_URL
});

const esClient = new ESClient({
  node: process.env.ELASTICSEARCH_URL,
  maxRetries: 5,
  requestTimeout: 60000,
  connectionTimeout: 120000,
  sniffOnStart: false,
  sniffInterval: false
});

const createIndexIfNotExists = async () => {
  try {
    const indexExists = await esClient.indices.exists({ index: 'products' });
    if (!indexExists.body) {
      await esClient.indices.create({ index: 'products' });
      console.log('Created "products" index');
    } else {
      console.log('"products" index already exists');
    }
  } catch (error) {
    console.error('Error checking/creating index:', error);
    throw error;
  }
}

const syncData = async () => {
  try {
    console.log('Pinging Elasticsearch...');
    const pingResult = await esClient.ping();
    console.log('Elasticsearch ping successful:', pingResult);
    
    console.log('Connecting to PostgreSQL...');
    await pgClient.connect();
    console.log('Connected to PostgreSQL');

    console.log('Checking Elasticsearch index...');
    await createIndexIfNotExists();

    console.log('Fetching data from PostgreSQL...');
    const res = await pgClient.query('SELECT id, sku, title, description, created_at, updated_at FROM products');
    console.log(`Fetched ${res.rows.length} products from PostgreSQL`);

    const batchSize = 1000;
    for (let i = 0; i < res.rows.length; i += batchSize) {
      const batch = res.rows.slice(i, i + batchSize);
      const body = batch.flatMap(doc => [
        { index: { _index: 'products', _id: doc.id } },
        {
          sku: doc.sku || '',
          title: doc.title || '',
          description: doc.description || '',
          created_at: doc.created_at,
          updated_at: doc.updated_at
        }
      ]);

      try {
        console.log(`Indexing batch ${Math.floor(i / batchSize) + 1}...`);
        const bulkResponse = await esClient.bulk({ body: body, refresh: true });
        
        if (bulkResponse.body.errors) {
          console.log('Bulk operation had errors');
          const erroredDocuments = bulkResponse.body.items.filter(item => item.index && item.index.error);
          console.log(erroredDocuments);
        } else {
          console.log(`Successfully indexed ${batch.length} items in Elasticsearch`);
        }
      } catch (bulkError) {
        console.error('Error in bulk operation:', bulkError);
      }

      // Add a small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('All data synced successfully');
  } catch (error) {
    console.error('Error syncing data:', error);
  } finally {
    console.log('Closing PostgreSQL connection...');
    await pgClient.end();
    console.log('Closing Elasticsearch connection...');
    await esClient.close();
  }
}

syncData().catch(console.error);