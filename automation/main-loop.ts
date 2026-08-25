import { Composio } from 'composio-core';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const moxApiKey = process.env.MO_X_API_KEY || 'mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz';
// Adjust the URLs based on the actual deployed AI Studio applet URLs.
// Since the frontend is on Vercel, the backend should be reachable at the original AI Studio URL
// or another deployed backend endpoint you created.
const mcpBaseUrl = process.env.MCP_BASE_URL || 'https://mox.infni-t.online';

async function mainLoop() {
  console.log('--- Starting MoX Hunter Automation Loop ---');
  
  const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
  const entity = composio.getEntity("default");

  // Note: We use a placeholder query and lead details here for demonstration.
  // In a real scenario, this would loop through an array of leads.
  const leadInfo = {
    name: "Acme Web Design",
    industry: "Web Development",
    city: "San Francisco",
    email: "contact@acmeweb.test"
  };

  console.log(`\nProcessing Lead: ${leadInfo.name}`);

  try {
    // 1. Log to CRM
    console.log('\n1. Logging lead to Notion...');
    const notionDbId = process.env.NOTION_DATABASE_ID;
    let pageId = null;
    if (notionDbId) {
      const notionResponse = await composio.executeAction("NOTION_CREATE_DATABASE_ITEM", {
        database_id: notionDbId,
        properties: {
          "Name": { "title": [{ "text": { "content": leadInfo.name } }] },
          "Industry": { "rich_text": [{ "text": { "content": leadInfo.industry } }] },
          "City": { "rich_text": [{ "text": { "content": leadInfo.city } }] },
          "Email": { "email": leadInfo.email },
          "Status": { "select": { "name": "New" } }
        }
      }, entity.id);
      pageId = notionResponse.id;
      console.log('Logged to Notion successfully.');
    } else {
      console.log('Skipping Notion logging (NOTION_DATABASE_ID not set).');
    }

    // 2. Generate Pitch / Preview
    console.log('\n2. Generating preview using MoX Hunter API...');
    let previewLink = "https://mox.infni-t.online/";
    try {
      const previewResponse = await axios.post(`${mcpBaseUrl}/api/mcp/generate-preview`, {
        businessName: leadInfo.name,
        industry: leadInfo.industry,
        requirements: "Needs a modern dark mode web app design."
      }, {
        headers: { 'mo-x-api-key': moxApiKey }
      });
      if (previewResponse.data && previewResponse.data.previewUrl) {
        previewLink = previewResponse.data.previewUrl;
      }
      console.log('Generated Preview Link:', previewLink);
    } catch (e: any) {
      console.log('Preview generation failed (endpoint might not be ready yet). Using default link.');
    }

    // 3. Draft Email
    console.log('\n3. Drafting email using MoX Hunter API...');
    let emailBody = `Hi team at ${leadInfo.name},\n\nI loved your work in ${leadInfo.industry}. We built a custom prototype for you here: ${previewLink}\n\nLet me know what you think!\n\nBest,\nMoX Hunter`;
    try {
      const emailResponse = await axios.post(`${mcpBaseUrl}/api/mcp/outreach`, {
        leadContext: leadInfo,
        previewLink: previewLink
      }, {
        headers: { 'mo-x-api-key': moxApiKey }
      });
      if (emailResponse.data && emailResponse.data.emailDraft) {
        emailBody = emailResponse.data.emailDraft;
      }
      console.log('Generated Email Draft:\n', emailBody);
    } catch (e: any) {
      console.log('Email drafting failed (endpoint might not be ready yet). Using default draft.');
    }

    // 4. Send Email via Gmail (Composio)
    console.log('\n4. Sending email via Gmail...');
    const sendTo = process.env.TEST_EMAIL_ADDRESS || leadInfo.email;
    const gmailResponse = await composio.executeAction("GMAIL_SEND_EMAIL", {
      to: sendTo,
      subject: `A prototype for ${leadInfo.name}`,
      body: emailBody
    }, entity.id);
    console.log(`Email sent to ${sendTo}.`);

    // 5. Update CRM Status
    if (pageId && notionDbId) {
      console.log('\n5. Updating Notion Status...');
      await composio.executeAction("NOTION_UPDATE_DATABASE_ITEM", {
        page_id: pageId,
        properties: {
          "Status": { "select": { "name": "Contacted" } },
          "Preview Link": { "url": previewLink }
        }
      }, entity.id);
      console.log('Status updated in Notion.');
    }

    console.log('\n✅ Pipeline execution completed for this lead.');
  } catch (error: any) {
    console.error('\n❌ Error in main loop:', error.message);
  }
}

mainLoop();
