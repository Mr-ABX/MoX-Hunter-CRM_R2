import re
import json

with open('server.ts', 'r') as f:
    content = f.read()

openapi_str_match = re.search(r'res\.json\(\{\n\s*openapi: "3\.1\.0"(.*?)\n\s*\}\);\n\s*\}\);', content, re.DOTALL)
if not openapi_str_match:
    print("Could not find OpenAPI block")
    exit(1)

openapi_json_str = '{\n      openapi: "3.1.0"' + openapi_str_match.group(1) + '\n    }'

# To avoid complex JSON parsing in python for a JS object, let's just use string replacement.
new_paths = """
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
"""

# Let's insert the new paths into the `paths` object.
paths_match = re.search(r'paths: \{', content)
if paths_match:
    content = content.replace('paths: {', 'paths: {' + new_paths)

# Now update publish-prototype in openapi
# We need to replace the old publish-prototype in openapi.
old_publish_openapi = """"/api/mcp/publish-prototype": {
          post: {
            operationId: "publishPrototype",
            summary: "Publish a clean HTML prototype string",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["htmlContent"],
                    properties: {
                      htmlContent: { type: "string" },
                      title: { type: "string" },
                      leadId: { type: "string" }
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
        },"""

new_publish_openapi = """"/api/mcp/publish-prototype": {
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
        },"""

content = content.replace(old_publish_openapi, new_publish_openapi)

# Finally add delete lead to leads/{id}
old_lead_id_openapi = """"/api/mcp/leads/{id}": {
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
          }
        },"""

new_lead_id_openapi = """"/api/mcp/leads/{id}": {
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
        },"""

content = content.replace(old_lead_id_openapi, new_lead_id_openapi)

with open('server.ts', 'w') as f:
    f.write(content)
