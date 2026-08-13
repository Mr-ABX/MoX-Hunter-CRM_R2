import json

openapi_spec = {
    "openapi": "3.1.0",
    "info": {
        "title": "MoX Hunter AI Agent API",
        "version": "1.0.0",
        "description": "API for external AI agents to fetch leads, generate prototypes, and manage CRM outreach."
    },
    "servers": [{ "url": "https://mox.infni-t.online" }],
    "paths": {
        "/api/mcp/leads": {
            "get": {
                "operationId": "getLeads",
                "summary": "Fetch a list of leads",
                "parameters": [
                    { "name": "industry", "in": "query", "schema": { "type": "string" }, "description": "Filter by industry" },
                    { "name": "minScore", "in": "query", "schema": { "type": "integer" }, "description": "Filter by minimum lead score" }
                ],
                "responses": {
                    "200": { "description": "List of leads", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            },
            "post": {
                "operationId": "addLead",
                "summary": "Add a new lead to the CRM",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "name": { "type": "string" },
                                    "company": { "type": "string" },
                                    "industry": { "type": "string" },
                                    "city": { "type": "string" },
                                    "email": { "type": "string" },
                                    "phone": { "type": "string" },
                                    "website": { "type": "string" },
                                    "score": { "type": "integer" },
                                    "userId": { "type": "string", "description": "Optional user ID associated with this lead" }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": { "description": "Successfully added the lead", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            }
        },
        "/api/mcp/leads/{id}": {
            "get": {
                "operationId": "getLeadById",
                "summary": "Fetch a single lead by ID",
                "parameters": [
                    { "name": "id", "in": "path", "required": True, "schema": { "type": "string" }, "description": "The ID of the lead" }
                ],
                "responses": {
                    "200": { "description": "Single lead details", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            },
            "patch": {
                "operationId": "updateLead",
                "summary": "Update lead properties",
                "parameters": [
                    { "name": "id", "in": "path", "required": True, "schema": { "type": "string" }, "description": "The ID of the lead" }
                ],
                "responses": {
                    "200": { "description": "Lead updated successfully", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            },
            "delete": {
                "operationId": "deleteLead",
                "summary": "Delete a lead from the CRM",
                "parameters": [
                    { "name": "id", "in": "path", "required": True, "schema": { "type": "string" }, "description": "The ID of the lead" }
                ],
                "responses": {
                    "200": { "description": "Lead deleted successfully", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            }
        },
        "/api/mcp/leads/{id}/activity": {
            "post": {
                "operationId": "addLeadActivity",
                "summary": "Log an activity for a lead and update status to Outreach Sent",
                "parameters": [
                    { "name": "id", "in": "path", "required": True, "schema": { "type": "string" }, "description": "The ID of the lead" }
                ],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "type": { "type": "string", "default": "email_sent" },
                                    "subject": { "type": "string" },
                                    "body": { "type": "string" },
                                    "sentAt": { "type": "string" },
                                    "status": { "type": "string" }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": { "description": "Activity logged successfully", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            }
        },
        "/api/mcp/stats": {
            "get": {
                "operationId": "getStats",
                "summary": "Get pipeline statistics",
                "responses": {
                    "200": { "description": "Pipeline statistics", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            }
        },
        "/api/mcp/publish-prototype": {
            "post": {
                "operationId": "publishPrototype",
                "summary": "Publish a prototype with clean slug and versioning",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["content"],
                                "properties": {
                                    "content": { "type": "string" },
                                    "title": { "type": "string" },
                                    "leadId": { "type": "string" },
                                    "canvasMode": { "type": "string", "enum": ["WEB", "GRAPHIC", "SVG", "CONTENT"], "default": "WEB" },
                                    "status": { "type": "string", "enum": ["draft", "published"], "default": "published" },
                                    "customSlug": { "type": "string", "description": "Optional custom slug prefix (e.g. arrington-roofing)" }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": { "description": "Prototype published successfully", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            }
        },
        "/api/mcp/generate-preview": {
            "post": {
                "operationId": "generatePreview",
                "summary": "Generate AI prototype using Gemini and publish with clean slug",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["leadId"],
                                "properties": {
                                    "leadId": { "type": "string" },
                                    "prototypeType": { "type": "string", "enum": ["WEB", "GRAPHIC", "SVG", "CONTENT"], "default": "WEB" },
                                    "description": { "type": "string" },
                                    "businessContext": { "type": "string" },
                                    "customSlug": { "type": "string" }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": { "description": "Prototype generated successfully", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            }
        },
        "/api/mcp/outreach": {
            "post": {
                "operationId": "draftOutreach",
                "summary": "Draft a personalized outreach email for a lead",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["leadId"],
                                "properties": {
                                    "leadId": { "type": "string" },
                                    "angle": { "type": "string" }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": { "description": "Outreach drafted successfully", "content": { "application/json": { "schema": { "type": "object" } } } }
                }
            }
        }
    },
    "components": {
        "securitySchemes": {
            "ApiKeyAuth": {
                "type": "apiKey",
                "in": "header",
                "name": "mo-x-api-key"
            }
        }
    },
    "security": [{ "ApiKeyAuth": [] }]
}

# Write api/openapi.json
with open('api/openapi.json', 'w') as f:
    json.dump(openapi_spec, f, indent=2)

print("Generated api/openapi.json successfully")
