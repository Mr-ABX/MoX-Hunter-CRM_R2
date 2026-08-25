import { Composio } from 'composio-core';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const moxApiKey = process.env.MO_X_API_KEY || 'mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz';
const moxUrl = 'https://mox.infni-t.online/api/mcp/leads';

async function evaluateLeads() {
  console.log('--- Evaluating Lead Generation Engines ---');

  // 1. Fetch leads from MoX Hunter MCP
  console.log('\n1. Fetching from MoX Hunter...');
  try {
    const moxResponse = await axios.post(moxUrl, {
      query: 'software agencies in San Francisco'
    }, {
      headers: {
        'mo-x-api-key': moxApiKey,
        'Content-Type': 'application/json'
      }
    });
    console.log('MoX Hunter Leads:', JSON.stringify(moxResponse.data, null, 2));
  } catch (error: any) {
    console.error('Error fetching from MoX Hunter:', error.response?.data || error.message);
  }

  // 2. Fetch leads from Composio Google Maps
  console.log('\n2. Fetching from Google Maps (via Composio)...');
  try {
    const composio = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    
    // Note: We are using a generic action search for Google Maps to demonstrate
    const entity = composio.getEntity("default");
    const mapsAction = await composio.executeAction("GOOGLEMAPS_SEARCH_PLACES", {
      query: "software agencies in San Francisco"
    }, entity.id);
    
    console.log('Google Maps Leads:', JSON.stringify(mapsAction, null, 2));
  } catch (error: any) {
    console.error('Error fetching from Google Maps:', error.message);
  }
}

evaluateLeads();
