require('dotenv').config({ path: '.env' });
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ 
  node: process.env.ELASTICSEARCH_URL,
  ssl: {
    rejectUnauthorized: false // 注意：这只是为了测试，生产环境应该使用proper SSL证书
  }
});

console.log('Elasticsearch URL:', process.env.ELASTICSEARCH_URL);

const createIndex = async () => {
  const index = 'products';
  
  try {
    console.log('Checking if index exists...');
    const { body: exists } = await client.indices.exists({ index });
    
    if (exists) {
      console.log(`Index ${index} already exists`);
      return;
    }

    console.log(`Creating index ${index}...`);
    const { body } = await client.indices.create({
      index: index,
      body: {
        mappings: {
          properties: {
            sku: { type: 'keyword' },
            title: { 
              type: 'text',
              fields: {
                keyword: { type: 'keyword' }
              }
            },
            description: { type: 'text' },
            created_at: { type: 'date' },
            updated_at: { type: 'date' }
          }
        }
      }
    });

    console.log(`Index ${index} created:`, body);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createIndex();