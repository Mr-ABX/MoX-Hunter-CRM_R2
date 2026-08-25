import { Composio } from 'composio-core';
import dotenv from 'dotenv';
dotenv.config();

async function setupNotion() {
  console.log('--- Setting up Notion CRM ---');
  
  try {
    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    const entity = composio.getEntity("default");

    console.log('Creating Notion Database...');
    // Replace with a valid Notion Page ID where the database should be created
    const parentPageId = process.env.NOTION_PARENT_PAGE_ID || 'insert-your-page-id-here';
    
    if (parentPageId === 'insert-your-page-id-here') {
      console.warn('⚠️ Please add NOTION_PARENT_PAGE_ID to your .env file to create the database.');
      return;
    }

    const result = await composio.executeAction("NOTION_CREATE_DATABASE", {
      parent_page_id: parentPageId,
      title: "MoX Hunter Leads",
      properties: {
        "Name": { "title": {} },
        "Industry": { "rich_text": {} },
        "City": { "rich_text": {} },
        "Email": { "email": {} },
        "Status": {
          "select": {
            "options": [
              { "name": "New", "color": "blue" },
              { "name": "Contacted", "color": "yellow" },
              { "name": "Replied", "color": "green" }
            ]
          }
        },
        "Preview Link": { "url": {} }
      }
    }, entity.id);
    
    console.log('Successfully created Notion Database!');
    console.log('Database Info:', JSON.stringify(result, null, 2));
    console.log('\n✅ Please save the Database ID to your .env file as NOTION_DATABASE_ID for the main loop.');
  } catch (error: any) {
    console.error('Error setting up Notion:', error.message);
  }
}

setupNotion();
