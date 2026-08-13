import re
import json

with open('api/index.ts', 'r') as f:
    content = f.read()

openapi_str_match = re.search(r'res\.json\(\{\n\s*openapi: "3\.1\.0".*?\}\);\n\}\);', content, re.DOTALL)
if not openapi_str_match:
    print("Could not find OpenAPI JSON block")
    exit(1)

# we can reconstruct the openapi json in JS and inject it, or just use string replacement.
# Let's replace the whole `res.json({ ... });` block with a new string.
new_openapi_block = """res.json({
    openapi: "3.1.0",
    info: {
      title: "MoX Hunter AI Agent API",
      version: "1.0.0",
      description: "API for external AI agents to fetch leads and draft outreach."
    },
    servers: [{ url: serverUrl }],
    paths: {
      "/api/mcp/leads": {
        get: {
          operationId: "getLeads",
          summary: "Fetch a list of leads",
          parameters: [
            { name: "industry", in: "query", schema: { type: "string" }, description: "Filter by industry" },
            { name: "minScore", in: "query", schema: { type: "integer" }, description: "Filter by minimum lead score" }
          ],
          responses: {
            "200": {
              description: "List of leads",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        },
        post: {
          operationId: "addLead",
          summary: "Add a new lead to the CRM",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    industry: { type: "string" },
                    city: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    website: { type: "string" },
                    score: { type: "integer" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successfully added the lead",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/api/mcp/leads/{id}": {
        get: {
          operationId: "getLeadById",
          summary: "Fetch a single lead by ID",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "The ID of the lead" }
          ],
          responses: {
            "200": {
              description: "Single lead details",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        },
        patch: {
          operationId: "updateLead",
          summary: "Update lead properties",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "The ID of the lead" }
          ],
          responses: {
            "200": {
              description: "Lead updated successfully",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        },
        delete: {
          operationId: "deleteLead",
          summary: "Delete a lead",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "The ID of the lead" }
          ],
          responses: {
            "200": {
              description: "Lead deleted successfully",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/api/mcp/leads/{id}/activity": {
        post: {
          operationId: "addLeadActivity",
          summary: "Log an activity for a lead",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "The ID of the lead" }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    subject: { type: "string" },
                    body: { type: "string" },
                    sentAt: { type: "string" },
                    status: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Activity logged successfully",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/api/mcp/stats": {
        get: {
          operationId: "getStats",
          summary: "Get CRM pipeline stats",
          responses: {
            "200": {
              description: "Pipeline stats",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      },
      "/api/mcp/publish-prototype": {
        post: {
          operationId: "publishPrototype",
          summary: "Publish a clean HTML prototype string",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["content"],
                  properties: {
                    content: { type: "string" },
                    title: { type: "string" },
                    leadId: { type: "string" },
                    canvasMode: { type: "string", enum: ["WEB", "GRAPHIC", "SVG", "CONTENT"], default: "WEB" },
                    status: { type: "string", enum: ["draft", "published"], default: "published" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Prototype published successfully",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "mo-x-api-key"
        }
      }
    },
    security: [{ ApiKeyAuth: [] }]
  });"""

content = content.replace(openapi_str_match.group(0), new_openapi_block + "\n});")

with open('api/index.ts', 'w') as f:
    f.write(content)
