// scripts/createESIndex.js
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: process.env.ELASTICSEARCH_URL });

async function createIndex() {
  const index = 'products';
  
  try {
    const { body } = await client.indices.exists({ index });
    
    if (body) {
      console.log(`Index ${index} already exists`);
      return;
    }

    await client.indices.create({
      index: index,
      body: {
        mappings: {
          properties: {
            sku: { type: 'keyword' },
            title: { type: 'text' },
            description: { type: 'text' },
            created_at: { type: 'date' },
            updated_at: { type: 'date' }
          }
        }
      }
    });

    console.log(`Index ${index} created`);
  } catch (error) {
    console.error('Error creating index:', error);
  } finally {
    await client.close();
  }
}

createIndex();