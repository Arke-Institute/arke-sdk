/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 *
 * This file was generated from the Arke v1 OpenAPI spec.
 * To regenerate, run: npm run generate
 *
 * Source: Arke v1 API
 * Version: 1.0.0
 * Generated: 2026-02-20T03:10:32.965Z
 */

export type paths = {
    "/ops-reference": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get LLM-friendly API reference
         * @description Returns a condensed, plain-text API operations reference optimized for LLM consumption.
         *
         *     This endpoint provides the same information as the OpenAPI spec but in a format that:
         *     - Uses ~80% fewer tokens than the full OpenAPI JSON
         *     - Preserves full endpoint descriptions
         *     - Organizes operations by category
         *     - Marks required fields with `*` suffix
         *     - Includes auth requirements inline
         *
         *     **Format example:**
         *     ```
         *     ## Collections
         *     POST /collections [required] - Create a new collection
         *       body: {label*:string, description:string}
         *
         *       Creates a collection with the authenticated user as owner.
         *     ```
         *
         *     Use this for injecting API knowledge into LLM system prompts.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Condensed API operations reference */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/plain": string;
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register new user
         * @description Creates a user entity from JWT claims. Idempotent - returns existing user if already registered.
         *
         *     ---
         *     **Permission:** `user:create`
         *     **Auth:** jwt-only
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User already exists */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RegisterResponse"];
                    };
                };
                /** @description User created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RegisterResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Internal server error"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/whoami": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get current identity
         * @description Returns identity information for the authenticated caller.
         *
         *     Accepts any valid credential type:
         *     - **JWT**: Returns user PI, email, name, and Supabase user ID
         *     - **User API Key (uk_)**: Returns user PI and key metadata
         *     - **Agent API Key (ak_)**: Returns agent PI, owner PI, and key metadata
         *
         *     Use this endpoint to verify credentials are working or to retrieve the caller's entity PI.
         *
         *     ---
         *     **Permission:** `auth:whoami`
         *     **Auth:** required
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Identity information */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["WhoamiResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Internal server error"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/alpha/invite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Invite a user to the alpha
         * @description Creates an alpha invite and sends a Supabase invite email. Requires X-Alpha-Secret header.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateAlphaInviteRequest"];
                };
            };
            responses: {
                /** @description Invite created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CreateAlphaInviteResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Invite already exists for this email */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Internal server error"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/alpha/invites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all alpha invites
         * @description Returns all invites with their current status. Requires X-Alpha-Secret header.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Invite list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListAlphaInvitesResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Internal server error"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/alpha/invite/{email}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Revoke an alpha invite
         * @description Revokes an invite by email. Requires X-Alpha-Secret header.
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    email: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Invite revoked */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            revoked: boolean;
                            email: string;
                        };
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Internal server error"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get current user
         * @description Returns the authenticated user's entity.
         *
         *     ---
         *     **Permission:** `user:view`
         *     **Auth:** required
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UserResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description User entity not found (database inconsistency) */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me/keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List API keys
         * @description Lists all active API keys for the authenticated user. Returns prefixes only, not full keys.
         *
         *     ---
         *     **Permission:** `user:credentials`
         *     **Auth:** required
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description API keys list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListApiKeysResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Create API key
         * @description Creates a new API key for the authenticated user. The full key is only returned once - store it securely.
         *
         *     ---
         *     **Permission:** `user:credentials`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateApiKeyRequest"];
                };
            };
            responses: {
                /** @description API key created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CreateApiKeyResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me/keys/{prefix}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Revoke API key
         * @description Revokes an API key by prefix. The key will be immediately invalid.
         *
         *     ---
         *     **Permission:** `user:credentials`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    prefix: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description API key revoked */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{id}/collections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List collections user has access to
         * @description Returns all collections where the user has a role relationship (owner, editor, viewer, etc.).
         *
         *     Queries GraphDB for collections with relationships pointing to this user where peer_type is 'user'.
         *     Results include the role predicate so clients know what access the user has to each collection.
         *
         *     Supports filtering by predicate (role name) and pagination.
         *
         *     ---
         *     **Permission:** `user:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    predicate?: string;
                    limit?: string;
                    offset?: string;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of collections */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UserCollectionsResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description GraphDB service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Search across user collections
         * @description Performs semantic search across all collections the authenticated user has access to.
         *
         *     ## Features
         *     - Searches all user's collections in parallel (up to 25)
         *     - Optionally includes public-domain entities
         *     - Filter by entity type or collection role
         *     - Results ranked by semantic relevance
         *
         *     ## Performance
         *     - Collections are queried in parallel for speed
         *     - If user has more than 25 collections, queries first 25 (by created_at). Use role filter to narrow down.
         *     - Response includes metadata showing collections_queried vs collections_total
         *
         *     ## Scoring
         *     - Results use cosine similarity scores (0-1)
         *     - Scores are comparable across collections
         *
         *     ## Entity Expansion
         *
         *     Use `expand` in the request body to fetch entity data inline with search results:
         *
         *     - **`expand: "preview"` (default)**: Adds `entity_preview` with fresh lightweight data (id, type, label, timestamps)
         *     - **`expand: "full"`**: Adds `entity` with complete manifest including all properties and relationships
         *     - **`expand: "none"`**: Returns search metadata only (fastest, lowest bandwidth)
         *
         *     Preview mode is recommended for most use cases. Full expansion can result in large payloads.
         *     Gracefully handles deleted or inaccessible entities (returns results without expansion data).
         *
         *
         *     ---
         *     **Permission:** `search:execute`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CrossCollectionSearchRequest"];
                };
            };
            responses: {
                /** @description Search results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CrossCollectionSearchResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Search service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a new collection
         * @description Creates a collection with the authenticated user as owner.
         *
         *     **Default Roles:**
         *
         *     By default (`use_roles_default: true`), collections include these standard roles:
         *     - `owner`: Full control including collection management
         *     - `editor`: Can modify entities but not collection settings
         *     - `viewer`: Read-only access
         *     - `public`: Public read access (`*:view`)
         *
         *     **Customizing Roles:**
         *
         *     Pass custom `roles` to override specific defaults while keeping others. For example, to make entities publicly invokable (for agents):
         *     ```json
         *     { "roles": { "public": ["*:view", "*:invoke"] } }
         *     ```
         *
         *     Set `use_roles_default: false` to define all roles from scratch.
         *
         *     **Platform Requirement:** The `public` role with `*:view` is always automatically ensured, guaranteeing all collections are publicly readable.
         *
         *     ---
         *     **Permission:** `collection:create`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateCollectionRequest"];
                };
            };
            responses: {
                /** @description Collection created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CollectionResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/catalog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all collections for catalog/sitemap
         * @description Returns a paginated list of all collection IDs and their last update times.
         *
         *     This endpoint is designed for sitemap generation and discovery services. It returns minimal data (just IDs and timestamps) for efficiency.
         *
         *     **Lazy Population:** The catalog is populated as collections are created or updated. Newly created collections may take a moment to appear.
         *
         *     **No Authentication Required:** This endpoint is public to allow crawlers and discovery services to access it.
         *
         *     ---
         *     **Permission:** `catalog:list`
         *     **Auth:** none
         */
        get: {
            parameters: {
                query?: {
                    limit?: number;
                    offset?: number | null;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Paginated list of collections */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                /**
                                 * @description Collection ID (PI)
                                 * @example 01JEXAMPLE...
                                 */
                                id: string;
                                /**
                                 * @description ISO timestamp of last update
                                 * @example 2026-02-17T12:00:00Z
                                 */
                                updated_at: string;
                            }[];
                            pagination: {
                                /** @description Total number of collections in catalog */
                                total: number;
                                /** @description Requested limit */
                                limit: number;
                                /** @description Current offset */
                                offset: number;
                                /** @description Whether more results are available */
                                has_more: boolean;
                            };
                        };
                    };
                };
                /** @description Collections catalog service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get collection by ID
         * @description Returns a collection entity by ID.
         *
         *     ---
         *     **Permission:** `collection:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Collection found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CollectionResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        /**
         * Update collection properties
         * @description Updates collection properties. Requires collection:update permission.
         *
         *     **Relationship Target Validation:**
         *     By default, new relationship targets in `relationships_add` are validated to ensure they exist. Use `?validate_relationships=false` to skip this validation.
         *
         *     Requests with more than 500 unique relationship targets are rejected when validation is enabled.
         *
         *     ---
         *     **Permission:** `collection:update`
         *     **Auth:** required
         */
        put: {
            parameters: {
                query?: {
                    /** @description Validate that relationship targets exist. Defaults to true for single entity operations, false for batch. When true, requests with >500 unique relationship targets are rejected. */
                    validate_relationships?: "true" | "false";
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["UpdateCollectionRequest"];
                };
            };
            responses: {
                /** @description Collection updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CollectionUpdateResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{id}/roles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add a new role
         * @description Adds a new role to the collection. Requires collection:manage permission.
         *
         *     ---
         *     **Permission:** `collection:manage`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["AddRoleRequest"];
                };
            };
            responses: {
                /** @description Role added */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RoleResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{id}/roles/{role}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update role actions
         * @description Updates the actions for an existing role. Requires collection:manage permission.
         *
         *     ---
         *     **Permission:** `collection:manage`
         *     **Auth:** required
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                    /** @description Role name */
                    role: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["UpdateRoleRequest"];
                };
            };
            responses: {
                /** @description Role updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RoleResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * Delete a role
         * @description Deletes a role from the collection. Requires collection:manage permission.
         *
         *     ---
         *     **Permission:** `collection:manage`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                    /** @description Role name */
                    role: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Role deleted */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RoleResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{id}/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List collection members
         * @description Returns all members of the collection grouped by type. By default, expired memberships are excluded.
         *
         *     ---
         *     **Permission:** `collection:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    include_expired?: "true" | "false";
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Members list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MembersResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Assign user to role
         * @description Assigns a user to a role in the collection. Requires collection:manage permission.
         *
         *     ---
         *     **Permission:** `collection:manage`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["AssignRoleRequest"];
                };
            };
            responses: {
                /** @description User assigned to role */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MemberAssignResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{id}/members/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Remove user from role
         * @description Removes a user from a role in the collection. Requires collection:manage permission.
         *
         *     ---
         *     **Permission:** `collection:manage`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query: {
                    /** @description Role to remove user from */
                    role: string;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                    /** @description User entity ID (ULID) */
                    userId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description User removed from role */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MemberRemoveResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{id}/root": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Set root entity
         * @description Links an entity as the root of this collection.
         *
         *     **Prerequisites:** The entity must already have a 'collection' relationship
         *     pointing to this collection (typically set during entity creation via the
         *     `collection` field).
         *
         *     **Recommended flow:**
         *     1. Create entity with `collection` field set → entity is immediately protected
         *     2. Call this endpoint to establish the root link from collection to entity
         *
         *     This adds only the reverse relationship:
         *     - Collection → Entity (predicate: 'root')
         *
         *     Requires collection:update permission on the collection.
         *
         *     ---
         *     **Permission:** `collection:update`
         *     **Auth:** required
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["SetRootEntityRequest"];
                };
            };
            responses: {
                /** @description Root entity set */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SetRootEntityResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{id}/entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List entities in a collection
         * @description Returns entities belonging to this collection.
         *
         *     Supports pagination and optional type filtering. Results are ordered by creation date (newest first).
         *
         *     **Expansion Modes:**
         *
         *     By default, returns lightweight summaries (pi, type, label, timestamps).
         *
         *     Use the `expand` parameter to hydrate entity data from storage:
         *
         *     - **`?expand=preview`**: Adds `preview` field with fresh lightweight data (label, truncated description/text, timestamps). ~5-10KB per entity.
         *
         *     - **`?expand=full`**: Adds `entity` field with complete manifest (all properties, relationships, version history). ~20-50KB per entity.
         *
         *     **Performance Note:** Expansion requires fetching each entity from storage. Limited to 100 entities per request. Use smaller `limit` values when expanding.
         *
         *     ---
         *     **Permission:** `collection:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    type?: string;
                    filter?: string;
                    limit?: number;
                    offset?: number | null;
                    expand?: "preview" | "full";
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Entities in collection */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CollectionEntitiesResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Collection index service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{id}/entities/lookup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lookup entities by label
         * @description Fast (~5ms) lookup of entities by exact label and/or type within this collection.
         *
         *     Uses a per-collection SQLite index for instant keyword queries. Complements semantic search for when you know the exact label.
         *
         *     **Query Parameters:**
         *     - `label`: Exact label match (case-insensitive)
         *     - `type`: Filter by entity type
         *     - `limit`: Maximum results (default: 100, max: 1000)
         *
         *     At least one of `label` or `type` should be provided for meaningful results.
         *
         *     ---
         *     **Permission:** `collection:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    label?: string;
                    type?: string;
                    limit?: number;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Matching entities */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CollectionEntityLookupResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Collection index service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/collections/{id}/entities/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search entities by keyword or similarity
         * @description Search within a collection's entities using keyword matching or semantic similarity.
         *
         *     **Keyword Search (q parameter):**
         *     - Fast (~5ms) using per-collection SQLite index
         *     - Case-insensitive substring match on entity labels
         *
         *     **Semantic Similarity Search (similar_to parameter):**
         *     - Finds entities semantically similar to the given entity ID
         *     - Uses Pinecone vector similarity
         *     - Returns results with similarity scores
         *
         *     One of `q` or `similar_to` must be provided.
         *
         *     **Query Parameters:**
         *     - `q`: Search query (case-insensitive substring match)
         *     - `similar_to`: Entity ID to find similar items for
         *     - `type`: Filter by entity type
         *     - `limit`: Maximum results (default: 100, max: 1000)
         *
         *     ---
         *     **Permission:** `collection:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    q?: string;
                    similar_to?: string;
                    type?: string;
                    limit?: number;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Matching entities */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CollectionEntitySearchResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Collection index service unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a new entity
         * @description Creates a generic entity of any type. For type-specific validation, use type-specific endpoints.
         *
         *     **Relationship Target Validation:**
         *     By default, all relationship targets are validated to ensure they exist. Use `?validate_relationships=false` to skip this validation (useful for migrations or when targets will be created shortly after).
         *
         *     Requests with more than 500 unique relationship targets are rejected when validation is enabled.
         *
         *     ---
         *     **Permission:** `entity:create`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: {
                    /** @description Validate that relationship targets exist. Defaults to true for single entity operations, false for batch. When true, requests with >500 unique relationship targets are rejected. */
                    validate_relationships?: "true" | "false";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateEntityRequest"];
                };
            };
            responses: {
                /** @description Entity created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EntityCreatedResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Batch create entities
         * @description Creates multiple entities in a single request with bounded internal concurrency.
         *
         *     Entities are created in chunks of 10 internally. Each entity follows the same permission model as single creates.
         *
         *     Returns per-entity results. HTTP 201 if all succeed, 207 if some fail.
         *
         *     **Max batch size:** 100 entities.
         *
         *     **Relationship Target Validation:**
         *     By default, relationship targets are NOT validated for batch creates. This is because intra-batch references are common (entity A references entity B, both created in the same batch). Use `?validate_relationships=true` to enable validation if needed.
         *
         *     ---
         *     **Permission:** `entity:create`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: {
                    /** @description Validate that relationship targets exist. Defaults to true for single entity operations, false for batch. When true, requests with >500 unique relationship targets are rejected. */
                    validate_relationships?: "true" | "false";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["BatchCreateEntityRequest"];
                };
            };
            responses: {
                /** @description All entities created successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BatchCreateEntityResponse"];
                    };
                };
                /** @description Partial success - some entities failed */
                207: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BatchCreateEntityResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/batch-get": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Batch get entities by ID
         * @description Fetches multiple entities by ID in a single request.
         *
         *     Permission is checked per-entity. Entities the caller cannot access are excluded from results and listed in `not_found`.
         *
         *     **Use cases:**
         *     - Tree traversal: Expand multiple nodes at once
         *     - Workflow status: Fetch all log entries in a job
         *     - Relationship hydration: Fetch all peers of an entity
         *
         *     **Max batch size:** 100 entities.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["BatchGetRequest"];
                };
            };
            responses: {
                /** @description Entities fetched */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BatchGetResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get entity by ID
         * @description Returns any entity by ID. Permission check uses parent collection if entity belongs to one.
         *
         *     **Relationship Expansion:**
         *
         *     Use the `expand=relationships[:mode]` query parameter to hydrate relationship peer data:
         *
         *     - **No expansion (default)**: Returns relationships with stored `peer_label`/`peer_type` (may be stale)
         *       ```json
         *       { "predicate": "contains", "peer": "01KDOC...", "peer_label": "Old Label" }
         *       ```
         *
         *     - **`?expand=relationships:preview`**: Adds `peer_preview` with fresh lightweight data (id, type, label, truncated description/text, timestamps)
         *       ```json
         *       {
         *         "predicate": "contains",
         *         "peer": "01KDOC...",
         *         "peer_label": "Old Label",
         *         "peer_preview": {
         *           "id": "01KDOC...",
         *           "type": "document",
         *           "label": "Updated Label",
         *           "description_preview": "This is a document with...",
         *           "created_at": "2025-01-15T10:00:00Z",
         *           "updated_at": "2025-01-20T14:30:00Z"
         *         }
         *       }
         *       ```
         *
         *     - **`?expand=relationships:full`**: Adds `peer_entity` with complete entity manifest (all properties, relationships, version history)
         *       ```json
         *       {
         *         "predicate": "contains",
         *         "peer": "01KDOC...",
         *         "peer_label": "Old Label",
         *         "peer_entity": {
         *           "id": "01KDOC...",
         *           "cid": "bafyrei...",
         *           "type": "document",
         *           "properties": { "label": "Updated Label", "text": "..." },
         *           "relationships": [...],
         *           "ver": 3,
         *           "created_at": "2025-01-15T10:00:00Z",
         *           "ts": 1737380000000,
         *           "edited_by": { "user_id": "01JUSER...", "method": "manual" }
         *         }
         *       }
         *       ```
         *
         *     **Performance:** Preview expansion is recommended for most use cases. Full expansion with many large entities can result in multi-MB payloads.
         *
         *     **Expansion Limit:**
         *     Use `?expand_limit=N` to control maximum relationships expanded (1-500, default 100). When truncated, the response includes `_expansion_metadata` with counts.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    /** @description Comma-separated list of fields to expand. Supports: relationships[:preview|full] */
                    expand?: string;
                    /** @description Maximum number of relationships to expand (1-500, default 100). When exceeded, relationships beyond the limit are returned without peer data. */
                    expand_limit?: number;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Entity found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EntityResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        /**
         * Update entity
         * @description Updates an entity with merge semantics. **This is the recommended way to manage relationships.**
         *
         *     - `relationships_add`: Upsert relationships (properties are merged if relationship exists)
         *     - `relationships_remove`: Remove by predicate/peer
         *     - `properties`: Deep merged with existing
         *     - `properties_remove`: Remove nested properties using nested object structure
         *
         *     **properties_remove syntax:**
         *     - Top-level keys: `["field1", "field2"]`
         *     - Nested keys: `{ parent: { child: ["key_to_remove"] } }`
         *     - **Dot notation is NOT supported** - `["parent.child.key"]` will NOT work
         *
         *     Example to remove `config.options.debug`:
         *     ```json
         *     { "properties_remove": { "config": { "options": ["debug"] } } }
         *     ```
         *
         *     Use `/relationships` only for bidirectional links updating two entities atomically.
         *
         *     **Relationship Target Validation:**
         *     By default, new relationship targets in `relationships_add` are validated to ensure they exist. Use `?validate_relationships=false` to skip this validation.
         *
         *     Requests with more than 500 unique relationship targets are rejected when validation is enabled.
         *
         *     Note: entity:update on a collection requires collection:update permission.
         *
         *     ---
         *     **Permission:** `entity:update`
         *     **Auth:** required
         */
        put: {
            parameters: {
                query?: {
                    /** @description Validate that relationship targets exist. Defaults to true for single entity operations, false for batch. When true, requests with >500 unique relationship targets are rejected. */
                    validate_relationships?: "true" | "false";
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["UpdateEntityRequest"];
                };
            };
            responses: {
                /** @description Entity updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EntityUpdatedResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        /**
         * Delete entity
         * @description Soft-deletes an entity by creating a tombstone version. The entity can be restored later via POST /entities/:id/restore. Note: entity:delete on a collection requires collection:delete permission.
         *
         *     ---
         *     **Permission:** `entity:delete`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["DeleteEntityRequest"];
                };
            };
            responses: {
                /** @description Entity deleted */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EntityDeletedResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get entity preview
         * @description Returns lightweight preview data for an entity. Useful for:
         *     - Link previews and hover cards
         *     - Relationship metadata freshness (vs stale peer_label)
         *     - AI context management (smaller payloads)
         *     - Search result enhancement
         *
         *     Returns: id, type, label, collection_pi, description_preview (200 chars), text_preview (200 chars), timestamps.
         *
         *     **Performance:** Single KV fetch, ~40-60ms response time, typically <1KB payload.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Entity preview data */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EntityPreview"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/tip": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get entity tip CID
         * @description Returns only the current manifest CID (tip) for an entity. Lightweight endpoint for CAS operations - single Durable Object lookup, no manifest fetch, no permission check.
         *
         *     ---
         *     **Permission:** `entity:tip`
         *     **Auth:** none
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Tip found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TipResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/cascade": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Cascade delete entity and related entities
         * @description Deletes an entity and all related entities matching predicate patterns within a scoped collection.
         *
         *     **Permission Model:**
         *     - Requires `entity:delete` permission on the specified `collection_id`
         *     - Single permission check at the start (not per-entity)
         *     - Individual entity type permissions are NOT checked during cascade
         *
         *     **Cascade Rules:**
         *     - `collection` predicate NEVER cascades (hard rule - protects collection structure)
         *     - Only entities in the specified collection are deleted
         *     - Entities outside the collection are skipped (reported in `skipped` array)
         *
         *     **Predicate Patterns:**
         *     - `"child"` - exact match only
         *     - `"has_*"` - matches has_document, has_image, etc.
         *     - `"*_copy"` - matches file_copy, document_copy, etc.
         *     - `"*"` - matches ALL predicates (except collection)
         *
         *     **Traversal:**
         *     - BFS traversal with parallel processing per depth layer
         *     - Max depth: 20 (default: 10)
         *     - Optional `edited_by_filter` to only delete entities created by a specific actor (useful for agent cleanup)
         *
         *     **CAS Handling:**
         *     - Root entity uses the provided `expect_tip`
         *     - Child entities use re-fetch + single retry strategy
         *     - CAS conflicts are reported as skipped (not failures)
         *
         *     **Response:**
         *     - Lists all deleted entities with their depth from root
         *     - Lists skipped entities with reasons
         *     - Provides summary statistics
         *
         *     ---
         *     **Permission:** `entity:delete`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CascadeDeleteRequest"];
                };
            };
            responses: {
                /** @description Cascade delete completed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CascadeDeleteResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Restore deleted entity
         * @description Restores a deleted entity by finding the last non-deleted version and creating a new version from it. Note: entity:restore on a collection requires collection:restore permission.
         *
         *     ---
         *     **Permission:** `entity:restore`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["RestoreEntityRequest"];
                };
            };
            responses: {
                /** @description Entity restored */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EntityRestoredResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/collection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get entity collection
         * @description Returns the collection ID that this entity belongs to. Returns null if the entity is not in any collection. If the entity IS a collection, returns its own ID.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Collection lookup result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EntityCollectionResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/tree": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get entity tree
         * @description Returns a hierarchical tree of entities reachable from the source entity.
         *
         *     Use this to browse collections and folders without making multiple API calls.
         *     The tree follows relationship edges (optionally filtered by predicate) and
         *     returns a nested structure suitable for tree UI rendering.
         *
         *     Query parameters:
         *     - `depth`: Max tree depth (1-4, default 2)
         *     - `collection`: Constrain to entities in this collection
         *     - `predicates`: Comma-separated predicates to follow (e.g., "contains")
         *     - `limit`: Max nodes to return (default 100)
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    depth?: number;
                    collection?: string;
                    predicates?: string;
                    limit?: number;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Tree retrieved */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["TreeResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/diff": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get diff between entity versions
         * @description Computes the difference between two versions of an entity.
         *
         *     Query parameters:
         *     - `from`: CID of the "from" version (defaults to prev of "to" version)
         *     - `to`: CID of the "to" version (defaults to current tip)
         *     - `format`: Output format - "semantic" (default) or "patch" (RFC 6902)
         *
         *     Modes:
         *     - No params: Compare current tip with its previous version
         *     - `to` only: Compare that version with its prev
         *     - `from` only: Compare from that version to current tip
         *     - Both: Compare any two versions
         *
         *     For version 1 entities (no previous version), "from" is null and all content appears as added.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    /** @description CID of the "from" version. Defaults to prev of "to" version. */
                    from?: string;
                    /** @description CID of the "to" version. Defaults to current tip. */
                    to?: string;
                    /** @description Output format: "semantic" (default) or "patch" (RFC 6902) */
                    format?: "semantic" | "patch";
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Diff computed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DiffResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/permissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get your permissions for an entity
         * @description Returns the list of actions you can perform on this entity.
         *
         *     The response includes:
         *     - `allowed_actions`: Concrete actions you can perform (no wildcards)
         *     - `resolution`: How permissions were determined
         *
         *     Resolution methods:
         *     - `collection`: Permissions from your role in the parent collection
         *     - `self`: You are checking your own user entity (self-ownership)
         *     - `open_season`: Entity is not in any collection (publicly accessible)
         *
         *     Actions are filtered to only those relevant to the entity type:
         *     - For files: entity:* and file:* actions
         *     - For collections: entity:* and collection:* actions
         *     - etc.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** required
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Permissions retrieved */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EntityPermissionsResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/content": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download content for any entity
         * @description Downloads binary content for any entity type.
         *
         *     **Query Parameters:**
         *     - `key` (optional): Specific version key to download. Default: current content key from entity
         *
         *     **Response Headers:**
         *     - `Content-Type`: MIME type of the content
         *     - `Content-Length`: Content size in bytes
         *     - `Content-Disposition`: attachment; filename="..." (if filename was set)
         *
         *     **Streaming:**
         *     Response is streamed directly from R2 storage for efficient large file handling.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    key?: string;
                    cid?: string;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Content downloaded */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/octet-stream": string;
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Upload content for any entity
         * @description Uploads binary content for any entity type. Any entity can have content attached.
         *
         *     **Request:**
         *     - Query param `key` (required): Version key for this content (e.g., "v1", "original", "thumbnail")
         *     - Query param `filename` (optional): Filename for Content-Disposition header on download
         *     - Header `Content-Type`: MIME type of the content (required)
         *     - Header `Content-Length`: Size for pre-upload validation (optional, max 500MB)
         *     - Body: Binary content (streaming supported)
         *
         *     **Behavior:**
         *     - Streams content directly to R2 storage
         *     - Computes CID from content bytes
         *     - Updates entity with `properties.content` metadata
         *     - Re-uploading with same key overwrites the content
         *     - Creates a new entity version on each upload
         *
         *     **Storage:**
         *     Content is stored at `{entity_id}/{cid}` in R2, enabling multiple versions per entity without overwriting.
         *
         *     ---
         *     **Permission:** `entity:update`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query: {
                    key: string;
                    filename?: string;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Content uploaded */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UploadContentResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
                /** @description Content too large (max 500 MB) */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
            };
        };
        /**
         * Remove content by key or CID
         * @description Removes content metadata from entity. The actual file in R2 is preserved for version history.
         *
         *     **Query Parameters (one required):**
         *     - `key`: Content key to remove
         *     - `cid`: Content CID to remove (alternative to key)
         *     - `expect_tip`: Current entity tip CID for CAS protection (required)
         *
         *     **Behavior:**
         *     - Removes the content entry from the content map
         *     - R2 file is NOT deleted (preserved for version history)
         *     - Returns 404 if content not found
         *     - If CID matches multiple keys, returns error (specify key instead)
         *
         *     **Examples:**
         *     ```
         *     DELETE /entities/{id}/content?key=thumbnail&expect_tip=bafyrei...
         *     DELETE /entities/{id}/content?cid=bafyrei...&expect_tip=bafyrei...
         *     ```
         *
         *     ---
         *     **Permission:** `entity:update`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query: {
                    key?: string;
                    cid?: string;
                    expect_tip: string;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Content removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DeleteContentResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        /**
         * Rename content key
         * @description Renames a content key without moving the underlying R2 file.
         *
         *     Since content is stored by CID, renaming a key is a metadata-only operation.
         *     The R2 file remains at `{entityId}/{cid}` and is unaffected.
         *
         *     **Use Cases:**
         *     - Renaming `v1` to `original` for semantic clarity
         *     - Reorganizing content keys without re-uploading
         *
         *     **Note:** This does not change the filename property. Use entity update for that.
         *
         *     ---
         *     **Permission:** `entity:update`
         *     **Auth:** required
         */
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["RenameContentKeyRequest"];
                };
            };
            responses: {
                /** @description Content key renamed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RenameContentKeyResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/entities/{id}/content/upload-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Get presigned URL for direct upload
         * @description Returns a presigned URL for direct upload to R2 storage, bypassing the API worker.
         *
         *     **When to use:**
         *     - Files larger than 5MB (avoids streaming through API worker)
         *     - Client has reliable network (single PUT request to R2)
         *     - Parallel uploads (get multiple URLs, upload in parallel, complete sequentially)
         *
         *     **Flow:**
         *     1. Compute CID client-side (hash the file content)
         *     2. Call this endpoint with the CID to get presigned URL
         *     3. PUT file directly to the returned URL (include Content-Type header)
         *     4. Call POST /{id}/content/complete to finalize (this is where key/filename are specified)
         *
         *     **Parallel uploads:**
         *     For multiple files, steps 1-3 can be parallelized. Only step 4 (complete) must be
         *     sequential with CAS retry to update entity metadata atomically.
         *
         *     **Presigned URL:**
         *     - Valid for 15 minutes
         *     - R2 path is content-addressed: {entityId}/{cid}
         *     - Must include Content-Type header matching the request
         *
         *     **Security:**
         *     The presigned URL is the access control - it's signed and time-limited.
         *     Without a valid URL from this endpoint, uploads to R2 will fail.
         *
         *     **Note:** The CID is computed client-side and trusted. For guaranteed integrity,
         *     use the direct upload endpoint (POST /{id}/content) which computes CID server-side.
         *
         *     ---
         *     **Permission:** `entity:update`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["GetUploadUrlRequest"];
                };
            };
            responses: {
                /** @description Presigned URL generated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["GetUploadUrlResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/content/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Complete presigned URL upload
         * @description Finalizes a presigned URL upload by updating entity metadata.
         *
         *     **Prerequisites:**
         *     1. Called POST /{id}/content/upload-url to get presigned URL
         *     2. Uploaded file directly to R2 via presigned URL
         *     3. Computed CID client-side
         *
         *     **Request:**
         *     - `key`: Same key used in upload-url request
         *     - `cid`: Content-addressed identifier computed by client
         *     - `size`: Actual file size in bytes
         *     - `content_type`: MIME type of uploaded content
         *     - `expect_tip`: Current entity tip for CAS protection
         *
         *     **Behavior:**
         *     - Verifies file exists in R2 at expected location
         *     - Updates entity with content metadata
         *     - Creates new entity version
         *
         *     **CID Trust:**
         *     The client-provided CID is trusted without server verification.
         *     For guaranteed integrity, use direct upload (POST /{id}/content).
         *
         *     ---
         *     **Permission:** `entity:update`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CompleteUploadRequest"];
                };
            };
            responses: {
                /** @description Upload completed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompleteUploadResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/updates/queue/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get update queue status for entity
         * @description Returns the status of the additive update queue for a specific entity.
         *
         *     **Use Cases:**
         *     - Diagnose why additive updates may not have been applied
         *     - Check for pending, processing, or failed updates
         *     - Monitor queue processing progress
         *
         *     **Response includes:**
         *     - Counts by status (pending, processing, failed)
         *     - Detailed items with actor, relationships count, error messages, attempts
         *
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** required
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Queue status retrieved */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["QueueStatusResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/updates/additive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Queue additive updates (fire-and-forget)
         * @description Queues additive updates for multiple entities. Returns 202 Accepted immediately.
         *
         *     **Fire-and-Forget Semantics:**
         *     - Updates are queued and processed asynchronously
         *     - CAS conflicts are handled internally with exponential backoff retry
         *     - Client does not need to retry on conflicts
         *
         *     **Additive-Only Operations:**
         *     - `properties`: Deep merged with existing properties
         *     - `relationships_add`: Upsert semantics (add new or merge properties)
         *     - `properties_remove` and `relationships_remove` are **NOT supported** - use `PUT /entities/:id` for removals
         *
         *     **Per-Actor Versioning:**
         *     - Multiple updates from the same actor are merged before applying (one version)
         *     - Updates from different actors create separate versions (preserves audit trail)
         *
         *     **Use Cases:**
         *     - Many workers adding relationships to a shared parent entity
         *     - High-volume indexing where multiple sources enrich the same entity
         *     - Any scenario where ordering doesn't matter and CAS conflicts are expected
         *
         *     **Max batch size:** 100 updates per request.
         *
         *     ---
         *     **Permission:** `entity:update`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["AdditiveUpdatesRequest"];
                };
            };
            responses: {
                /** @description Updates accepted for processing */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AdditiveUpdatesResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/versions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List version history
         * @description Returns version metadata for an entity (newest first). Use pagination for entities with many versions.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    /** @description Maximum versions to return (1-10, default 10) */
                    limit?: number;
                    /** @description CID to start from (for pagination) */
                    from?: string;
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Version list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["VersionListResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/versions/manifest/{cid}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get manifest by CID
         * @description Returns the full manifest for any version by its CID. Permission is checked against the entity ID in the manifest.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description IPFS Content Identifier (CID) of the manifest */
                    cid: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Manifest found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ManifestResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/permissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get permission system metadata
         * @description Returns all registered actions, verbs, types, verb implications, wildcard patterns, and default roles.
         *
         *     This endpoint is useful for:
         *     - Building dynamic role editors
         *     - Understanding available permissions
         *     - Validating actions client-side
         *
         *     All data is auto-generated from the actual permission system, so it's always in sync with the code.
         *
         *     ---
         *     **Permission:** `permissions:read`
         *     **Auth:** none
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Permission system metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PermissionsResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/kladoi": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a klados
         * @description Creates a new klados entity. Requires klados:create permission in the target collection.
         *
         *     ---
         *     **Permission:** `klados:create`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateKladosRequest"];
                };
            };
            responses: {
                /** @description Klados created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["KladosResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/kladoi/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get klados by ID
         * @description Returns a klados entity by ID.
         *
         *     ---
         *     **Permission:** `klados:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Klados found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["KladosResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        /**
         * Update klados
         * @description Updates a klados. Requires klados:update permission.
         *
         *     **Endpoint verification rules:**
         *     - Changing `endpoint` clears `endpoint_verified_at` and resets status to 'development'
         *     - Setting `status: 'active'` requires `endpoint_verified_at` to be set
         *
         *     ---
         *     **Permission:** `klados:update`
         *     **Auth:** required
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["UpdateKladosRequest"];
                };
            };
            responses: {
                /** @description Klados updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["KladosUpdateResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/kladoi/{id}/invoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Invoke a klados
         * @description Invoke a klados to perform work on a target entity.
         *
         *     **Two-phase interaction:**
         *     1. `confirm: false` (default) - preview permissions that will be granted
         *     2. `confirm: true` - execute the klados
         *
         *     The klados receives temporal (time-limited) permissions on the target collection.
         *
         *     ---
         *     **Permission:** `klados:invoke`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["InvokeKladosRequest"];
                };
            };
            responses: {
                /** @description Invoke preview (confirm: false) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InvokeKladosPreviewResponse"];
                    };
                };
                /** @description Klados execution started (confirm: true) */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InvokeKladosConfirmedResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/kladoi/{id}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Verify klados endpoint ownership
         * @description Verify that you control the klados's endpoint URL. This is required before activating a klados.
         *
         *     **Two-phase flow:**
         *     1. Call without `confirm` to get a verification token
         *     2. Deploy `/.well-known/arke-verification` endpoint returning the token
         *     3. Call with `confirm: true` to complete verification
         *
         *     **Verification endpoint format:**
         *     Your endpoint must return JSON:
         *     ```json
         *     {
         *       "verification_token": "vt_xxx...",
         *       "klados_id": "01xxx..."
         *     }
         *     ```
         *
         *     ---
         *     **Permission:** `klados:manage`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["VerifyKladosRequest"];
                };
            };
            responses: {
                /** @description Verification token (when confirm is false) or verification result (when confirm is true) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["VerifyKladosTokenResponse"] | components["schemas"]["VerifyKladosSuccessResponse"] | components["schemas"]["VerifyKladosFailureResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/kladoi/{id}/reinvoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reinvoke a failed klados job
         * @description Retry a failed klados job by extracting the original invocation from the error log and re-invoking.
         *
         *     **Requirements:**
         *     - The log file must be a klados_log with `status: error`
         *     - The log must contain `received.invocation` with the original request
         *     - The klados ID in the log must match the route parameter
         *
         *     **What happens:**
         *     1. Extracts the original `KladosRequest` from `received.invocation.request`
         *     2. Generates a new `job_id`
         *     3. Updates `rhiza_context.parent_logs` to point to the failed log (for audit trail)
         *     4. Invokes the klados with fresh `expires_at`
         *
         *     The new job's log will point back to the failed log, preserving the complete retry history.
         *
         *     ---
         *     **Permission:** `klados:invoke`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ReinvokeKladosRequest"];
                };
            };
            responses: {
                /** @description Reinvoke result (rejected by klados) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ReinvokeKladosResponse"];
                    };
                };
                /** @description Reinvoke started (klados accepted) */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ReinvokeKladosResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/kladoi/{id}/keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List API keys for klados
         * @description Lists all active API keys for the klados (without the actual key values).
         *
         *     ---
         *     **Permission:** `klados:manage`
         *     **Auth:** required
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description API keys listed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListKladosApiKeysResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Create API key for klados
         * @description Creates an API key for the klados. The full key is only returned once.
         *
         *     ---
         *     **Permission:** `klados:manage`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateKladosApiKeyRequest"];
                };
            };
            responses: {
                /** @description API key created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CreateKladosApiKeyResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/kladoi/{id}/keys/{prefix}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Revoke API key
         * @description Revokes an API key for the klados.
         *
         *     ---
         *     **Permission:** `klados:manage`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                    prefix: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description API key revoked */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rhizai": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a rhiza workflow
         * @description Creates a new rhiza workflow entity. Requires rhiza:create permission in the target collection.
         *
         *     **Flow validation:**
         *     - Entry klados must be in flow
         *     - All flow targets must be in flow (or external rhiza refs)
         *     - All paths must terminate (done: true or external target)
         *     - No cycles allowed
         *
         *     ---
         *     **Permission:** `rhiza:create`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["CreateRhizaRequest"];
                };
            };
            responses: {
                /** @description Rhiza created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RhizaResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rhizai/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get rhiza by ID
         * @description Returns a rhiza entity by ID.
         *
         *     ---
         *     **Permission:** `rhiza:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Rhiza found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RhizaResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        /**
         * Update rhiza
         * @description Updates a rhiza. Requires rhiza:update permission.
         *
         *     ---
         *     **Permission:** `rhiza:update`
         *     **Auth:** required
         */
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["UpdateRhizaRequest"];
                };
            };
            responses: {
                /** @description Rhiza updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RhizaUpdateResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Conflict - CAS validation failed (entity was modified) */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Conflict: entity was modified",
                         *       "details": {
                         *         "expected": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy",
                         *         "actual": "bafyreinewabc123456789defghijklmnopqrstuvwxyz"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["CASErrorResponse"];
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rhizai/{id}/invoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Invoke a rhiza workflow
         * @description Invoke a rhiza workflow to process a target entity.
         *
         *     **Two-phase interaction:**
         *     1. `confirm: false` (default) - preview permissions for all kladoi
         *     2. `confirm: true` - execute the workflow
         *
         *     All kladoi in the workflow receive temporal (time-limited) permissions.
         *
         *     ---
         *     **Permission:** `rhiza:invoke`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["InvokeRhizaRequest"];
                };
            };
            responses: {
                /** @description Invoke preview (confirm: false) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InvokeRhizaPreviewResponse"];
                    };
                };
                /** @description Workflow execution started (confirm: true) */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InvokeRhizaConfirmedResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rhizai/{id}/jobs/{job_id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get workflow job status
         * @description Returns the status of a workflow job.
         *
         *     Reads klados_log entries from the job collection to compute:
         *     - Overall status (pending/running/done/error)
         *     - Progress counters
         *     - Current running kladoi
         *     - Error summaries
         *
         *     ---
         *     **Permission:** `rhiza:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                    job_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Workflow status */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["WorkflowStatusResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rhizai/{id}/jobs/{job_id}/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resume failed workflow
         * @description Resume a workflow by re-invoking failed kladoi that have retryable errors.
         *
         *     Only retryable errors are resumed. Non-retryable errors are skipped.
         *
         *     ---
         *     **Permission:** `rhiza:invoke`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: string;
                    job_id: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ResumeWorkflowRequest"];
                };
            };
            responses: {
                /** @description Resume result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ResumeWorkflowResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List entity change events
         * @description Returns a cursor-based list of entity change events for client synchronization.
         *
         *     **Usage:**
         *     - Call without cursor to get newest events
         *     - Use returned `cursor` as `?cursor=` to get older events
         *     - Poll without cursor periodically to check for new events
         *
         *     **Sync flow:**
         *     1. Initial: `GET /events` → get newest, save highest `id` as high-water mark
         *     2. Paginate: `GET /events?cursor=X` → get older events until `has_more=false`
         *     3. Poll: `GET /events` → if newest `id` > high-water mark, process new events
         *
         *     **Event data:**
         *     - `id`: Auto-increment ID
         *     - `entity_id`: Entity ID that changed
         *     - `cid`: New manifest CID
         *     - `ts`: ISO timestamp
         *
         *     Events are ephemeral (30-day rolling window) - for full sync, use snapshots.
         *
         *     ---
         *     **Permission:** `events:list`
         *     **Auth:** none
         */
        get: {
            parameters: {
                query?: {
                    /** @description Return events older than this id (from previous response cursor) */
                    cursor?: number;
                    /** @description Maximum number of events to return (default: 100, max: 1000) */
                    limit?: number;
                    /** @description Network to query (default: main) */
                    network?: "main" | "test";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Events list */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["EventsListResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/paths": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Find paths between entities
         * @description Find shortest paths between source and target entity sets. Returns all paths up to the limit (default 100).
         *
         *     Use this when you know both endpoints and want to discover how they connect - for example, finding the chain of relationships between a person and a document.
         *
         *     **Entity Expansion (default: preview):**
         *     - Omit `expand` or use `?expand=preview` - Lightweight previews for all path entities
         *     - `?expand=full` - Complete entity manifests (use with caution)
         *     - `?expand=none` - Disable expansion (graph metadata only)
         *
         *     **Performance Warning:** 100 paths can reference 400-800 unique entities, adding 5-10s latency with expansion.
         *
         *     **Recommendations:**
         *     - Use `limit: 10-20` when using expansion
         *     - Prefer preview over full
         *     - Use `expand=none` for large result sets, then fetch specific entities separately
         *
         *     ---
         *     **Permission:** `graph:query`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: {
                    /** @description Entity expansion mode. Omit for preview (default), "full" for complete manifests, "none" to disable */
                    expand?: "preview" | "full" | "none";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["PathsBetweenRequest"];
                };
            };
            responses: {
                /** @description Paths found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PathsBetweenResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/reachable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Find reachable entities (exhaustive)
         * @description Find all entities of a specific type reachable from source entities within N hops. Returns up to 100 results by default.
         *
         *     **When to use this vs POST /query:** This endpoint returns exhaustive, unranked results - all reachable entities up to the limit. Use `POST /query` when you want relevance-ranked results combining semantic similarity with graph structure. Use this endpoint when you need comprehensive graph exploration from known entity IDs.
         *
         *     **Target Expansion (default: preview):**
         *     - Omit `expand` or use `?expand=preview` - Lightweight target previews
         *     - `?expand=full` - Complete target manifests
         *     - `?expand=none` - Disable expansion (graph metadata only)
         *
         *     **Performance:** With 100 targets, expansion adds ~1s.
         *
         *     ---
         *     **Permission:** `graph:query`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: {
                    /** @description Entity expansion mode. Omit for preview (default), "full" for complete manifests, "none" to disable */
                    expand?: "preview" | "full" | "none";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["PathsReachableRequest"];
                };
            };
            responses: {
                /** @description Reachable entities found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PathsReachableResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/graph/entity/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get entity from graph
         * @description Get entity details with all relationships from the graph database. Unlike the entity manifest, this includes both outgoing and incoming relationships - showing not just what this entity links to, but also what links to it.
         *
         *     **Peer Expansion (default: preview):**
         *     - Omit `expand` or use `?expand=preview` - Lightweight peer previews
         *     - `?expand=full` - Complete peer manifests
         *     - `?expand=none` - Disable expansion (graph metadata only)
         *
         *     **Performance:** With 50 peers, expansion adds ~500ms.
         *
         *     ---
         *     **Permission:** `graph:query`
         *     **Auth:** required
         */
        get: {
            parameters: {
                query?: {
                    /** @description Entity expansion mode. Omit for preview (default), "full" for complete manifests, "none" to disable */
                    expand?: "preview" | "full" | "none";
                };
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Entity found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["GraphEntityResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/query": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Execute Argo query
         * @description Execute an Argo DSL query for path-based graph traversal with relevance ranking.
         *
         *     ## When to Use This Endpoint
         *
         *     | Endpoint | Use Case |
         *     |----------|----------|
         *     | `POST /query` | Semantic search + graph traversal with **relevance-ranked** results (default k=25) |
         *     | `POST /graph/reachable` | **Exhaustive** graph exploration from known entities (default limit=100) |
         *     | `POST /graph/paths` | Find all shortest paths between two entity sets |
         *
         *     This endpoint combines semantic similarity scores with path length to rank results. For exhaustive graph traversal without ranking, use the `/graph/*` endpoints directly.
         *
         *     ## Query Syntax
         *
         *     ```
         *     [SCOPE_PREFIX] ENTRY_POINT [ENTRY_FILTER] [-[RELATION]{DEPTH}-> TARGET_FILTER]...
         *     ```
         *
         *     ## Scope Prefixes
         *
         *     Control where semantic search looks for entry points. Default is discovery mode.
         *
         *     | Prefix | Description | Example |
         *     |--------|-------------|---------|
         *     | (none) | **Discovery mode** (default) - find relevant collections, then search within each | `"medical notes"` |
         *     | `@:collections` | Search for collections themselves | `@:collections "columbia archives"` |
         *     | `@:collection(id)` | Search within a specific collection | `@:collection(01JCOLL123) "meeting"` |
         *     | `@:discover` | Explicit discovery mode | `@:discover "research papers"` |
         *     | `@:public` | Search public domain only | `@:public "orphaned data"` |
         *
         *     **Note:** Graph traversal (hops) is always cross-collection regardless of scope.
         *
         *     ### Entry Points
         *
         *     | Syntax | Description | Example |
         *     |--------|-------------|---------|
         *     | `"text"` | Semantic search | `"george washington"` |
         *     | `@id` | Exact entity ID | `@01KE4ZY69F9R40E88PK9S0TQRQ` |
         *     | `type:X` | All entities of type | `type:person` |
         *     | `type:X ~ "text"` | Semantic search within type | `type:person ~ "physician"` |
         *
         *     ### Edges (Hops)
         *
         *     | Syntax | Direction |
         *     |--------|-----------|
         *     | `-[*]->` | Outgoing |
         *     | `<-[*]-` | Incoming |
         *     | `<-[*]->` | Both |
         *     | `-[*]{,4}->` | Variable depth (1-4) |
         *
         *     ### Examples
         *
         *     ```
         *     "george washington"                           # Discovery mode (default)
         *     @:collections "columbia university"           # Find collections
         *     @:collection(01JCOLL123) "faculty meeting"    # Within specific collection
         *     @:discover "alice" -[*]{,2}-> type:person     # Discover, then traverse
         *     @01KE4ZY... -[*]{,2}-> type:person            # From exact entity
         *     ```
         *
         *     ## Entity Expansion
         *
         *     Control how much entity data is included in results via the `expand` parameter.
         *
         *     | Value | Description | Use Case |
         *     |-------|-------------|----------|
         *     | (omitted) | **Preview** (default) - lightweight preview data | Best balance of detail and payload size |
         *     | `preview` | Same as omitted - lightweight preview data | Explicit preview mode |
         *     | `full` | Complete entity manifest | When you need all properties, relationships, versions |
         *     | `none` | No expansion - Pinecone metadata only | Fastest response, smallest payload |
         *
         *     **Preview mode** includes: label, truncated description/text (200 chars), created_at, updated_at.
         *
         *     **Full mode** includes: all properties, relationships, version info, CID.
         *
         *     Both result entities and path step entities are expanded.
         *
         *
         *     ---
         *     **Permission:** `query:execute`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["QueryRequest"];
                };
            };
            responses: {
                /** @description Query executed successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["QueryResponse"];
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/similar/collections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Find similar collections
         * @description Find collections that are semantically similar to a given collection.
         *
         *     Uses the collection's weighted centroid vector (combination of description and entity embeddings) to find related collections.
         *
         *     **Entity Expansion:**
         *
         *     Use `expand` in the request body to fetch entity data inline with search results:
         *
         *     - **`expand: "preview"` (default)**: Adds `entity_preview` with fresh lightweight data (id, type, label, timestamps)
         *     - **`expand: "full"`**: Adds `entity` with complete manifest including all properties and relationships
         *     - **`expand: "none"`**: Returns search metadata only (fastest, lowest bandwidth)
         *
         *     Preview mode is recommended for most use cases. Full expansion can result in large payloads.
         *     Gracefully handles deleted or inaccessible entities (returns results without expansion data).
         *
         *     ---
         *     **Permission:** `search:similar`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @description Collection ID to find similar collections for */
                        id: string;
                        /**
                         * @description Maximum results to return
                         * @default 10
                         */
                        limit?: number;
                        /**
                         * @description Force fresh query, bypassing cache
                         * @default false
                         */
                        refresh?: boolean;
                        /**
                         * @description Entity expansion mode. Default: "preview" for lightweight previews, "full" for complete manifests, "none" for no expansion.
                         * @example preview
                         * @enum {string}
                         */
                        expand?: "preview" | "full" | "none";
                    };
                };
            };
            responses: {
                /** @description Similar collections found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            results: {
                                id: string;
                                label: string;
                                score: number;
                                created_at?: string;
                                updated_at?: string;
                                entity_preview?: components["schemas"]["EntityPreview"] & unknown;
                                entity?: components["schemas"]["EntityResponse"] & unknown;
                            }[];
                            metadata: {
                                source_id: string;
                                result_count: number;
                                cached?: boolean;
                                cached_at?: string;
                            };
                        };
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Service Unavailable - External service not available */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Service unavailable",
                         *       "details": {
                         *         "service": "pinecone"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/similar/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Find similar items across collections
         * @description Find entities that are semantically similar to a given entity, searching across multiple collections.
         *
         *     This performs a two-tier search:
         *     1. First finds collections similar to the entity's collection
         *     2. Then searches within each collection for similar items
         *     3. Aggregates and ranks results with diversity weighting
         *
         *     **Entity Expansion:**
         *
         *     Use `expand` in the request body to fetch entity data inline with search results:
         *
         *     - **`expand: "preview"` (default)**: Adds `entity_preview` with fresh lightweight data (id, type, label, timestamps)
         *     - **`expand: "full"`**: Adds `entity` with complete manifest including all properties and relationships
         *     - **`expand: "none"`**: Returns search metadata only (fastest, lowest bandwidth)
         *
         *     Preview mode is recommended for most use cases. Full expansion can result in large payloads.
         *     Gracefully handles deleted or inaccessible entities (returns results without expansion data).
         *
         *     ---
         *     **Permission:** `search:similar`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @description Entity ID to find similar items for */
                        id: string;
                        /** @description Entity's collection ID */
                        collection_id: string;
                        /**
                         * @description Maximum results to return
                         * @default 20
                         */
                        limit?: number;
                        /**
                         * @description Number of similar collections to search
                         * @default 10
                         */
                        tier1_limit?: number;
                        /**
                         * @description Items to fetch per collection
                         * @default 5
                         */
                        tier2_limit?: number;
                        /**
                         * @description Include results from the same collection
                         * @default true
                         */
                        include_same_collection?: boolean;
                        /**
                         * @description Force fresh query, bypassing cache
                         * @default false
                         */
                        refresh?: boolean;
                        /**
                         * @description Entity expansion mode. Default: "preview" for lightweight previews, "full" for complete manifests, "none" for no expansion.
                         * @example preview
                         * @enum {string}
                         */
                        expand?: "preview" | "full" | "none";
                    };
                };
            };
            responses: {
                /** @description Similar items found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            results: {
                                id: string;
                                type: string;
                                label: string;
                                collection_id: string | null;
                                score: number;
                                created_at?: string;
                                updated_at?: string;
                                entity_preview?: components["schemas"]["EntityPreview"] & unknown;
                                entity?: components["schemas"]["EntityResponse"] & unknown;
                            }[];
                            metadata: {
                                source_id: string;
                                collections_searched: number;
                                result_count: number;
                                cached?: boolean;
                                cached_at?: string;
                            };
                        };
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Service Unavailable - External service not available */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Service unavailable",
                         *       "details": {
                         *         "service": "pinecone"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/collections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Search collections by text
         * @description Search for collections using semantic text search.
         *
         *     Use this endpoint to discover collections about a topic. Results are ranked by semantic similarity to your query.
         *
         *     **Entity Expansion:**
         *
         *     Use `expand` in the request body to fetch entity data inline with search results:
         *
         *     - **`expand: "preview"` (default)**: Adds `entity_preview` with fresh lightweight data (id, type, label, timestamps)
         *     - **`expand: "full"`**: Adds `entity` with complete manifest including all properties and relationships
         *     - **`expand: "none"`**: Returns search metadata only (fastest, lowest bandwidth)
         *
         *     Preview mode is recommended for most use cases. Full expansion can result in large payloads.
         *     Gracefully handles deleted or inaccessible entities (returns results without expansion data).
         *
         *     ---
         *     **Permission:** `search:query`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @description Search query text */
                        query: string;
                        /**
                         * @description Maximum results to return
                         * @default 10
                         */
                        limit?: number;
                        /** @description Filter by collection types */
                        types?: string[];
                        /**
                         * @description Filter by indexed metadata properties.
                         *
                         *     **Filterable Properties:**
                         *     Only underscore-prefixed properties (`_year`, `_class`, etc.) are indexed as filterable metadata.
                         *
                         *     **Operators:**
                         *     | Operator | Description | Example |
                         *     |----------|-------------|---------|
                         *     | `$eq` | Equals | `{ "_year": { "$eq": 1905 } }` |
                         *     | `$ne` | Not equals | `{ "_class": { "$ne": "draft" } }` |
                         *     | `$gt` | Greater than | `{ "_year": { "$gt": 1900 } }` |
                         *     | `$gte` | Greater than or equal | `{ "_year": { "$gte": 1900 } }` |
                         *     | `$lt` | Less than | `{ "_year": { "$lt": 2000 } }` |
                         *     | `$lte` | Less than or equal | `{ "_year": { "$lte": 2000 } }` |
                         *     | `$in` | In array | `{ "_class": { "$in": ["letter", "memo"] } }` |
                         *     | `$nin` | Not in array | `{ "_class": { "$nin": ["draft"] } }` |
                         *     | `$exists` | Property exists | `{ "_ocr_text": { "$exists": true } }` |
                         *
                         *     **Logical Operators:**
                         *     | Operator | Description | Example |
                         *     |----------|-------------|---------|
                         *     | `$and` | All conditions must match | `{ "$and": [{ "_year": { "$gt": 1900 } }, { "_year": { "$lt": 2000 } }] }` |
                         *     | `$or` | Any condition must match | `{ "$or": [{ "_class": "letter" }, { "_class": "memo" }] }` |
                         *
                         *     **Built-in Fields (always available):**
                         *     - `type` - Entity type
                         *     - `created_at` - ISO timestamp string
                         *     - `updated_at` - ISO timestamp string
                         *
                         *     **Example - Find letters from 1800-1900:**
                         *     ```json
                         *     {
                         *       "$and": [
                         *         { "type": { "$eq": "letter" } },
                         *         { "_year": { "$gte": 1800 } },
                         *         { "_year": { "$lte": 1900 } }
                         *       ]
                         *     }
                         *     ```
                         * @example {
                         *       "_year": {
                         *         "$gt": 1800
                         *       },
                         *       "type": "letter"
                         *     }
                         */
                        filter?: {
                            [key: string]: unknown;
                        };
                        /**
                         * @description Entity expansion mode. Default: "preview" for lightweight previews, "full" for complete manifests, "none" for no expansion.
                         * @example preview
                         * @enum {string}
                         */
                        expand?: "preview" | "full" | "none";
                    };
                };
            };
            responses: {
                /** @description Search results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            results: {
                                id: string;
                                label: string;
                                type: string;
                                score: number;
                                created_at?: string;
                                updated_at?: string;
                                entity_preview?: components["schemas"]["EntityPreview"] & unknown;
                                entity?: components["schemas"]["EntityResponse"] & unknown;
                            }[];
                            metadata: {
                                query: string;
                                result_count: number;
                            };
                        };
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Service Unavailable - External service not available */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Service unavailable",
                         *       "details": {
                         *         "service": "pinecone"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/agents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Search agents by text
         * @description Search for agents using semantic text search.
         *
         *     **Official Agents (Default):** By default, this endpoint searches only the official Arke agents collection (`01KFF0H1KSR4SHHDQ7T2HXQEK6`). These agents are pre-approved, actively maintained, and tested for security and reliability.
         *
         *     **All Agents:** Set `scope: "all"` to search network-wide. This is not recommended as results may include duplicates, outdated agents, or unapproved implementations.
         *
         *     Results are ranked by semantic similarity to your query based on agent descriptions and capabilities.
         *
         *     **Entity Expansion:**
         *
         *     By default, agent search returns **full entity manifests** (including `endpoint`, `input_schema`, `actions_required`, etc.) to make discovery results immediately useful.
         *
         *     - **`expand: "full"` (default)**: Complete agent manifests with all properties
         *     - **`expand: "preview"`**: Lightweight previews (id, type, label, description_preview, timestamps)
         *     - **`expand: "none"`**: Search metadata only (fastest)
         *
         *     ---
         *     **Permission:** `search:query`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @description Search query text */
                        query: string;
                        /**
                         * @description Maximum results to return
                         * @default 10
                         */
                        limit?: number;
                        /**
                         * @description Filter by indexed metadata properties.
                         *
                         *     **Filterable Properties:**
                         *     Only underscore-prefixed properties (`_year`, `_class`, etc.) are indexed as filterable metadata.
                         *
                         *     **Operators:**
                         *     | Operator | Description | Example |
                         *     |----------|-------------|---------|
                         *     | `$eq` | Equals | `{ "_year": { "$eq": 1905 } }` |
                         *     | `$ne` | Not equals | `{ "_class": { "$ne": "draft" } }` |
                         *     | `$gt` | Greater than | `{ "_year": { "$gt": 1900 } }` |
                         *     | `$gte` | Greater than or equal | `{ "_year": { "$gte": 1900 } }` |
                         *     | `$lt` | Less than | `{ "_year": { "$lt": 2000 } }` |
                         *     | `$lte` | Less than or equal | `{ "_year": { "$lte": 2000 } }` |
                         *     | `$in` | In array | `{ "_class": { "$in": ["letter", "memo"] } }` |
                         *     | `$nin` | Not in array | `{ "_class": { "$nin": ["draft"] } }` |
                         *     | `$exists` | Property exists | `{ "_ocr_text": { "$exists": true } }` |
                         *
                         *     **Logical Operators:**
                         *     | Operator | Description | Example |
                         *     |----------|-------------|---------|
                         *     | `$and` | All conditions must match | `{ "$and": [{ "_year": { "$gt": 1900 } }, { "_year": { "$lt": 2000 } }] }` |
                         *     | `$or` | Any condition must match | `{ "$or": [{ "_class": "letter" }, { "_class": "memo" }] }` |
                         *
                         *     **Built-in Fields (always available):**
                         *     - `type` - Entity type
                         *     - `created_at` - ISO timestamp string
                         *     - `updated_at` - ISO timestamp string
                         *
                         *     **Example - Find letters from 1800-1900:**
                         *     ```json
                         *     {
                         *       "$and": [
                         *         { "type": { "$eq": "letter" } },
                         *         { "_year": { "$gte": 1800 } },
                         *         { "_year": { "$lte": 1900 } }
                         *       ]
                         *     }
                         *     ```
                         * @example {
                         *       "_year": {
                         *         "$gt": 1800
                         *       },
                         *       "type": "letter"
                         *     }
                         */
                        filter?: {
                            [key: string]: unknown;
                        };
                        /**
                         * @description Entity expansion mode. Default: "preview" for lightweight previews, "full" for complete manifests, "none" for no expansion.
                         * @example preview
                         * @enum {string}
                         */
                        expand?: "preview" | "full" | "none";
                        /**
                         * @description Search scope. "official" (default) searches only the pre-approved Arke agents collection. "all" searches all agents network-wide (not recommended - may include duplicates, outdated, or unapproved agents).
                         * @default official
                         * @enum {string}
                         */
                        scope?: "official" | "all";
                    };
                };
            };
            responses: {
                /** @description Search results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            results: {
                                id: string;
                                label: string;
                                score: number;
                                collection_id: string | null;
                                status?: string;
                                created_at?: string;
                                updated_at?: string;
                                entity_preview?: components["schemas"]["EntityPreview"] & unknown;
                                entity?: components["schemas"]["EntityResponse"] & unknown;
                            }[];
                            metadata: {
                                query: string;
                                result_count: number;
                            };
                        };
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Service Unavailable - External service not available */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Service unavailable",
                         *       "details": {
                         *         "service": "pinecone"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Search entities within collection(s)
         * @description Search for entities within one or more collections using semantic text search.
         *
         *     Provide either `collection_pi` for a single collection or `collection_ids` for multiple collections (searched in parallel).
         *
         *     Use `per_collection_limit` to ensure result diversity when searching multiple collections.
         *
         *     **Entity Expansion:**
         *
         *     Use `expand` in the request body to fetch entity data inline with search results:
         *
         *     - **`expand: "preview"` (default)**: Adds `entity_preview` with fresh lightweight data (id, type, label, timestamps)
         *     - **`expand: "full"`**: Adds `entity` with complete manifest including all properties and relationships
         *     - **`expand: "none"`**: Returns search metadata only (fastest, lowest bandwidth)
         *
         *     Preview mode is recommended for most use cases. Full expansion can result in large payloads.
         *     Gracefully handles deleted or inaccessible entities (returns results without expansion data).
         *
         *     ---
         *     **Permission:** `search:query`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @description Single collection ID to search within */
                        collection_id?: string;
                        /** @description Multiple collection IDs to search (max 20) */
                        collection_ids?: string[];
                        /** @description Search query text */
                        query: string;
                        /**
                         * @description Maximum total results to return
                         * @default 20
                         */
                        limit?: number;
                        /** @description Filter by entity types */
                        types?: string[];
                        /**
                         * @description Filter by indexed metadata properties.
                         *
                         *     **Filterable Properties:**
                         *     Only underscore-prefixed properties (`_year`, `_class`, etc.) are indexed as filterable metadata.
                         *
                         *     **Operators:**
                         *     | Operator | Description | Example |
                         *     |----------|-------------|---------|
                         *     | `$eq` | Equals | `{ "_year": { "$eq": 1905 } }` |
                         *     | `$ne` | Not equals | `{ "_class": { "$ne": "draft" } }` |
                         *     | `$gt` | Greater than | `{ "_year": { "$gt": 1900 } }` |
                         *     | `$gte` | Greater than or equal | `{ "_year": { "$gte": 1900 } }` |
                         *     | `$lt` | Less than | `{ "_year": { "$lt": 2000 } }` |
                         *     | `$lte` | Less than or equal | `{ "_year": { "$lte": 2000 } }` |
                         *     | `$in` | In array | `{ "_class": { "$in": ["letter", "memo"] } }` |
                         *     | `$nin` | Not in array | `{ "_class": { "$nin": ["draft"] } }` |
                         *     | `$exists` | Property exists | `{ "_ocr_text": { "$exists": true } }` |
                         *
                         *     **Logical Operators:**
                         *     | Operator | Description | Example |
                         *     |----------|-------------|---------|
                         *     | `$and` | All conditions must match | `{ "$and": [{ "_year": { "$gt": 1900 } }, { "_year": { "$lt": 2000 } }] }` |
                         *     | `$or` | Any condition must match | `{ "$or": [{ "_class": "letter" }, { "_class": "memo" }] }` |
                         *
                         *     **Built-in Fields (always available):**
                         *     - `type` - Entity type
                         *     - `created_at` - ISO timestamp string
                         *     - `updated_at` - ISO timestamp string
                         *
                         *     **Example - Find letters from 1800-1900:**
                         *     ```json
                         *     {
                         *       "$and": [
                         *         { "type": { "$eq": "letter" } },
                         *         { "_year": { "$gte": 1800 } },
                         *         { "_year": { "$lte": 1900 } }
                         *       ]
                         *     }
                         *     ```
                         * @example {
                         *       "_year": {
                         *         "$gt": 1800
                         *       },
                         *       "type": "letter"
                         *     }
                         */
                        filter?: {
                            [key: string]: unknown;
                        };
                        /** @description Max results per collection for diversity */
                        per_collection_limit?: number;
                        /**
                         * @description Entity expansion mode. Default: "preview" for lightweight previews, "full" for complete manifests, "none" for no expansion.
                         * @example preview
                         * @enum {string}
                         */
                        expand?: "preview" | "full" | "none";
                    };
                };
            };
            responses: {
                /** @description Search results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            results: {
                                id: string;
                                label: string;
                                type: string;
                                score: number;
                                collection_id: string;
                                created_at?: string;
                                updated_at?: string;
                                entity_preview?: components["schemas"]["EntityPreview"] & unknown;
                                entity?: components["schemas"]["EntityResponse"] & unknown;
                            }[];
                            metadata: {
                                collection_ids: string[];
                                query: string;
                                collections_searched: number;
                                result_count: number;
                            };
                        };
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Service Unavailable - External service not available */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Service unavailable",
                         *       "details": {
                         *         "service": "pinecone"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/discover": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Discover entities across all collections
         * @description Two-step discovery search: first finds relevant collections, then searches within them.
         *
         *     Use this endpoint when you don't know which collections to search. The system will:
         *     1. Find collections semantically related to your query
         *     2. Search within each collection in parallel
         *     3. Aggregate and rank results across all collections
         *
         *     Great for exploration and AI agents navigating the network.
         *
         *     **Entity Expansion:**
         *
         *     Use `expand` in the request body to fetch entity data inline with search results:
         *
         *     - **`expand: "preview"` (default)**: Adds `entity_preview` with fresh lightweight data (id, type, label, timestamps)
         *     - **`expand: "full"`**: Adds `entity` with complete manifest including all properties and relationships
         *     - **`expand: "none"`**: Returns search metadata only (fastest, lowest bandwidth)
         *
         *     Preview mode is recommended for most use cases. Full expansion can result in large payloads.
         *     Gracefully handles deleted or inaccessible entities (returns results without expansion data).
         *
         *     ---
         *     **Permission:** `search:query`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /** @description Search query text */
                        query: string;
                        /**
                         * @description Maximum total results to return
                         * @default 20
                         */
                        limit?: number;
                        /** @description Filter by entity types */
                        types?: string[];
                        /**
                         * @description Filter by indexed metadata properties.
                         *
                         *     **Filterable Properties:**
                         *     Only underscore-prefixed properties (`_year`, `_class`, etc.) are indexed as filterable metadata.
                         *
                         *     **Operators:**
                         *     | Operator | Description | Example |
                         *     |----------|-------------|---------|
                         *     | `$eq` | Equals | `{ "_year": { "$eq": 1905 } }` |
                         *     | `$ne` | Not equals | `{ "_class": { "$ne": "draft" } }` |
                         *     | `$gt` | Greater than | `{ "_year": { "$gt": 1900 } }` |
                         *     | `$gte` | Greater than or equal | `{ "_year": { "$gte": 1900 } }` |
                         *     | `$lt` | Less than | `{ "_year": { "$lt": 2000 } }` |
                         *     | `$lte` | Less than or equal | `{ "_year": { "$lte": 2000 } }` |
                         *     | `$in` | In array | `{ "_class": { "$in": ["letter", "memo"] } }` |
                         *     | `$nin` | Not in array | `{ "_class": { "$nin": ["draft"] } }` |
                         *     | `$exists` | Property exists | `{ "_ocr_text": { "$exists": true } }` |
                         *
                         *     **Logical Operators:**
                         *     | Operator | Description | Example |
                         *     |----------|-------------|---------|
                         *     | `$and` | All conditions must match | `{ "$and": [{ "_year": { "$gt": 1900 } }, { "_year": { "$lt": 2000 } }] }` |
                         *     | `$or` | Any condition must match | `{ "$or": [{ "_class": "letter" }, { "_class": "memo" }] }` |
                         *
                         *     **Built-in Fields (always available):**
                         *     - `type` - Entity type
                         *     - `created_at` - ISO timestamp string
                         *     - `updated_at` - ISO timestamp string
                         *
                         *     **Example - Find letters from 1800-1900:**
                         *     ```json
                         *     {
                         *       "$and": [
                         *         { "type": { "$eq": "letter" } },
                         *         { "_year": { "$gte": 1800 } },
                         *         { "_year": { "$lte": 1900 } }
                         *       ]
                         *     }
                         *     ```
                         * @example {
                         *       "_year": {
                         *         "$gt": 1800
                         *       },
                         *       "type": "letter"
                         *     }
                         */
                        filter?: {
                            [key: string]: unknown;
                        };
                        /**
                         * @description Number of collections to search
                         * @default 10
                         */
                        collection_limit?: number;
                        /**
                         * @description Max results per collection
                         * @default 5
                         */
                        per_collection_limit?: number;
                        /**
                         * @description Entity expansion mode. Default: "preview" for lightweight previews, "full" for complete manifests, "none" for no expansion.
                         * @example preview
                         * @enum {string}
                         */
                        expand?: "preview" | "full" | "none";
                    };
                };
            };
            responses: {
                /** @description Discovery results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            results: {
                                id: string;
                                label: string;
                                type: string;
                                score: number;
                                collection_id: string;
                                created_at?: string;
                                updated_at?: string;
                                entity_preview?: components["schemas"]["EntityPreview"] & unknown;
                                entity?: components["schemas"]["EntityResponse"] & unknown;
                            }[];
                            metadata: {
                                query: string;
                                collections_searched: number;
                                result_count: number;
                            };
                        };
                    };
                };
                /** @description Bad Request - Invalid input */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Validation failed",
                         *       "details": {
                         *         "issues": [
                         *           {
                         *             "path": [
                         *               "properties",
                         *               "label"
                         *             ],
                         *             "message": "Required"
                         *           }
                         *         ]
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ValidationErrorResponse"];
                    };
                };
                /** @description Service Unavailable - External service not available */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Service unavailable",
                         *       "details": {
                         *         "service": "pinecone"
                         *       }
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send chat message
         * @description Send a message to the Arke chat agent and receive a streaming response.
         *
         *     The agent can execute Arke API operations on your behalf using the authenticated user's permissions.
         *
         *     ## Headers
         *
         *     - `X-Chat-ID`: Optional. Specify to continue an existing chat session. If omitted, a new session is created.
         *
         *     ## Response Format
         *
         *     The response is a Server-Sent Events (SSE) stream in AI SDK v5 UIMessage format.
         *     Stream chunks include text deltas, tool calls, and usage information.
         *
         *     ## Token Usage Tracking
         *
         *     Usage information is included at the end of the stream in the format:
         *     ```json
         *     {"type":"message_delta","delta":{"usage":{"input_tokens":123,"output_tokens":456}}}
         *     ```
         *
         *     ## Storage Limits
         *
         *     - **Single message**: 2 MB max (returns 413 with code `MESSAGE_TOO_LARGE`)
         *     - **Chat database**: 10 GB max (returns 507 with code `CHAT_STORAGE_FULL`)
         *     - **LLM context**: ~128K tokens (returns stream error)
         *
         *
         *     ---
         *     **Permission:** `chat:send`
         *     **Auth:** required
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["SendChatRequest"];
                };
            };
            responses: {
                /** @description Streaming SSE response */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/event-stream": string;
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Message exceeds 2MB storage limit */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["MessageTooLargeError"];
                    };
                };
                /** @description Chat storage full (10GB limit) */
                507: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChatStorageFullError"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List user chats
         * @description Returns a paginated list of the authenticated user's chats, sorted newest-first.
         *
         *     Only returns chats owned by the authenticated user. Anonymous chats are not indexed.
         *
         *     Query parameters:
         *     - `limit`: Max chats to return (1-100, default 20)
         *     - `offset`: Number of chats to skip for pagination (default 0)
         *
         *     ---
         *     **Permission:** `chat:view`
         *     **Auth:** required
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of user chats */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListChatsResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/sessions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get chat session
         * @description Get information about a chat session including message history.
         *
         *     Only the session owner can view their chat sessions.
         *
         *     ---
         *     **Permission:** `chat:view`
         *     **Auth:** required
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Chat session info */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChatSession"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        /**
         * Delete chat session
         * @description Delete a chat session. Only the session owner can delete it.
         *
         *     ---
         *     **Permission:** `chat:delete`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Session deleted */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChatSessionDeleteResponse"];
                    };
                };
                /** @description Unauthorized - Missing or invalid authentication */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Unauthorized: Missing or invalid authentication token"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/entities/{id}/attestation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get latest attestation
         * @description Returns the Arweave attestation for the current (latest) version of an entity.
         *
         *     Returns 202 Accepted if the attestation upload is still pending.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Attestation found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AttestationResponse"];
                    };
                };
                /** @description Attestation pending */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AttestationPendingResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/versions/{id}/{ver}/attestation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get version attestation
         * @description Returns the Arweave attestation for a specific version of an entity.
         *
         *     ---
         *     **Permission:** `entity:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                    /** @description Version number */
                    ver: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Attestation found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AttestationResponse"];
                    };
                };
                /** @description Forbidden - Insufficient permissions */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Forbidden: You do not have permission to perform this action"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attestations/head": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get chain head
         * @description Returns the latest Arweave attestation transaction ID (network head).
         *
         *     ---
         *     **Permission:** `attestation:view`
         *     **Auth:** none
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Chain head */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChainHeadResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attestations/verify/{tx}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Verify attestation
         * @description Fetches an attestation from Arweave and verifies the CID matches the manifest content.
         *
         *     This is a public endpoint - anyone can verify attestations.
         *
         *     ---
         *     **Permission:** `attestation:verify`
         *     **Auth:** none
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Arweave transaction ID */
                    tx: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Verification result */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["VerifyAttestationResponse"];
                    };
                };
                /** @description Not Found - Resource does not exist */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "error": "Entity not found"
                         *     }
                         */
                        "application/json": components["schemas"]["ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        RegisterUser: {
            /** @example 01J1SHMAE10000000000000000 */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @example {
             *       "label": "Ishmael",
             *       "name": "Ishmael"
             *     }
             */
            properties: {
                [key: string]: unknown;
            };
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
        };
        RegisterResponse: {
            /**
             * @description True if user was created, false if already registered
             * @example true
             */
            created: boolean;
            user: components["schemas"]["RegisterUser"];
        };
        ErrorResponse: {
            /**
             * @description Error message
             * @example Not found
             */
            error: string;
            /** @description Additional error details */
            details?: {
                [key: string]: unknown;
            };
        };
        WhoamiUserResponse: {
            /**
             * @description Identity type
             * @enum {string}
             */
            type: "user";
            /**
             * @description User entity ID
             * @example 01J1SHMAE10000000000000000
             */
            id: string;
            /**
             * @description How this identity was authenticated
             * @example jwt
             * @enum {string}
             */
            auth_method: "jwt" | "api_key";
            /**
             * Format: email
             * @description User email (JWT auth only)
             * @example ishmael@pequod.ship
             */
            email?: string;
            /**
             * @description Display name (JWT auth only)
             * @example Ishmael
             */
            name?: string;
            /**
             * Format: uuid
             * @description Supabase Auth user ID (JWT auth only)
             */
            supabase_user_id?: string;
            /**
             * @description API key prefix (API key auth only)
             * @example uk_abc1
             */
            key_prefix?: string;
            /**
             * Format: date-time
             * @description API key expiration (API key auth only)
             */
            key_expires_at?: string;
        };
        WhoamiAgentResponse: {
            /**
             * @description Identity type
             * @enum {string}
             */
            type: "agent";
            /**
             * @description Agent entity ID
             * @example 01J1AGENTID000000000000000
             */
            id: string;
            /**
             * @description How this identity was authenticated
             * @example api_key
             * @enum {string}
             */
            auth_method: "api_key";
            /**
             * @description Entity ID of the agent owner
             * @example 01J1OWNERID0000000000000000
             */
            owner_id: string;
            /**
             * @description API key prefix
             * @example ak_xyz9
             */
            key_prefix: string;
            /**
             * Format: date-time
             * @description API key expiration
             */
            key_expires_at: string;
        };
        WhoamiResponse: components["schemas"]["WhoamiUserResponse"] | components["schemas"]["WhoamiAgentResponse"];
        AlphaInvite: {
            /**
             * Format: uuid
             * @example a1b2c3d4-e5f6-7890-abcd-ef1234567890
             */
            id: string;
            /**
             * Format: email
             * @example ishmael@pequod.ship
             */
            email: string;
            /** @example admin */
            invited_by: string;
            /**
             * @example pending
             * @enum {string}
             */
            status: "pending" | "accepted" | "revoked" | "waitlisted";
            /** @example 2026-01-28T12:00:00.000Z */
            created_at: string;
            /** @example null */
            accepted_at: string | null;
        };
        CreateAlphaInviteResponse: {
            invite: components["schemas"]["AlphaInvite"];
        };
        CreateAlphaInviteRequest: {
            /**
             * Format: email
             * @description Email address to invite
             * @example ishmael@pequod.ship
             */
            email: string;
            /**
             * @description Who is sending the invite (defaults to "admin")
             * @example admin
             */
            invited_by?: string;
        };
        ListAlphaInvitesResponse: {
            invites: components["schemas"]["AlphaInvite"][];
            /** @example 5 */
            count: number;
        };
        EntityResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /** @example collection */
            type: string;
            /**
             * @example {
             *       "label": "The Pequod's Archive",
             *       "description": "A collection of whaling documents"
             *     }
             */
            properties: {
                [key: string]: unknown;
            };
            relationships: {
                predicate: string;
                peer: string;
                peer_type?: string;
                peer_label?: string;
                properties?: {
                    [key: string]: unknown;
                };
            }[];
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            /**
             * Format: date-time
             * @description ISO 8601 datetime
             * @example 2025-12-26T12:00:00.000Z
             */
            created_at: string;
            /**
             * @description Unix timestamp in milliseconds
             * @example 1735214400000
             */
            ts: number;
            /**
             * @description Audit trail for edits. Label fields are populated when ?expand=relationships is used.
             * @example {
             *       "user_id": "01JCAPTAINAHAB000000000000",
             *       "user_label": "Captain Ahab",
             *       "method": "manual"
             *     }
             */
            edited_by: {
                user_id: string;
                /**
                 * @description Display name of the user/agent (populated during expansion)
                 * @example Captain Ahab
                 */
                user_label?: string;
                /** @enum {string} */
                method: "manual" | "ai_generated" | "system" | "import";
                on_behalf_of?: string;
                /**
                 * @description Display name of the on_behalf_of user/agent (populated during expansion)
                 * @example Research Assistant
                 */
                on_behalf_of_label?: string;
            };
            /**
             * @description Previous version CID (present on updates)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid?: string;
        };
        UserResponse: components["schemas"]["EntityResponse"] & {
            /** @enum {string} */
            type?: "user";
        };
        CreateApiKeyResponse: {
            /**
             * @description Full API key - store this securely, it will not be shown again
             * @example uk_xKj92mNpQrStUvWxYz1234567890abcdef1234567890abcdef12345678
             */
            key: string;
            /**
             * @description Key prefix for identification
             * @example uk_xKj9
             */
            key_prefix: string;
            /**
             * Format: date-time
             * @description When the key expires
             * @example 2026-03-28T00:00:00.000Z
             */
            expires_at: string;
        };
        CreateApiKeyRequest: {
            /**
             * @description Human-readable label for the key
             * @example Production
             */
            label?: string;
            /**
             * @description Time until expiration in seconds (default: 90 days, max: 365 days)
             * @example 7776000
             */
            expires_in?: number;
        };
        ApiKeyInfo: {
            /**
             * @description Key prefix for identification
             * @example uk_xKj9
             */
            key_prefix: string;
            /**
             * @description Human-readable label
             * @example Production
             */
            label: string | null;
            /**
             * Format: date-time
             * @description When the key was created
             * @example 2025-12-28T00:00:00.000Z
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the key expires
             * @example 2026-03-28T00:00:00.000Z
             */
            expires_at: string;
            /**
             * Format: date-time
             * @description When the key was last used (null if never used)
             * @example 2025-12-28T10:30:00.000Z
             */
            last_used_at: string | null;
        };
        ListApiKeysResponse: {
            /** @description List of API keys */
            keys: components["schemas"]["ApiKeyInfo"][];
        };
        UserCollectionItem: {
            /**
             * @description Collection ID
             * @example 01JCOLLECTION123456789AB
             */
            id: string;
            /**
             * @description Collection label/name
             * @example My Research Collection
             */
            label: string;
            /**
             * @description Role predicate indicating user's relationship to collection
             * @example owner
             */
            predicate: string;
            /**
             * @description When the collection was created
             * @example 2026-01-12T00:00:00.000Z
             */
            created_at: string;
        };
        UserCollectionsResponse: {
            /**
             * @description User persistent identifier
             * @example 01JUSER123456789ABCDEFGH
             */
            user_id: string;
            /** @description Collections the user has access to */
            collections: components["schemas"]["UserCollectionItem"][];
            /** @description Pagination metadata */
            pagination: {
                /** @description Current offset */
                offset: number;
                /** @description Results per page */
                limit: number;
                /** @description Number of results returned */
                count: number;
                /** @description Whether more results exist */
                has_more: boolean;
            };
        };
        /**
         * @description Lightweight entity preview with fresh data. Included by default (expand: "preview").
         * @example {
         *       "id": "01KDETYWYWM0MJVKM8DK3AEXPY",
         *       "type": "file",
         *       "label": "Research Paper.pdf",
         *       "collection_id": "01JCOLLECTION123456789AB",
         *       "description_preview": "A comprehensive study on distributed systems architecture...",
         *       "created_at": "2026-01-12T00:00:00.000Z",
         *       "updated_at": "2026-01-12T10:30:00.000Z"
         *     }
         */
        EntityPreview: {
            /**
             * @description Entity ID (persistent identifier)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Entity type
             * @example document
             */
            type: string;
            /**
             * @description Entity label (from properties.label, filename, or name)
             * @example Research Paper.pdf
             */
            label: string;
            /**
             * @description Collection ID this entity belongs to
             * @example 01JCOLLECTION123456789ABCD
             */
            collection_id?: string;
            /**
             * @description Truncated description (max 200 chars + "...")
             * @example This document contains research findings from the 2025 study on entity management systems. It covers key architectural decisions and performance benchmarks...
             */
            description_preview?: string;
            /**
             * @description Truncated text content (max 200 chars + "...")
             * @example Introduction: The rise of decentralized entity management systems has created new challenges for data integrity and consistency. This paper explores...
             */
            text_preview?: string;
            /**
             * @description Entity creation timestamp (ISO 8601)
             * @example 2025-01-15T10:00:00.000Z
             */
            created_at: string;
            /**
             * @description Last update timestamp (ISO 8601)
             * @example 2025-01-20T14:30:00.000Z
             */
            updated_at: string;
        };
        SearchResultItem: {
            /**
             * @description Entity ID
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Entity type
             * @example file
             */
            type: string;
            /**
             * @description Entity label/name
             * @example Research Paper.pdf
             */
            label: string;
            /**
             * @description Collection this entity belongs to (null for public-domain)
             * @example 01JCOLLECTION123456789AB
             */
            collection_id: string | null;
            /**
             * @description Relevance score (0-1, higher is better)
             * @example 0.87
             */
            score: number;
            /**
             * @description When the entity was created
             * @example 2026-01-12T00:00:00.000Z
             */
            created_at?: string;
            /**
             * @description When the entity was last updated
             * @example 2026-01-12T10:30:00.000Z
             */
            updated_at?: string;
            entity_preview?: components["schemas"]["EntityPreview"];
            entity?: components["schemas"]["EntityResponse"] & unknown;
        };
        /** @description Search metadata and statistics */
        SearchMetadata: {
            /** @description Original search query */
            query: string;
            /** @description Number of collections searched */
            collections_queried: number;
            /** @description Total collections user has access to */
            collections_total: number;
            /** @description Whether public-domain was included */
            include_public: boolean;
            /** @description Total execution time in milliseconds */
            execution_time_ms: number;
            /** @description Number of results returned */
            result_count: number;
        };
        CrossCollectionSearchResponse: {
            /** @description Search results ranked by relevance */
            results: components["schemas"]["SearchResultItem"][];
            metadata: components["schemas"]["SearchMetadata"];
        };
        ValidationErrorResponse: {
            /** @example Validation failed */
            error: string;
            details?: {
                issues: {
                    path: (string | number)[];
                    message: string;
                }[];
            };
        };
        CrossCollectionSearchRequest: {
            /**
             * @description Search query text for semantic matching
             * @example medical research
             */
            query: string;
            /**
             * @description Filter results to specific entity type
             * @example file
             */
            type?: string;
            /**
             * @description Filter collections by user role (only search collections where user has this role)
             * @example owner
             * @enum {string}
             */
            role?: "owner" | "editor" | "viewer";
            /**
             * @description Include results from public-domain namespace (default: false)
             * @default false
             * @example false
             */
            include_public: boolean;
            /**
             * @description Maximum number of results to return (default: 20, max: 100)
             * @default 20
             * @example 50
             */
            limit: number;
            /**
             * @description Entity expansion mode. Default: "preview" for lightweight previews, "full" for complete manifests, "none" for no expansion.
             * @example preview
             * @enum {string}
             */
            expand?: "preview" | "full" | "none";
        };
        CollectionResponse: components["schemas"]["EntityResponse"] & {
            /** @enum {string} */
            type?: "collection";
        };
        CreateCollectionRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /** @description Custom entity ID (generated if not provided) */
            id?: string;
            /**
             * @description Collection display name
             * @example The Pequod's Archive
             */
            label: string;
            /**
             * @description Collection description
             * @example Documents and manuscripts related to the voyage of the Pequod
             */
            description?: string;
            /**
             * Format: uri
             * @description URL for collection display image
             */
            display_image_url?: string;
            /**
             * @description Whether to merge with default roles (true) or use only provided roles (false). Public role with *:view is always ensured.
             * @default true
             */
            use_roles_default?: boolean | null;
            /**
             * @description Role definitions. When use_roles_default is true (default), these merge with defaults. When false, these replace defaults entirely.
             * @example {
             *       "public": [
             *         "*:view",
             *         "*:invoke"
             *       ]
             *     }
             */
            roles?: {
                [key: string]: string[];
            };
            /** @description Additional properties to store */
            properties?: {
                [key: string]: unknown;
            };
            /** @description Initial relationships */
            relationships?: {
                predicate: string;
                peer: string;
                peer_type?: string;
                peer_label?: string;
                properties?: {
                    [key: string]: unknown;
                };
            }[];
        };
        CollectionUpdateResponse: components["schemas"]["CollectionResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        CASErrorResponse: {
            /** @enum {string} */
            error: "Conflict: entity was modified";
            details: {
                /** @description Expected tip CID */
                expected: string;
                /** @description Actual current tip CID */
                actual: string;
            };
        };
        UpdateCollectionRequest: {
            /**
             * @description Current tip CID for CAS validation. Request fails with 409 if this does not match.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /** @description Properties to add or update (deep merged) */
            properties?: {
                [key: string]: unknown;
            };
            /** @description Properties to remove. Use string[] for top-level keys (e.g., ["old_field"]), or nested objects for deep removal (e.g., { config: { options: ["debug"] } }). Dot notation like "config.options.debug" is NOT supported. */
            properties_remove?: string[] | {
                [key: string]: unknown;
            };
            /** @description Relationships to add or update (upsert semantics) */
            relationships_add?: {
                /**
                 * @description Relationship predicate (e.g., "admin", "contains", "collection")
                 * @example admin
                 */
                predicate: string;
                /**
                 * @description Target entity ID
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                peer: string;
                /**
                 * @description Target entity type hint
                 * @example user
                 */
                peer_type?: string;
                /**
                 * @description Target entity label hint
                 * @example Captain Ahab
                 */
                peer_label?: string;
                /**
                 * @description Properties to add/update on this relationship (deep merged if relationship exists)
                 * @example {
                 *       "expires_at": "2025-12-31T00:00:00Z"
                 *     }
                 */
                properties?: {
                    [key: string]: unknown;
                };
                /** @description Properties to remove from this relationship (string array or nested object) */
                properties_remove?: string[] | {
                    [key: string]: unknown;
                };
            }[];
            /** @description Relationships to remove */
            relationships_remove?: {
                /**
                 * @description Relationship predicate
                 * @example viewer
                 */
                predicate: string;
                /**
                 * @description Target entity ID. If omitted, removes ALL relationships with this predicate.
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                peer?: string;
            }[];
            /** @description Updated collection display name */
            label?: string;
            /** @description Updated collection description */
            description?: string;
            /**
             * Format: uri
             * @description Updated display image URL
             */
            display_image_url?: string;
        };
        RoleResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            /**
             * @description Role definitions mapping role names to action arrays
             * @example {
             *       "captain": [
             *         "*:view",
             *         "*:update",
             *         "*:create",
             *         "collection:manage"
             *       ],
             *       "harpooner": [
             *         "*:view",
             *         "*:update",
             *         "*:create"
             *       ],
             *       "crew": [
             *         "*:view",
             *         "entity:create"
             *       ],
             *       "public": [
             *         "entity:view",
             *         "collection:view"
             *       ]
             *     }
             */
            roles: {
                [key: string]: string[];
            };
        };
        AddRoleRequest: {
            /**
             * @description Name of the new role
             * @example harpooner
             */
            role: string;
            /**
             * @description Actions this role can perform
             * @example [
             *       "entity:view",
             *       "entity:create",
             *       "entity:update"
             *     ]
             */
            actions: string[];
        };
        UpdateRoleRequest: {
            /**
             * @description Updated actions for this role
             * @example [
             *       "entity:view",
             *       "entity:create",
             *       "entity:update",
             *       "entity:delete"
             *     ]
             */
            actions: string[];
        };
        CollectionMember: {
            userId: string;
            role: string;
            userLabel?: string;
            /**
             * Format: date-time
             * @description ISO 8601 timestamp when this membership expires (omitted for permanent)
             */
            expires_at?: string;
            /**
             * Format: date-time
             * @description ISO 8601 timestamp when this membership was granted
             */
            granted_at?: string;
            /** @description User who granted this membership */
            granted_by?: string;
            /** @description Whether this membership has expired */
            is_expired: boolean;
        };
        CollectionGroup: {
            groupId: string;
            role: string;
            groupLabel?: string;
        };
        CollectionWildcard: {
            role: string;
        };
        MembersResponse: {
            collection_id: string;
            members: components["schemas"]["CollectionMember"][];
            groups: components["schemas"]["CollectionGroup"][];
            wildcards: components["schemas"]["CollectionWildcard"][];
        };
        MemberAssignResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            member_added: {
                user_id: string;
                role: string;
                /**
                 * Format: date-time
                 * @description ISO 8601 timestamp when this role expires (omitted for permanent)
                 * @example 2025-01-15T00:00:00.000Z
                 */
                expires_at?: string;
                /**
                 * Format: date-time
                 * @description ISO 8601 timestamp when this role was granted
                 * @example 2025-01-01T12:00:00.000Z
                 */
                granted_at: string;
                /** @description User who granted this role */
                granted_by: string;
            };
        };
        AssignRoleRequest: {
            /**
             * @description User entity ID to assign the role to
             * @example 01JQ3EQ3EG000000000000000
             */
            user_id: string;
            /**
             * @description Role name to assign
             * @example harpooner
             */
            role: string;
            /**
             * @description Seconds until this role assignment expires (omit for permanent access)
             * @example 86400
             */
            expires_in?: number;
        };
        MemberRemoveResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            member_removed: {
                user_id: string;
                role: string;
            };
        };
        SetRootEntityResponse: components["schemas"]["CollectionUpdateResponse"] & {
            /** @description ID of the entity that was set as root */
            root_entity_id: string;
        };
        SetRootEntityRequest: {
            /**
             * @description Current tip CID for CAS validation. Request fails with 409 if this does not match.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Entity ID to set as the root of this collection. Entity must already have a collection relationship pointing to this collection.
             * @example 01JQ3EQ3EG000000000000000
             */
            entity_id: string;
        };
        CollectionEntitySummary: {
            /** @description Entity ID */
            id: string;
            /**
             * @description Entity type
             * @example document
             */
            type: string;
            /**
             * @description Entity display label (from GraphDB, may be stale)
             * @example My Document
             */
            label: string;
            /**
             * Format: date-time
             * @description When the entity was created
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the entity was last updated (from GraphDB)
             */
            updated_at: string;
            preview?: components["schemas"]["EntityPreview"] & unknown;
            entity?: components["schemas"]["EntityResponse"] & unknown;
        };
        CollectionEntitiesResponse: {
            /** @description Collection ID */
            collection_id: string;
            /** @description Entities in this collection */
            entities: components["schemas"]["CollectionEntitySummary"][];
            /** @description Pagination info */
            pagination: {
                /** @description Current offset */
                offset: number;
                /** @description Requested limit */
                limit: number;
                /** @description Number of entities returned */
                count: number;
                /** @description Whether more entities exist beyond this page */
                has_more: boolean;
            };
        };
        EntityIndexEntry: {
            /** @description Entity persistent identifier */
            id: string;
            /**
             * @description Entity type
             * @example person
             */
            type: string;
            /**
             * @description Entity display label
             * @example Captain Ahab
             */
            label: string | null;
            /**
             * Format: date-time
             * @description When the entity was created
             */
            created_at: string;
            /**
             * Format: date-time
             * @description When the entity was last updated
             */
            updated_at: string;
        };
        CollectionEntityLookupResponse: {
            /** @description Collection ID */
            collection_id: string;
            /** @description Matching entities */
            entities: components["schemas"]["EntityIndexEntry"][];
            /** @description Number of entities returned */
            count: number;
        };
        CollectionEntitySearchResult: components["schemas"]["EntityIndexEntry"] & {
            /**
             * @description Similarity score (only present for semantic search via similar_to)
             * @example 0.87
             */
            score?: number;
        };
        CollectionEntitySearchResponse: {
            /** @description Collection ID */
            collection_id: string;
            /** @description Original search query (for keyword search) */
            query?: string;
            /** @description Source entity ID (for similarity search) */
            similar_to?: string;
            /** @description Matching entities */
            entities: components["schemas"]["CollectionEntitySearchResult"][];
            /** @description Number of entities returned */
            count: number;
        };
        EntityCreatedResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /** @example collection */
            type: string;
            /**
             * @example {
             *       "label": "The Pequod's Archive",
             *       "description": "A collection of whaling documents"
             *     }
             */
            properties: {
                [key: string]: unknown;
            };
            relationships: {
                predicate: string;
                peer: string;
                peer_type?: string;
                peer_label?: string;
                properties?: {
                    [key: string]: unknown;
                };
            }[];
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            /**
             * Format: date-time
             * @description ISO 8601 datetime
             * @example 2025-12-26T12:00:00.000Z
             */
            created_at: string;
            /**
             * @description Unix timestamp in milliseconds
             * @example 1735214400000
             */
            ts: number;
            /**
             * @description Audit trail for edits. Label fields are populated when ?expand=relationships is used.
             * @example {
             *       "user_id": "01JCAPTAINAHAB000000000000",
             *       "user_label": "Captain Ahab",
             *       "method": "manual"
             *     }
             */
            edited_by: {
                user_id: string;
                /**
                 * @description Display name of the user/agent (populated during expansion)
                 * @example Captain Ahab
                 */
                user_label?: string;
                /** @enum {string} */
                method: "manual" | "ai_generated" | "system" | "import";
                on_behalf_of?: string;
                /**
                 * @description Display name of the on_behalf_of user/agent (populated during expansion)
                 * @example Research Assistant
                 */
                on_behalf_of_label?: string;
            };
            /**
             * @description Previous version CID (present on updates)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid?: string;
        };
        CreateEntityRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /**
             * @description Custom entity ID (generated if not provided)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id?: string;
            /**
             * @description Entity type identifier
             * @example document
             */
            type: string;
            /**
             * @description Entity properties (type-specific). Text properties may contain inline entity references using the arke: URI scheme (e.g., [Label](arke:01JENTITY123...)) for domain-agnostic linking.
             * @example {
             *       "label": "Chapter 1: Loomings",
             *       "author": "Herman Melville"
             *     }
             */
            properties?: {
                [key: string]: unknown;
            };
            /** @description Entity relationships */
            relationships?: {
                predicate: string;
                peer: string;
                peer_type?: string;
                peer_label?: string;
                properties?: {
                    [key: string]: unknown;
                };
            }[];
            /**
             * @description Parent collection ID (creates collection relationship)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            collection?: string;
            /**
             * @description Wait for collection index update before returning. Use when checking for duplicates immediately after creation. Adds ~1-5ms latency per collection.
             * @default false
             */
            sync_index?: boolean | null;
        };
        BatchCreateSuccess: {
            /** @enum {boolean} */
            success: true;
            index: number;
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            type: string;
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
        };
        BatchCreateFailure: {
            /** @enum {boolean} */
            success: false;
            index: number;
            error: string;
            code: string;
        };
        BatchCreateEntityResponse: {
            results: (components["schemas"]["BatchCreateSuccess"] | components["schemas"]["BatchCreateFailure"])[];
            summary: {
                total: number;
                succeeded: number;
                failed: number;
            };
        };
        BatchCreateEntityItem: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /** @description Entity type identifier */
            type: string;
            /** @description Entity properties */
            properties?: {
                [key: string]: unknown;
            };
            /** @description Entity relationships */
            relationships?: {
                predicate: string;
                peer: string;
                peer_type?: string;
                peer_label?: string;
                properties?: {
                    [key: string]: unknown;
                };
            }[];
            /**
             * @description Parent collection ID (creates collection relationship)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            collection?: string;
        };
        BatchCreateEntityRequest: {
            /** @description Array of entities to create (1-100) */
            entities: components["schemas"]["BatchCreateEntityItem"][];
            /**
             * @description Default collection for entities that do not specify one
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            default_collection?: string;
        };
        BatchGetResponse: {
            /** @description Entities that were found and accessible */
            entities: components["schemas"]["EntityResponse"][];
            /** @description IDs that were not found or not accessible */
            not_found: string[];
        };
        BatchGetRequest: {
            /**
             * @description Entity IDs to fetch (max 100)
             * @example [
             *       "01JENTITY123456789012345",
             *       "01JENTITY234567890123456"
             *     ]
             */
            ids: string[];
        };
        TipResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
        };
        EntityUpdatedResponse: components["schemas"]["EntityResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        UpdateEntityRequest: {
            /**
             * @description Current tip CID for CAS validation. Request fails with 409 if this does not match.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /** @description Properties to add or update (deep merged) */
            properties?: {
                [key: string]: unknown;
            };
            /** @description Properties to remove. Use string[] for top-level keys (e.g., ["old_field"]), or nested objects for deep removal (e.g., { config: { options: ["debug"] } }). Dot notation like "config.options.debug" is NOT supported. */
            properties_remove?: string[] | {
                [key: string]: unknown;
            };
            /** @description Relationships to add or update (upsert semantics) */
            relationships_add?: {
                /**
                 * @description Relationship predicate (e.g., "admin", "contains", "collection")
                 * @example admin
                 */
                predicate: string;
                /**
                 * @description Target entity ID
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                peer: string;
                /**
                 * @description Target entity type hint
                 * @example user
                 */
                peer_type?: string;
                /**
                 * @description Target entity label hint
                 * @example Captain Ahab
                 */
                peer_label?: string;
                /**
                 * @description Properties to add/update on this relationship (deep merged if relationship exists)
                 * @example {
                 *       "expires_at": "2025-12-31T00:00:00Z"
                 *     }
                 */
                properties?: {
                    [key: string]: unknown;
                };
                /** @description Properties to remove from this relationship (string array or nested object) */
                properties_remove?: string[] | {
                    [key: string]: unknown;
                };
            }[];
            /** @description Relationships to remove */
            relationships_remove?: {
                /**
                 * @description Relationship predicate
                 * @example viewer
                 */
                predicate: string;
                /**
                 * @description Target entity ID. If omitted, removes ALL relationships with this predicate.
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                peer?: string;
            }[];
            /**
             * @description Wait for collection index update before returning. Use when checking index immediately after update.
             * @default false
             */
            sync_index?: boolean | null;
        };
        EntityDeletedResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * Format: date-time
             * @description ISO timestamp when the entity was deleted
             */
            deleted_at: string;
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        DeleteEntityRequest: {
            /**
             * @description Current tip CID for CAS validation. Request fails with 409 if this does not match.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /**
             * @description Reason for deleting the entity
             * @example Duplicate entry
             */
            reason?: string;
            /**
             * @description Wait for collection index removal before returning. Use when checking index immediately after deletion.
             * @default false
             */
            sync_index?: boolean | null;
        };
        CascadeDeletedEntity: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description Entity type
             * @example file
             */
            type: string;
            /**
             * @description Depth from root entity at which this entity was found
             * @example 1
             */
            depth: number;
        };
        CascadeSkippedEntity: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Entity type
             * @example file
             */
            type: string;
            /**
             * @description Reason an entity was skipped during cascade delete
             * @enum {string}
             */
            reason: "not_in_collection" | "already_deleted" | "edited_by_mismatch" | "cas_conflict";
        };
        CascadeDeleteResponse: {
            root: components["schemas"]["EntityDeletedResponse"] & unknown;
            /** @description Entities successfully deleted (ordered by depth, deepest first) */
            deleted: components["schemas"]["CascadeDeletedEntity"][];
            /** @description Entities skipped during traversal with reasons */
            skipped: components["schemas"]["CascadeSkippedEntity"][];
            /** @description Summary statistics for the cascade delete operation */
            summary: {
                /** @description Total entities visited during BFS traversal */
                total_traversed: number;
                /** @description Total entities successfully deleted (excluding root) */
                total_deleted: number;
                /** @description Total entities skipped during traversal */
                total_skipped: number;
                /** @description Maximum depth reached during traversal */
                max_depth_reached: number;
            };
        };
        CascadeDeleteRequest: {
            /**
             * @description Current tip CID for CAS validation. Request fails with 409 if this does not match.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /**
             * @description Collection to scope the cascade delete. Only entities in this collection will be deleted. Permission check is performed on this collection.
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            collection_id: string;
            /**
             * @description Predicate patterns to follow during cascade traversal. Supports wildcards:
             *     - `"child"` - exact match only
             *     - `"has_*"` - matches has_document, has_image, etc.
             *     - `"*_copy"` - matches file_copy, document_copy, etc.
             *     - `"*"` - matches ALL predicates
             *
             *     **Important:** The `collection` predicate NEVER cascades, even if `"*"` is specified. This protects the collection structure from accidental deletion.
             * @example [
             *       "child",
             *       "has_*"
             *     ]
             */
            cascade_predicates: string[];
            /**
             * @description Only delete entities where edited_by.user_id matches this PI. Useful for cleaning up entities created by a specific agent.
             * @example 01KAGENTXXXXXXXXXXXXXXXX
             */
            edited_by_filter?: string;
            /**
             * @description Maximum relationship depth to traverse (default: 10, max: 20)
             * @default 10
             * @example 10
             */
            max_depth: number;
            /**
             * @description Reason for deleting the entities (applied to all deleted entities)
             * @example Cleanup after agent task
             */
            reason?: string;
        };
        EntityUpdateResponse: components["schemas"]["EntityResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        EntityRestoredResponse: components["schemas"]["EntityUpdateResponse"] & {
            /**
             * @description The version number that was restored from
             * @example 1
             */
            restored_from_ver: number;
        };
        RestoreEntityRequest: {
            /**
             * @description Current tip CID for CAS validation. Request fails with 409 if this does not match.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
        };
        EntityCollectionResponse: {
            /**
             * @description The collection ID this entity belongs to, or null if not in any collection
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            collection_id: string | null;
        };
        /** @description Root node with nested children */
        TreeNode: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /** @description Entity label */
            label: string;
            /** @description Entity type */
            type: string;
            /** @description Depth in tree (0 = root) */
            depth: number;
            /** @description Child nodes (recursive TreeNode array) */
            children: components["schemas"]["TreeNode"][];
        };
        TreeResponse: {
            root: components["schemas"]["TreeNode"];
            /** @description Total number of nodes in the tree */
            total_nodes: number;
            /** @description Whether results were truncated due to limit */
            truncated: boolean;
        };
        /** @description Metadata about the "from" version (null for version 1) */
        VersionMeta: {
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            /**
             * Format: date-time
             * @description ISO 8601 datetime
             * @example 2025-12-26T12:00:00.000Z
             */
            ts: string;
        } | null;
        PropertyChange: {
            /** @description Previous value */
            from?: unknown;
            /** @description New value */
            to?: unknown;
        };
        PropertiesChanges: {
            /**
             * @description Properties that were added
             * @example {
             *       "email": "new@example.com"
             *     }
             */
            added: {
                [key: string]: unknown;
            };
            /**
             * @description Properties that were removed (includes old values)
             * @example {
             *       "deprecated_field": "old value"
             *     }
             */
            removed: {
                [key: string]: unknown;
            };
            /**
             * @description Properties that changed
             * @example {
             *       "name": {
             *         "from": "Old Name",
             *         "to": "New Name"
             *       }
             *     }
             */
            changed: {
                [key: string]: components["schemas"]["PropertyChange"];
            };
        };
        RelationshipChange: {
            predicate: string;
            peer: string;
            peer_type?: string;
            peer_label?: string;
            properties: components["schemas"]["PropertyChange"];
        };
        RelationshipsChanges: {
            /** @description Relationships that were added */
            added: {
                predicate: string;
                peer: string;
                peer_type?: string;
                peer_label?: string;
                properties?: {
                    [key: string]: unknown;
                };
            }[];
            /** @description Relationships that were removed */
            removed: {
                predicate: string;
                peer: string;
                peer_type?: string;
                peer_label?: string;
                properties?: {
                    [key: string]: unknown;
                };
            }[];
            /** @description Relationships with changed properties */
            changed: components["schemas"]["RelationshipChange"][];
        };
        SemanticChanges: {
            properties: components["schemas"]["PropertiesChanges"];
            relationships: components["schemas"]["RelationshipsChanges"];
        };
        SemanticDiffResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            entity_id: string;
            from: components["schemas"]["VersionMeta"];
            to: components["schemas"]["VersionMeta"];
            /** @enum {string} */
            format: "semantic";
            changes: components["schemas"]["SemanticChanges"];
        };
        PatchOperation: {
            /** @enum {string} */
            op: "add";
            path: string;
            value?: unknown;
        } | {
            /** @enum {string} */
            op: "remove";
            path: string;
        } | {
            /** @enum {string} */
            op: "replace";
            path: string;
            value?: unknown;
        };
        PatchDiffResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            entity_id: string;
            from: components["schemas"]["VersionMeta"];
            to: components["schemas"]["VersionMeta"];
            /** @enum {string} */
            format: "patch";
            /** @description RFC 6902 JSON Patch operations */
            patch: components["schemas"]["PatchOperation"][];
        };
        DiffResponse: components["schemas"]["SemanticDiffResponse"] | components["schemas"]["PatchDiffResponse"];
        /** @description How permissions were resolved */
        PermissionResolution: {
            /**
             * @description How permissions were resolved
             * @example collection
             * @enum {string}
             */
            method: "collection" | "self" | "open_season";
            /**
             * @description Collection ID if permissions come from a collection role
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            collection_id?: string;
            /**
             * @description Role name in the collection
             * @example editor
             */
            role?: string;
        };
        EntityPermissionsResponse: {
            /**
             * @description The entity ID
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            entity_id: string;
            /**
             * @description The entity type
             * @example file
             */
            entity_type: string;
            /**
             * @description Actions the user can perform on this entity
             * @example [
             *       "entity:view",
             *       "entity:update"
             *     ]
             */
            allowed_actions: string[];
            resolution: components["schemas"]["PermissionResolution"];
        };
        /** @description Content metadata */
        ContentMetadata: {
            /**
             * @description Version key for this content
             * @example v1
             */
            key: string;
            /**
             * @description Content-addressed identifier (CID) of the content
             * @example bafyreih5iy6dqwbcslkqpx6bxwj7qy3z5x...
             */
            cid: string;
            /**
             * @description Content size in bytes
             * @example 12345
             */
            size: number;
            /**
             * @description MIME type of the content
             * @example application/pdf
             */
            content_type: string;
            /**
             * @description Original filename
             * @example document.pdf
             */
            filename?: string;
            /**
             * @description ISO 8601 timestamp when content was uploaded
             * @example 2025-01-15T10:00:00Z
             */
            uploaded_at: string;
        };
        UploadContentResponse: {
            /**
             * @description Entity ID
             * @example 01KABC123...
             */
            id: string;
            /**
             * @description New entity manifest CID after update
             * @example bafyrei...
             */
            cid: string;
            content: components["schemas"]["ContentMetadata"];
            /**
             * @description Previous entity manifest CID
             * @example bafyrei...
             */
            prev_cid: string;
        };
        GetUploadUrlResponse: {
            /**
             * Format: uri
             * @description Presigned URL for direct PUT upload to R2
             * @example https://xxx.r2.cloudflarestorage.com/...
             */
            upload_url: string;
            /**
             * @description R2 storage key (for reference)
             * @example 01KABC123.../v1
             */
            r2_key: string;
            /**
             * Format: date-time
             * @description ISO 8601 timestamp when the URL expires
             * @example 2025-01-15T10:15:00Z
             */
            expires_at: string;
        };
        GetUploadUrlRequest: {
            /**
             * @description Content-addressed identifier (computed by client before upload)
             * @example bafyreih5iy6dqwbcslkqpx6bxwj7qy3z5x...
             */
            cid: string;
            /**
             * @description MIME type of the content to upload
             * @example application/pdf
             */
            content_type: string;
            /**
             * @description Expected file size in bytes (max 500 MB)
             * @example 10485760
             */
            size: number;
        };
        CompleteUploadResponse: {
            /**
             * @description Entity ID
             * @example 01KABC123...
             */
            id: string;
            /**
             * @description New entity manifest CID after update
             * @example bafyrei...
             */
            cid: string;
            content: components["schemas"]["ContentMetadata"] & unknown;
            /**
             * @description Previous entity manifest CID
             * @example bafyrei...
             */
            prev_cid: string;
        };
        CompleteUploadRequest: {
            /**
             * @description Version key used in upload-url request
             * @example v1
             */
            key: string;
            /**
             * @description Content-addressed identifier computed by client
             * @example bafyreih5iy6dqwbcslkqpx6bxwj7qy3z5x...
             */
            cid: string;
            /**
             * @description Actual file size in bytes
             * @example 10485760
             */
            size: number;
            /**
             * @description MIME type of the uploaded content
             * @example application/pdf
             */
            content_type: string;
            /**
             * @description Original filename for Content-Disposition
             * @example document.pdf
             */
            filename?: string;
            /**
             * @description Expected current tip CID for CAS protection
             * @example bafyrei...
             */
            expect_tip: string;
        };
        DeleteContentResponse: {
            /**
             * @description Entity ID
             * @example 01KABC123...
             */
            id: string;
            /**
             * @description New entity manifest CID after update
             * @example bafyrei...
             */
            cid: string;
            /**
             * @description Content key that was removed
             * @example thumbnail
             */
            removed_key: string;
            /**
             * @description Previous entity manifest CID
             * @example bafyrei...
             */
            prev_cid: string;
        };
        RenameContentKeyResponse: {
            /**
             * @description Entity ID
             * @example 01KABC123...
             */
            id: string;
            /**
             * @description New entity manifest CID after update
             * @example bafyrei...
             */
            cid: string;
            /**
             * @description Previous key name
             * @example thumbnail
             */
            old_key: string;
            /**
             * @description New key name
             * @example thumbnail_v1
             */
            new_key: string;
            /**
             * @description CID of the content (unchanged)
             * @example bafyreih5iy6dqwbcslkqpx6bxwj7qy3z5x...
             */
            content_cid: string;
            /**
             * @description Previous entity manifest CID
             * @example bafyrei...
             */
            prev_cid: string;
        };
        RenameContentKeyRequest: {
            /**
             * @description Current content key to rename
             * @example thumbnail
             */
            old_key: string;
            /**
             * @description New key name
             * @example thumbnail_v1
             */
            new_key: string;
            /**
             * @description Expected current tip CID for CAS protection
             * @example bafyrei...
             */
            expect_tip: string;
        };
        QueueItem: {
            /**
             * @description Queue item ID
             * @example 1
             */
            id: number;
            /**
             * @description Actor who queued the update
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            actor_id: string;
            /**
             * @description Current status of the queue item
             * @example pending
             * @enum {string}
             */
            status: "pending" | "processing" | "failed" | "completed";
            /**
             * @description Number of relationships in this update
             * @example 5
             */
            relationships_count: number;
            /**
             * @description Summary of relationships (predicate + peer)
             * @example [
             *       {
             *         "predicate": "sent_to",
             *         "peer": "01KDETYWYWM0MJVKM8DK3AEXPY"
             *       }
             *     ]
             */
            relationships_summary: {
                predicate: string;
                peer: string;
            }[];
            /**
             * @description Top-level property keys being updated
             * @example [
             *       "extracted",
             *       "metadata"
             *     ]
             */
            properties_keys: string[];
            /**
             * @description Optional note for the update
             * @example Extracted by kg-dedupe-resolver
             */
            note: string | null;
            /**
             * @description Error message if failed
             * @example CAS conflict after 20 attempts
             */
            error: string | null;
            /**
             * @description Number of processing attempts
             * @example 3
             */
            attempts: number;
            /**
             * @description ISO timestamp when queued
             * @example 2024-01-15T10:30:00.000Z
             */
            queued_at: string;
        };
        QueueStatusResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            entity_id: string;
            /** @description Count of items by status */
            counts: {
                pending: number;
                processing: number;
                failed: number;
            };
            /** @description Detailed queue items (most recent first, max 100) */
            items: components["schemas"]["QueueItem"][];
        };
        QueuedUpdateInfo: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            entity_id: string;
            /**
             * @description Queue ID for tracking (unique within entity)
             * @example 1
             */
            queue_id: number;
        };
        FailedUpdateInfo: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            entity_id: string;
            /**
             * @description Error message explaining why queueing failed
             * @example Entity not found
             */
            error: string;
        };
        BatchSummary: {
            /**
             * @description Total updates submitted
             * @example 10
             */
            total: number;
            /**
             * @description Updates successfully queued
             * @example 9
             */
            queued: number;
            /**
             * @description Updates that failed to queue
             * @example 1
             */
            failed: number;
        };
        AdditiveUpdatesResponse: {
            /** @description Successfully queued updates */
            queued: components["schemas"]["QueuedUpdateInfo"][];
            /** @description Updates that failed to queue (e.g., infrastructure errors) */
            failed: components["schemas"]["FailedUpdateInfo"][];
            summary: components["schemas"]["BatchSummary"];
        };
        AdditiveUpdateItem: {
            /**
             * @description Entity ID to update
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            entity_id: string;
            /**
             * @description Properties to merge (deep merge semantics). Later values overwrite earlier for same keys.
             * @example {
             *       "extracted": {
             *         "keywords": [
             *           "whaling",
             *           "voyage"
             *         ]
             *       }
             *     }
             */
            properties?: {
                [key: string]: unknown;
            };
            /**
             * @description Relationships to add (upsert by predicate+peer). Properties are merged if relationship exists.
             * @example [
             *       {
             *         "predicate": "mentions",
             *         "peer": "01KDETYWYWM0MJVKM8DK3AEXPY",
             *         "peer_type": "person"
             *       }
             *     ]
             */
            relationships_add?: {
                /**
                 * @description Relationship predicate (e.g., "admin", "contains", "collection")
                 * @example admin
                 */
                predicate: string;
                /**
                 * @description Target entity ID
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                peer: string;
                /**
                 * @description Target entity type hint
                 * @example user
                 */
                peer_type?: string;
                /**
                 * @description Target entity label hint
                 * @example Captain Ahab
                 */
                peer_label?: string;
                /**
                 * @description Properties to add/update on this relationship (deep merged if relationship exists)
                 * @example {
                 *       "expires_at": "2025-12-31T00:00:00Z"
                 *     }
                 */
                properties?: {
                    [key: string]: unknown;
                };
                /** @description Properties to remove from this relationship (string array or nested object) */
                properties_remove?: string[] | {
                    [key: string]: unknown;
                };
            }[];
            /**
             * @description Optional note for this update (preserved in version history)
             * @example Extracted by document indexer
             */
            note?: string;
        };
        AdditiveUpdatesRequest: {
            /** @description Updates to queue (1-1000 items). Updates to the same entity from the same actor are merged. */
            updates: components["schemas"]["AdditiveUpdateItem"][];
        };
        VersionInfo: {
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * Format: date-time
             * @description ISO 8601 datetime
             * @example 2025-12-26T12:00:00.000Z
             */
            ts: string;
            /**
             * @description Audit trail for edits. Label fields are populated when ?expand=relationships is used.
             * @example {
             *       "user_id": "01JCAPTAINAHAB000000000000",
             *       "user_label": "Captain Ahab",
             *       "method": "manual"
             *     }
             */
            edited_by: {
                user_id: string;
                /**
                 * @description Display name of the user/agent (populated during expansion)
                 * @example Captain Ahab
                 */
                user_label?: string;
                /** @enum {string} */
                method: "manual" | "ai_generated" | "system" | "import";
                on_behalf_of?: string;
                /**
                 * @description Display name of the on_behalf_of user/agent (populated during expansion)
                 * @example Research Assistant
                 */
                on_behalf_of_label?: string;
            };
            /** @description Optional note describing this version */
            note?: string;
            /**
             * @description Arweave transaction ID if this version has been attested
             * @example abc123xyz...
             */
            arweave_tx?: string;
            /**
             * Format: uri
             * @description Arweave gateway URL for the attestation
             * @example https://arweave.net/abc123xyz...
             */
            arweave_url?: string;
        };
        VersionListResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            entity_id: string;
            /** @description Version metadata array (newest first) */
            versions: components["schemas"]["VersionInfo"][];
            /** @description Whether more versions exist beyond this page */
            has_more: boolean;
            /**
             * @description CID to use as "from" parameter for next page
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            next_cursor: string | null;
        };
        ManifestResponse: {
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /** @description The full manifest at this version */
            manifest: {
                /** @example arke/eidos@v1 */
                schema: string;
                /**
                 * @description Entity ID (ULID format)
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                id: string;
                /** @example document */
                type: string;
                /**
                 * Format: date-time
                 * @description ISO 8601 datetime
                 * @example 2025-12-26T12:00:00.000Z
                 */
                created_at: string;
                /**
                 * @description Entity version number
                 * @example 1
                 */
                ver: number;
                /**
                 * Format: date-time
                 * @description ISO 8601 datetime
                 * @example 2025-12-26T12:00:00.000Z
                 */
                ts: string;
                /**
                 * @description IPLD link to previous version (null for v1)
                 * @example {
                 *       "/": "bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy"
                 *     }
                 */
                prev: {
                    "/": string;
                } | null;
                /** @description Entity properties */
                properties: {
                    [key: string]: unknown;
                };
                relationships: {
                    predicate: string;
                    peer: string;
                    peer_type?: string;
                    peer_label?: string;
                    properties?: {
                        [key: string]: unknown;
                    };
                }[];
                /**
                 * @description Audit trail for edits. Label fields are populated when ?expand=relationships is used.
                 * @example {
                 *       "user_id": "01JCAPTAINAHAB000000000000",
                 *       "user_label": "Captain Ahab",
                 *       "method": "manual"
                 *     }
                 */
                edited_by: {
                    user_id: string;
                    /**
                     * @description Display name of the user/agent (populated during expansion)
                     * @example Captain Ahab
                     */
                    user_label?: string;
                    /** @enum {string} */
                    method: "manual" | "ai_generated" | "system" | "import";
                    on_behalf_of?: string;
                    /**
                     * @description Display name of the on_behalf_of user/agent (populated during expansion)
                     * @example Research Assistant
                     */
                    on_behalf_of_label?: string;
                };
                note?: string;
            };
        };
        TypeRestriction: {
            /**
             * @description The type with restricted implications
             * @example collection
             */
            type: string;
            /**
             * @description Verbs for which the base type DOES imply this type
             * @example [
             *       "view"
             *     ]
             */
            allowed_verbs: string[];
            /** @description Explanation of the restriction */
            description: string;
        };
        /** @description Type hierarchy. The base type implies all other types, with restrictions for certain types. */
        TypeHierarchy: {
            /**
             * @description The base type that implies all other types
             * @example entity
             */
            base_type: string;
            /** @description Explanation of type hierarchy behavior */
            description: string;
            /** @description Types with restricted implication rules */
            restrictions: components["schemas"]["TypeRestriction"][];
        };
        /** @description Verb wildcard pattern (*:verb) */
        WildcardInfo: {
            /**
             * @description The wildcard pattern format
             * @example *:{verb}
             */
            pattern: string;
            /**
             * @description An example of the pattern in use
             * @example *:view
             */
            example: string;
            /** @description Explanation of what this pattern matches */
            description: string;
        };
        PermissionsResponse: {
            /**
             * @description All registered action strings in the system
             * @example [
             *       "entity:view",
             *       "entity:create",
             *       "entity:update"
             *     ]
             */
            actions: string[];
            /**
             * @description All unique verbs (the part after the colon)
             * @example [
             *       "view",
             *       "create",
             *       "update",
             *       "delete"
             *     ]
             */
            verbs: string[];
            /**
             * @description All unique types (the part before the colon)
             * @example [
             *       "entity",
             *       "user",
             *       "collection"
             *     ]
             */
            types: string[];
            /**
             * @description Verb implications. If you have a verb, you also have its implied verbs. Example: update implies delete.
             * @example {
             *       "update": [
             *         "delete"
             *       ],
             *       "manage": [
             *         "view",
             *         "create",
             *         "update",
             *         "delete"
             *       ]
             *     }
             */
            implications: {
                [key: string]: string[];
            };
            type_hierarchy: components["schemas"]["TypeHierarchy"];
            /** @description Wildcard pattern documentation */
            wildcards: {
                verb: components["schemas"]["WildcardInfo"];
                type: components["schemas"]["WildcardInfo"] & unknown;
            };
            /**
             * @description Security restrictions and special rules
             * @example [
             *       "collection:* is not allowed - use explicit collection actions"
             *     ]
             */
            restrictions: string[];
            /**
             * @description Default role definitions used when creating new collections
             * @example {
             *       "owner": [
             *         "*:view",
             *         "*:update",
             *         "*:create",
             *         "collection:manage"
             *       ],
             *       "viewer": [
             *         "*:view"
             *       ]
             *     }
             */
            default_roles: {
                [key: string]: string[];
            };
        };
        KladosResponse: components["schemas"]["EntityResponse"] & {
            /** @enum {string} */
            type?: "klados";
        };
        CreateKladosRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /** @description Custom entity ID (generated if not provided) */
            id?: string;
            /**
             * @description Klados display name
             * @example PDF Text Extractor
             */
            label: string;
            /**
             * Format: uri
             * @description Klados service base URL
             * @example https://pdf-extractor.example.com/v1
             */
            endpoint: string;
            /**
             * @description Actions this klados requires on target collections
             * @example [
             *       "entity:view",
             *       "entity:update",
             *       "entity:create"
             *     ]
             */
            actions_required: string[];
            /**
             * ContractSpec
             * @description What this klados accepts as input
             */
            accepts: {
                /**
                 * @description Content types (use ["*"] for any)
                 * @example [
                 *       "file/pdf",
                 *       "file/png"
                 *     ]
                 */
                types: string[];
                /**
                 * @description Cardinality: one for single entity, many for multiple
                 * @example one
                 * @enum {string}
                 */
                cardinality: "one" | "many";
            };
            /**
             * ContractSpec
             * @description What this klados produces as output
             */
            produces: {
                /**
                 * @description Content types (use ["*"] for any)
                 * @example [
                 *       "file/pdf",
                 *       "file/png"
                 *     ]
                 */
                types: string[];
                /**
                 * @description Cardinality: one for single entity, many for multiple
                 * @example one
                 * @enum {string}
                 */
                cardinality: "one" | "many";
            };
            /** @description Collection to place klados in */
            collection: string;
            /**
             * @description Klados description
             * @example Extracts text content from PDF files
             */
            description?: string;
            /** @description JSON Schema for input validation */
            input_schema?: {
                [key: string]: unknown;
            };
            /** @description Additional properties to store */
            properties?: {
                [key: string]: unknown;
            };
            /** @description Relationships to create */
            relationships?: {
                predicate: string;
                peer: string;
                peer_type?: string;
                peer_label?: string;
                properties?: {
                    [key: string]: unknown;
                };
            }[];
        };
        KladosUpdateResponse: components["schemas"]["KladosResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        UpdateKladosRequest: {
            /**
             * @description Current tip CID for CAS validation. Request fails with 409 if this does not match.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /** @description Properties to add or update (deep merged) */
            properties?: {
                [key: string]: unknown;
            };
            /** @description Properties to remove. Use string[] for top-level keys (e.g., ["old_field"]), or nested objects for deep removal (e.g., { config: { options: ["debug"] } }). Dot notation like "config.options.debug" is NOT supported. */
            properties_remove?: string[] | {
                [key: string]: unknown;
            };
            /** @description Relationships to add or update (upsert semantics) */
            relationships_add?: {
                /**
                 * @description Relationship predicate (e.g., "admin", "contains", "collection")
                 * @example admin
                 */
                predicate: string;
                /**
                 * @description Target entity ID
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                peer: string;
                /**
                 * @description Target entity type hint
                 * @example user
                 */
                peer_type?: string;
                /**
                 * @description Target entity label hint
                 * @example Captain Ahab
                 */
                peer_label?: string;
                /**
                 * @description Properties to add/update on this relationship (deep merged if relationship exists)
                 * @example {
                 *       "expires_at": "2025-12-31T00:00:00Z"
                 *     }
                 */
                properties?: {
                    [key: string]: unknown;
                };
                /** @description Properties to remove from this relationship (string array or nested object) */
                properties_remove?: string[] | {
                    [key: string]: unknown;
                };
            }[];
            /** @description Relationships to remove */
            relationships_remove?: {
                /**
                 * @description Relationship predicate
                 * @example viewer
                 */
                predicate: string;
                /**
                 * @description Target entity ID. If omitted, removes ALL relationships with this predicate.
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                peer?: string;
            }[];
            /** @description Updated klados display name */
            label?: string;
            /** @description Updated klados description */
            description?: string;
            /**
             * Format: uri
             * @description Updated klados service URL. Changing this clears endpoint_verified_at.
             */
            endpoint?: string;
            /**
             * @description Actions this klados requires on target collections
             * @example [
             *       "entity:view",
             *       "entity:update",
             *       "entity:create"
             *     ]
             */
            actions_required?: string[];
            /**
             * @description Klados status
             * @example development
             * @enum {string}
             */
            status?: "development" | "active" | "disabled";
            /**
             * ContractSpec
             * @description Input/output contract specification for klados
             */
            accepts?: {
                /**
                 * @description Content types (use ["*"] for any)
                 * @example [
                 *       "file/pdf",
                 *       "file/png"
                 *     ]
                 */
                types: string[];
                /**
                 * @description Cardinality: one for single entity, many for multiple
                 * @example one
                 * @enum {string}
                 */
                cardinality: "one" | "many";
            };
            /**
             * ContractSpec
             * @description Input/output contract specification for klados
             */
            produces?: {
                /**
                 * @description Content types (use ["*"] for any)
                 * @example [
                 *       "file/pdf",
                 *       "file/png"
                 *     ]
                 */
                types: string[];
                /**
                 * @description Cardinality: one for single entity, many for multiple
                 * @example one
                 * @enum {string}
                 */
                cardinality: "one" | "many";
            };
            /** @description Updated input schema */
            input_schema?: {
                [key: string]: unknown;
            };
        };
        InvokeKladosGrant: {
            klados: {
                id: string;
                label: string;
            };
            actions: string[];
            role: string;
            already_granted: boolean;
            expired?: boolean;
            /** Format: date-time */
            current_expires_at?: string;
        };
        InvokeKladosPreviewResponse: {
            /** @enum {string} */
            status: "pending_confirmation";
            message: string;
            grants: components["schemas"]["InvokeKladosGrant"][];
            target: {
                id: string;
                label: string;
            };
            /** Format: date-time */
            expires_at: string;
            /** @description True if all grants exist or user can create them */
            can_proceed: boolean;
            /** @description True if klados needs permission grants */
            grants_needed: boolean;
        };
        InvokeKladosGrantResult: {
            klados_id: string;
            role: string;
            /** Format: date-time */
            expires_at: string;
            was_update: boolean;
        };
        InvokeKladosStartedResponse: {
            /** @enum {string} */
            status: "started";
            /**
             * @description Unique job identifier
             * @example job_01JEXAMPLEID12345678901
             */
            job_id: string;
            /** @description The job collection where klados writes logs */
            job_collection: string;
            /** @description Klados that was invoked */
            klados_id: string;
            grants: components["schemas"]["InvokeKladosGrantResult"][];
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            target_cid: string;
            /** Format: date-time */
            expires_at: string;
        };
        InvokeKladosRejectedResponse: {
            /** @enum {string} */
            status: "rejected";
            /** @description Error message explaining why the klados rejected the job */
            error: string;
            /** @description Suggested seconds to wait before retrying */
            retry_after?: number;
            grants: components["schemas"]["InvokeKladosGrantResult"][];
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            target_cid: string;
            /** Format: date-time */
            expires_at: string;
        };
        InvokeKladosConfirmedResponse: components["schemas"]["InvokeKladosStartedResponse"] | components["schemas"]["InvokeKladosRejectedResponse"];
        InvokeKladosRequest: {
            /** @description Single entity to process (required when klados.accepts.cardinality = "one") */
            target_entity?: string;
            /** @description Multiple entities to process (required when klados.accepts.cardinality = "many") */
            target_entities?: string[];
            /** @description Collection for permission grant. Klados receives temporal permissions on this collection. */
            target_collection: string;
            /** @description Job collection where klados should write logs. If not provided, creates new collection. */
            job_collection?: string;
            /** @description Input data for the klados (validated against input_schema) */
            input?: {
                [key: string]: unknown;
            };
            /**
             * @description Permission duration in seconds (60-86400, default: 3600)
             * @default 3600
             * @example 3600
             */
            expires_in: number;
            /**
             * @description false = preview grants, true = execute klados
             * @default false
             * @example false
             */
            confirm: boolean;
            /**
             * RhizaContext
             * @description Rhiza context for workflow invocations
             */
            rhiza?: {
                /** @description Rhiza workflow ID */
                id: string;
                /** @description Path of step names from entry to current */
                path: string[];
                /** @description Parent log IDs for chain traversal (e.g., "log_abc123") */
                parent_logs: string[];
                /** @description Batch context if part of scatter operation */
                batch?: {
                    /** @description Batch entity ID */
                    id: string;
                    /** @description Slot index (0-based) */
                    index: number;
                    /** @description Total slots in batch */
                    total: number;
                };
            };
        };
        VerifyKladosTokenResponse: {
            /**
             * @description Token to deploy at your endpoint
             * @example vt_abc123def456...
             */
            verification_token: string;
            /** @description Klados ID to include in verification response */
            klados_id: string;
            /**
             * Format: uri
             * @description Your klados endpoint URL
             */
            endpoint: string;
            /** @description How to complete verification */
            instructions: string;
            /**
             * Format: date-time
             * @description Token expiration time
             */
            expires_at: string;
        };
        VerifyKladosSuccessResponse: {
            /** @enum {boolean} */
            verified: true;
            /**
             * Format: date-time
             * @description When the endpoint was verified
             */
            verified_at: string;
        };
        VerifyKladosFailureResponse: {
            /** @enum {boolean} */
            verified: false;
            /**
             * @description Verification error code
             * @enum {string}
             */
            error: "no_token" | "token_expired" | "fetch_failed" | "invalid_response" | "token_mismatch" | "klados_id_mismatch";
            /** @description Human-readable error description */
            message: string;
        };
        VerifyKladosRequest: {
            /**
             * @description Set to true to perform verification. Omit or false to generate verification token.
             * @example true
             */
            confirm?: boolean;
        };
        ReinvokeKladosResponse: {
            /** @description Whether the klados accepted the retry */
            accepted: boolean;
            /**
             * @description New job ID for the retry (only if accepted)
             * @example job_01JEXAMPLEID12345678901
             */
            job_id?: string;
            /** @description The log ID that was retried */
            original_log_id?: string;
            /** @description Error message if rejected or invocation failed */
            error?: string;
            /** @description Suggested seconds to wait before retrying again */
            retry_after?: number;
        };
        ReinvokeKladosRequest: {
            /**
             * @description Log file entity ID containing the failed invocation to retry
             * @example 01JLOGFILE1234567890123456
             */
            log_id: string;
            /**
             * @description Permission duration in seconds (60-86400, default: 3600)
             * @default 3600
             * @example 3600
             */
            expires_in: number;
        };
        CreateKladosApiKeyResponse: {
            /** Format: uuid */
            id: string;
            /**
             * @description Full API key - store securely, shown only once
             * @example ak_abc123...
             */
            key: string;
            /**
             * @description Key prefix for identification
             * @example ak_abc1
             */
            prefix: string;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            expires_at: string;
            label: string | null;
        };
        CreateKladosApiKeyRequest: {
            /**
             * @description Human-readable label for the key
             * @example Production key
             */
            label?: string;
            /**
             * @description Key expiration in days (1-365, default: 365)
             * @default 365
             * @example 90
             */
            expires_in_days: number;
        };
        KladosApiKeyInfo: {
            /** Format: uuid */
            id: string;
            prefix: string;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            expires_at: string;
            /** Format: date-time */
            last_used_at: string | null;
            label: string | null;
        };
        ListKladosApiKeysResponse: {
            keys: components["schemas"]["KladosApiKeyInfo"][];
        };
        RhizaResponse: components["schemas"]["EntityResponse"] & {
            /** @enum {string} */
            type?: "rhiza";
        };
        /**
         * @description Condition for routing decisions. Supports three forms:
         *     - Simple match: `{ property: "status", equals: "approved" }`
         *     - AND: `{ and: [condition1, condition2, ...] }`
         *     - OR: `{ or: [condition1, condition2, ...] }`
         *
         *     Conditions can be nested arbitrarily deep.
         * @example {
         *       "property": "status",
         *       "equals": "approved"
         *     }
         */
        WhereCondition: {
            [key: string]: unknown;
        } & ({
            /** @description Property path to check (e.g., "status", "metadata.category") */
            property: string;
            /** @description Value to compare against */
            equals: string | number | boolean | null;
        } | {
            /** @description All conditions must match */
            and: components["schemas"]["WhereCondition"][];
        } | {
            /** @description At least one condition must match */
            or: components["schemas"]["WhereCondition"][];
        });
        CreateRhizaRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /** @description Custom entity ID (generated if not provided) */
            id?: string;
            /**
             * @description Rhiza display name
             * @example Document Processing Pipeline
             */
            label: string;
            /**
             * @description Semantic version
             * @example 1.0.0
             */
            version: string;
            /**
             * @description Entry point step name (must exist as a key in flow)
             * @example extract
             */
            entry: string;
            /**
             * Flow
             * @description Flow definition mapping step names to their klados references and handoff specifications. Step names are arbitrary strings that identify each step in the workflow.
             * @example {
             *       "extract": {
             *         "klados": {
             *           "id": "01KKLADOSA12345678901234",
             *           "type": "klados"
             *         },
             *         "then": {
             *           "pass": "summarize"
             *         }
             *       },
             *       "summarize": {
             *         "klados": {
             *           "id": "01KKLADOSB12345678901234",
             *           "type": "klados"
             *         },
             *         "then": {
             *           "done": true
             *         }
             *       }
             *     }
             */
            flow: {
                [key: string]: {
                    /**
                     * KladosRef
                     * @description Reference to the klados entity to invoke for this step
                     * @example {
                     *       "id": "01KEXAMPLE123456789012345",
                     *       "type": "klados",
                     *       "label": "OCR Processor"
                     *     }
                     */
                    klados: {
                        id: string;
                        type?: string;
                        label?: string;
                        description?: string;
                    } | {
                        pi: string;
                        type?: string;
                        label?: string;
                        description?: string;
                    };
                    /**
                     * ThenSpec
                     * @description What happens after this klados completes
                     */
                    then: {
                        /** @enum {boolean} */
                        done: true;
                    } | {
                        /** @description Target step name for 1:1 handoff */
                        pass: string;
                        /** @description Conditional routing rules */
                        route?: {
                            where: components["schemas"]["WhereCondition"];
                            /** @description Target step name if condition matches */
                            target: string;
                        }[];
                    } | {
                        /** @description Target step name for 1:N fan-out */
                        scatter: string;
                        /** @description Conditional routing rules */
                        route?: {
                            where: components["schemas"]["WhereCondition"];
                            /** @description Target step name if condition matches */
                            target: string;
                        }[];
                    } | {
                        /** @description Target step name for N:1 fan-in */
                        gather: string;
                        /** @description Conditional routing rules */
                        route?: {
                            where: components["schemas"]["WhereCondition"];
                            /** @description Target step name if condition matches */
                            target: string;
                        }[];
                    } | {
                        /** @description Target step name for bounded recursion */
                        recurse: string;
                        /**
                         * @description Maximum recursion depth (default: 10)
                         * @example 10
                         */
                        max_depth?: number;
                        /** @description Conditional routing rules */
                        route?: {
                            where: components["schemas"]["WhereCondition"];
                            /** @description Target step name if condition matches */
                            target: string;
                        }[];
                    };
                };
            };
            /** @description Collection to place rhiza in */
            collection: string;
            /**
             * @description Rhiza description
             * @example Processes documents through OCR, classification, and extraction
             */
            description?: string;
            /** @description Additional properties to store */
            properties?: {
                [key: string]: unknown;
            };
            /** @description Relationships to create */
            relationships?: {
                predicate: string;
                peer: string;
                peer_type?: string;
                peer_label?: string;
                properties?: {
                    [key: string]: unknown;
                };
            }[];
        };
        RhizaUpdateResponse: components["schemas"]["RhizaResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        UpdateRhizaRequest: {
            /**
             * @description Current tip CID for CAS validation. Request fails with 409 if this does not match.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /** @description Properties to add or update (deep merged) */
            properties?: {
                [key: string]: unknown;
            };
            /** @description Properties to remove. Use string[] for top-level keys (e.g., ["old_field"]), or nested objects for deep removal (e.g., { config: { options: ["debug"] } }). Dot notation like "config.options.debug" is NOT supported. */
            properties_remove?: string[] | {
                [key: string]: unknown;
            };
            /** @description Relationships to add or update (upsert semantics) */
            relationships_add?: {
                /**
                 * @description Relationship predicate (e.g., "admin", "contains", "collection")
                 * @example admin
                 */
                predicate: string;
                /**
                 * @description Target entity ID
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                peer: string;
                /**
                 * @description Target entity type hint
                 * @example user
                 */
                peer_type?: string;
                /**
                 * @description Target entity label hint
                 * @example Captain Ahab
                 */
                peer_label?: string;
                /**
                 * @description Properties to add/update on this relationship (deep merged if relationship exists)
                 * @example {
                 *       "expires_at": "2025-12-31T00:00:00Z"
                 *     }
                 */
                properties?: {
                    [key: string]: unknown;
                };
                /** @description Properties to remove from this relationship (string array or nested object) */
                properties_remove?: string[] | {
                    [key: string]: unknown;
                };
            }[];
            /** @description Relationships to remove */
            relationships_remove?: {
                /**
                 * @description Relationship predicate
                 * @example viewer
                 */
                predicate: string;
                /**
                 * @description Target entity ID. If omitted, removes ALL relationships with this predicate.
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                peer?: string;
            }[];
            /** @description Updated rhiza display name */
            label?: string;
            /** @description Updated rhiza description */
            description?: string;
            /** @description Updated semantic version */
            version?: string;
            /** @description Updated entry point step name (must exist as a key in flow) */
            entry?: string;
            /**
             * Flow
             * @description Flow definition mapping step names to their klados references and handoff specifications. Step names are arbitrary strings that identify each step in the workflow.
             * @example {
             *       "extract": {
             *         "klados": {
             *           "id": "01KKLADOSA12345678901234",
             *           "type": "klados"
             *         },
             *         "then": {
             *           "pass": "summarize"
             *         }
             *       },
             *       "summarize": {
             *         "klados": {
             *           "id": "01KKLADOSB12345678901234",
             *           "type": "klados"
             *         },
             *         "then": {
             *           "done": true
             *         }
             *       }
             *     }
             */
            flow?: {
                [key: string]: {
                    /**
                     * KladosRef
                     * @description Reference to the klados entity to invoke for this step
                     * @example {
                     *       "id": "01KEXAMPLE123456789012345",
                     *       "type": "klados",
                     *       "label": "OCR Processor"
                     *     }
                     */
                    klados: {
                        id: string;
                        type?: string;
                        label?: string;
                        description?: string;
                    } | {
                        pi: string;
                        type?: string;
                        label?: string;
                        description?: string;
                    };
                    /**
                     * ThenSpec
                     * @description What happens after this klados completes
                     */
                    then: {
                        /** @enum {boolean} */
                        done: true;
                    } | {
                        /** @description Target step name for 1:1 handoff */
                        pass: string;
                        /** @description Conditional routing rules */
                        route?: {
                            where: components["schemas"]["WhereCondition"];
                            /** @description Target step name if condition matches */
                            target: string;
                        }[];
                    } | {
                        /** @description Target step name for 1:N fan-out */
                        scatter: string;
                        /** @description Conditional routing rules */
                        route?: {
                            where: components["schemas"]["WhereCondition"];
                            /** @description Target step name if condition matches */
                            target: string;
                        }[];
                    } | {
                        /** @description Target step name for N:1 fan-in */
                        gather: string;
                        /** @description Conditional routing rules */
                        route?: {
                            where: components["schemas"]["WhereCondition"];
                            /** @description Target step name if condition matches */
                            target: string;
                        }[];
                    } | {
                        /** @description Target step name for bounded recursion */
                        recurse: string;
                        /**
                         * @description Maximum recursion depth (default: 10)
                         * @example 10
                         */
                        max_depth?: number;
                        /** @description Conditional routing rules */
                        route?: {
                            where: components["schemas"]["WhereCondition"];
                            /** @description Target step name if condition matches */
                            target: string;
                        }[];
                    };
                };
            };
            /**
             * @description Rhiza status
             * @example development
             * @enum {string}
             */
            status?: "development" | "active" | "disabled";
        };
        InvokeRhizaGrant: {
            klados: {
                id: string;
                label: string;
            };
            actions: string[];
            role: string;
            already_granted: boolean;
        };
        InvokeRhizaPreviewResponse: {
            /** @enum {string} */
            status: "pending_confirmation";
            message: string;
            grants: components["schemas"]["InvokeRhizaGrant"][];
            target: {
                id: string;
                label: string;
            };
            /** Format: date-time */
            expires_at: string;
            /** @description Number of kladoi in the workflow */
            kladoi_count: number;
            /** @description True if all kladoi are active and verified */
            all_ready: boolean;
            /** @description Issues with kladoi that prevent workflow execution */
            klados_issues?: {
                id: string;
                reason: string;
            }[];
        };
        InvokeRhizaStartedResponse: {
            /** @enum {string} */
            status: "started";
            /**
             * @description Unique job identifier
             * @example job_01JEXAMPLEID12345678901
             */
            job_id: string;
            /** @description The job collection where logs are written */
            job_collection: string;
            /** @description Rhiza that was invoked */
            rhiza_id: string;
            /** Format: date-time */
            expires_at: string;
        };
        InvokeRhizaRejectedResponse: {
            /** @enum {string} */
            status: "rejected";
            /** @description Error message explaining why the entry klados rejected the job */
            error: string;
            /** @description Suggested seconds to wait before retrying */
            retry_after?: number;
        };
        InvokeRhizaConfirmedResponse: components["schemas"]["InvokeRhizaStartedResponse"] | components["schemas"]["InvokeRhizaRejectedResponse"];
        InvokeRhizaRequest: {
            /** @description Single entity to process (required when entry klados.accepts.cardinality = "one") */
            target_entity?: string;
            /** @description Multiple entities to process (required when entry klados.accepts.cardinality = "many") */
            target_entities?: string[];
            /** @description Collection for permission grant. All kladoi in workflow receive temporal permissions on this collection. */
            target_collection: string;
            /** @description Input data for the workflow */
            input?: {
                [key: string]: unknown;
            };
            /**
             * @description Permission duration in seconds (60-86400, default: 3600)
             * @default 3600
             * @example 3600
             */
            expires_in: number;
            /**
             * @description false = preview grants, true = execute workflow
             * @default false
             * @example false
             */
            confirm: boolean;
        };
        ProgressCounters: {
            /** @description Total log entries */
            total: number;
            /** @description Pending entries */
            pending: number;
            /** @description Running entries */
            running: number;
            /** @description Completed entries */
            done: number;
            /** @description Failed entries */
            error: number;
        };
        ErrorSummary: {
            /** @description Klados that failed */
            klados_id: string;
            /** @description Job ID */
            job_id: string;
            /** @description Error code */
            code: string;
            /** @description Error message */
            message: string;
            /** @description Whether error is retryable */
            retryable: boolean;
        };
        WorkflowStatusResponse: {
            /** @description Job ID */
            job_id: string;
            /** @description Rhiza ID */
            rhiza_id: string;
            /**
             * @description Overall workflow status
             * @enum {string}
             */
            status: "pending" | "running" | "done" | "error";
            progress: components["schemas"]["ProgressCounters"];
            /** @description Currently running kladoi */
            current_kladoi?: string[];
            /** @description Error summaries */
            errors?: components["schemas"]["ErrorSummary"][];
            /**
             * Format: date-time
             * @description When workflow started
             */
            started_at: string;
            /**
             * Format: date-time
             * @description When workflow completed
             */
            completed_at?: string;
        };
        ResumedJob: {
            /** @description Original job ID that was resumed */
            original_job_id: string;
            /** @description Klados that was re-invoked */
            klados_id: string;
            /** @description New job ID */
            new_job_id: string;
        };
        ResumeWorkflowResponse: {
            /** @description Number of jobs resumed */
            resumed: number;
            /** @description Number of jobs skipped (non-retryable) */
            skipped: number;
            /** @description Details of resumed jobs */
            jobs: components["schemas"]["ResumedJob"][];
        };
        ResumeWorkflowRequest: {
            /** @description Only resume jobs with these error codes (all retryable if not specified) */
            error_codes?: string[];
        };
        Event: {
            /**
             * @description Auto-increment event ID (use as cursor)
             * @example 12346
             */
            id: number;
            /**
             * @description Entity ID that changed
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            entity_id: string;
            /**
             * @description New manifest CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description ISO timestamp of the event
             * @example 2025-01-15T12:00:01Z
             */
            ts: string;
        };
        EventsListResponse: {
            /** @description List of events (newest first) */
            events: components["schemas"]["Event"][];
            /**
             * @description Whether there are more (older) events available
             * @example true
             */
            has_more: boolean;
            /**
             * @description Cursor for the next page (oldest id in batch, pass as ?cursor= for older events)
             * @example 12340
             */
            cursor: number;
        };
        /**
         * @example {
         *       "subject_id": "01KE4ZY69F9R40E88PK9S0TQRQ",
         *       "subject_label": "Project Folder",
         *       "subject_type": "folder",
         *       "subject_preview": {
         *         "id": "01KE4ZY69F9R40E88PK9S0TQRQ",
         *         "type": "folder",
         *         "label": "Project Folder",
         *         "collection_id": "01JCOLLECTION123456789ABCD",
         *         "description_preview": "Main project folder containing research documents...",
         *         "created_at": "2025-01-10T08:00:00.000Z",
         *         "updated_at": "2025-01-18T16:45:00.000Z"
         *       },
         *       "predicate": "contains",
         *       "object_id": "01KE506KZGD8M2P1XK3VNQT4YR",
         *       "object_label": "Research Paper.pdf",
         *       "object_type": "file",
         *       "object_preview": {
         *         "id": "01KE506KZGD8M2P1XK3VNQT4YR",
         *         "type": "file",
         *         "label": "Research Paper.pdf",
         *         "collection_id": "01JCOLLECTION123456789ABCD",
         *         "description_preview": "Analysis of entity management patterns and best practices...",
         *         "created_at": "2025-01-15T10:00:00.000Z",
         *         "updated_at": "2025-01-20T14:30:00.000Z"
         *       }
         *     }
         */
        PathEdge: {
            /**
             * @description Source entity PI
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            subject_id: string;
            /** @description Source entity label */
            subject_label: string;
            /** @description Source entity type */
            subject_type: string;
            subject_preview?: components["schemas"]["EntityPreview"] & unknown;
            subject_entity?: components["schemas"]["EntityResponse"] & unknown;
            /** @description Relationship predicate */
            predicate: string;
            /**
             * @description Target entity PI
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            object_id: string;
            /** @description Target entity label */
            object_label: string;
            /** @description Target entity type */
            object_type: string;
            object_preview?: components["schemas"]["EntityPreview"] & unknown;
            object_entity?: components["schemas"]["EntityResponse"] & unknown;
        };
        PathResult: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            source_id: string;
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            target_id: string;
            /** @description Path length (number of hops) */
            length: number;
            edges: components["schemas"]["PathEdge"][];
        };
        PathsBetweenResponse: {
            paths: components["schemas"]["PathResult"][];
            /** @description Whether results were truncated due to limit */
            truncated: boolean;
        };
        PathsBetweenRequest: {
            /**
             * @description Starting entity PIs
             * @example [
             *       "01KE4ZY69F9R40E88PK9S0TQRQ"
             *     ]
             */
            source_ids: string[];
            /**
             * @description Target entity PIs
             * @example [
             *       "01KE506KZGD8M2P1XK3VNQT4YR"
             *     ]
             */
            target_ids: string[];
            /**
             * @description Maximum path depth (1-4)
             * @default 4
             * @example 3
             */
            max_depth: number;
            /**
             * @description Relationship traversal direction
             * @default both
             * @example both
             * @enum {string}
             */
            direction: "outgoing" | "incoming" | "both";
            /**
             * @description Maximum number of paths to return
             * @default 100
             * @example 10
             */
            limit: number;
        };
        /**
         * @example {
         *       "source_id": "01KE4ZY69F9R40E88PK9S0TQRQ",
         *       "target_id": "01KE506KZGD8M2P1XK3VNQT4YR",
         *       "target_label": "Research Paper.pdf",
         *       "target_type": "file",
         *       "length": 1,
         *       "edges": [],
         *       "target_preview": {
         *         "id": "01KE506KZGD8M2P1XK3VNQT4YR",
         *         "type": "file",
         *         "label": "Research Paper.pdf",
         *         "collection_id": "01JCOLLECTION123456789ABCD",
         *         "description_preview": "Analysis of entity management patterns and best practices...",
         *         "created_at": "2025-01-15T10:00:00.000Z",
         *         "updated_at": "2025-01-20T14:30:00.000Z"
         *       }
         *     }
         */
        ReachableResult: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            source_id: string;
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            target_id: string;
            target_label: string;
            target_type: string;
            /** @description Path length (number of hops) */
            length: number;
            edges: components["schemas"]["PathEdge"][];
            target_preview?: components["schemas"]["EntityPreview"] & unknown;
            target_entity?: components["schemas"]["EntityResponse"] & unknown;
        };
        PathsReachableResponse: {
            results: components["schemas"]["ReachableResult"][];
            /** @description Whether results were truncated due to limit */
            truncated: boolean;
        };
        PathsReachableRequest: {
            /**
             * @description Starting entity PIs
             * @example [
             *       "01KE4ZY69F9R40E88PK9S0TQRQ"
             *     ]
             */
            source_ids: string[];
            /**
             * @description Target entity type to find
             * @example file
             */
            target_type: string;
            /**
             * @description Maximum path depth (1-4)
             * @default 4
             * @example 3
             */
            max_depth: number;
            /**
             * @description Relationship traversal direction
             * @default both
             * @example both
             * @enum {string}
             */
            direction: "outgoing" | "incoming" | "both";
            /**
             * @description Maximum number of results to return
             * @default 100
             * @example 50
             */
            limit: number;
        };
        /**
         * @example {
         *       "direction": "outgoing",
         *       "predicate": "contains",
         *       "peer_id": "01KE506KZGD8M2P1XK3VNQT4YR",
         *       "peer_type": "file",
         *       "peer_label": "Research Paper.pdf",
         *       "properties": {},
         *       "peer_preview": {
         *         "id": "01KE506KZGD8M2P1XK3VNQT4YR",
         *         "type": "file",
         *         "label": "Research Paper.pdf",
         *         "collection_id": "01KE4ZY69F9R40E88PK9S0TQRQ",
         *         "description_preview": "Analysis of entity management patterns and best practices...",
         *         "created_at": "2025-01-15T10:00:00.000Z",
         *         "updated_at": "2025-01-20T14:30:00.000Z"
         *       }
         *     }
         */
        RelationshipInfo: {
            /** @enum {string} */
            direction: "outgoing" | "incoming";
            predicate: string;
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            peer_id: string;
            peer_type: string;
            peer_label: string;
            properties: {
                [key: string]: unknown;
            };
            peer_preview?: components["schemas"]["EntityPreview"] & unknown;
            peer_entity?: components["schemas"]["EntityResponse"] & unknown;
        };
        /**
         * @example {
         *       "id": "01KE4ZY69F9R40E88PK9S0TQRQ",
         *       "type": "folder",
         *       "label": "Project Folder",
         *       "collection_id": "01JCOLLECTION123456789ABCD",
         *       "created_at": "2025-01-10T08:00:00.000Z",
         *       "updated_at": "2025-01-18T16:45:00.000Z",
         *       "relationships": [
         *         {
         *           "direction": "outgoing",
         *           "predicate": "contains",
         *           "peer_id": "01KE506KZGD8M2P1XK3VNQT4YR",
         *           "peer_type": "file",
         *           "peer_label": "Research Paper.pdf",
         *           "properties": {},
         *           "peer_preview": {
         *             "id": "01KE506KZGD8M2P1XK3VNQT4YR",
         *             "type": "file",
         *             "label": "Research Paper.pdf",
         *             "collection_id": "01JCOLLECTION123456789ABCD",
         *             "description_preview": "Analysis of entity management patterns and best practices...",
         *             "created_at": "2025-01-15T10:00:00.000Z",
         *             "updated_at": "2025-01-20T14:30:00.000Z"
         *           }
         *         }
         *       ]
         *     }
         */
        GraphEntityResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            type: string;
            label: string;
            collection_id: string | null;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            updated_at: string;
            relationships: components["schemas"]["RelationshipInfo"][];
        };
        EdgeStep: {
            edge: string;
            /** @enum {string} */
            direction: "outgoing" | "incoming";
            score?: number;
        };
        PathStep: {
            /**
             * @description Entity ID
             * @example 01KPERSON_EINSTEIN
             */
            entity: string;
            /** @example Albert Einstein */
            label?: string;
            /** @example person */
            type?: string;
            /**
             * @description Semantic similarity score (0-1)
             * @example 0.92
             */
            score?: number;
            preview_data?: components["schemas"]["EntityPreview"] & unknown;
            full_entity?: components["schemas"]["EntityResponse"] & unknown;
        } | components["schemas"]["EdgeStep"];
        QueryMetadata: {
            query: string;
            hops: number;
            k: number;
            k_explore: number;
            total_candidates_explored: number;
            execution_time_ms: number;
            collection?: string;
            error?: string;
            reason?: string;
            partial_path?: components["schemas"]["PathStep"][];
            stopped_at_hop?: number;
        };
        QueryResponse: {
            results: {
                /**
                 * @description Query result entity with optional expansion data
                 * @example {
                 *       "id": "01KE4ZY69F9R40E88PK9S0TQRQ",
                 *       "type": "person",
                 *       "label": "Albert Einstein",
                 *       "collection_id": "01JCOLL_RESEARCH",
                 *       "preview_data": {
                 *         "id": "01KE4ZY69F9R40E88PK9S0TQRQ",
                 *         "type": "person",
                 *         "label": "Albert Einstein",
                 *         "collection_id": "01JCOLL_RESEARCH",
                 *         "description_preview": "German-born theoretical physicist who developed the theory of relativity...",
                 *         "created_at": "2025-01-15T10:00:00.000Z",
                 *         "updated_at": "2025-01-20T14:30:00.000Z"
                 *       }
                 *     }
                 */
                entity: {
                    /**
                     * @description Entity ID (ULID format)
                     * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                     */
                    id: string;
                    /** @example person */
                    type: string;
                    /** @example Albert Einstein */
                    label: string;
                    /** @example 01JCOLL_RESEARCH */
                    collection_id: string | null;
                    preview_data?: components["schemas"]["EntityPreview"] & unknown;
                    full_entity?: components["schemas"]["EntityResponse"] & unknown;
                };
                /** @description Path from entry point to result entity (empty for zero-hop queries) */
                path: components["schemas"]["PathStep"][];
                /**
                 * @description Combined relevance score (semantic similarity + path length)
                 * @example 0.89
                 */
                score: number;
            }[];
            metadata: components["schemas"]["QueryMetadata"];
        };
        QueryRequest: {
            /**
             * @description Argo query string
             * @example "medical college" -[*]{,4}-> type:file
             */
            path: string;
            /**
             * @description Maximum number of results to return
             * @default 25
             * @example 25
             */
            k: number;
            /**
             * @description Beam width for exploration (default: k * 3)
             * @example 75
             */
            k_explore?: number;
            /**
             * @description Scope query to collection PI
             * @example 01JCOLL_MEDICAL
             */
            collection?: string;
            /**
             * @description Control entity expansion in results and path steps.
             *     - **omitted/preview** (default): Attach lightweight preview data (label, timestamps, truncated description/text)
             *     - **full**: Attach complete entity manifest (all properties, relationships, version info)
             *     - **none**: No expansion - return only Pinecone metadata (fastest, smallest payload)
             * @example preview
             * @enum {string}
             */
            expand?: "none" | "preview" | "full";
            /**
             * @description Filter by indexed metadata properties during semantic search.
             *
             *     Only underscore-prefixed properties (`_year`, `_class`, etc.) are indexed as filterable metadata.
             *
             *     **Operators:** `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$exists`, `$and`, `$or`
             *
             *     **Example - Find letters from the 1800s:**
             *     ```json
             *     { "_year": { "$gte": 1800, "$lte": 1899 } }
             *     ```
             * @example {
             *       "_year": {
             *         "$gt": 1800
             *       }
             *     }
             */
            filter?: {
                [key: string]: unknown;
            };
        };
        MessageTooLargeDetails: {
            /** @enum {string} */
            code: "MESSAGE_TOO_LARGE";
            message: string;
            /** @example 2MB */
            limit: string;
            /** @example 2.48MB */
            actual?: string;
        };
        MessageTooLargeError: {
            /**
             * @description Human-readable error message
             * @example Message exceeds maximum size limit. Please shorten your message.
             */
            error: string;
            /**
             * @description Error code for client handling
             * @enum {string}
             */
            code: "MESSAGE_TOO_LARGE";
            details?: components["schemas"]["MessageTooLargeDetails"];
        };
        ChatStorageFullDetails: {
            /** @enum {string} */
            code: "CHAT_STORAGE_FULL";
            message: string;
            /** @example 10GB */
            limit: string;
        };
        ChatStorageFullError: {
            /**
             * @description Human-readable error message
             * @example This conversation has reached its maximum storage capacity. Please start a new conversation.
             */
            error: string;
            /**
             * @description Error code for client handling
             * @enum {string}
             */
            code: "CHAT_STORAGE_FULL";
            details?: components["schemas"]["ChatStorageFullDetails"];
        };
        TextPart: {
            /** @enum {string} */
            type: "text";
            text: string;
        };
        ToolPart: {
            type: string;
            toolCallId?: string;
            toolName?: string;
            args?: {
                [key: string]: unknown;
            };
            output?: unknown;
            /** @enum {string} */
            state?: "partial-call" | "call" | "output-available";
        };
        MessagePart: components["schemas"]["TextPart"] | components["schemas"]["ToolPart"] | {
            type: string;
        };
        ChatMessage: {
            id: string;
            /** @enum {string} */
            role: "user" | "assistant" | "system" | "tool";
            parts?: components["schemas"]["MessagePart"][];
            content?: string;
        };
        SendChatRequest: {
            /** @description Array of chat messages in AI SDK v5 UIMessage format */
            messages: components["schemas"]["ChatMessage"][];
        };
        ChatListItem: {
            /**
             * @description Chat UUID (use with X-Chat-ID header)
             * @example 550e8400-e29b-41d4-a716-446655440000
             */
            id: string;
            /**
             * @description Auto-generated from first message (50 chars)
             * @example Help me understand the Arke API...
             */
            title: string | null;
            /**
             * @description ISO8601 timestamp of chat creation
             * @example 2026-01-26T14:30:00.000Z
             */
            createdAt: string;
            /**
             * @description ISO8601 timestamp of last message
             * @example 2026-01-26T15:45:00.000Z
             */
            updatedAt: string;
            /**
             * @description Last assistant response (100 chars, markdown stripped)
             * @example I found 3 entities matching your query. The first one is...
             */
            lastMessagePreview: string | null;
        };
        ListChatsResponse: {
            /** @description Array of chat metadata objects */
            chats: components["schemas"]["ChatListItem"][];
            /**
             * @description Total number of chats for this user
             * @example 42
             */
            total: number;
            /**
             * @description True if more chats exist beyond current page
             * @example true
             */
            hasMore: boolean;
        };
        ChatSession: {
            /**
             * @description Chat session ID
             * @example chat_abc123
             */
            id: string;
            /**
             * @description ISO 8601 creation timestamp
             * @example 2025-01-14T12:00:00.000Z
             */
            createdAt: string;
            /**
             * @description ISO 8601 last update timestamp
             * @example 2025-01-14T12:30:00.000Z
             */
            updatedAt: string;
            /** @description Owner user ID (Arke PI or Supabase ID) */
            ownerId: string | null;
            /**
             * @description Auto-generated chat title from first message
             * @example Help me understand the codebase...
             */
            title: string | null;
            /** @description Full message history (only included in session detail) */
            messages?: {
                id: string;
                /** @enum {string} */
                role: "user" | "assistant" | "system" | "tool";
                content: string;
                createdAt: string;
                toolInvocations?: {
                    toolCallId: string;
                    toolName: string;
                    args?: {
                        [key: string]: unknown;
                    };
                    result?: unknown;
                    state: string;
                }[];
            }[];
        };
        ChatSessionDeleteResponse: {
            success: boolean;
        };
        AttestationResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description Arweave transaction ID
             * @example abc123xyz...
             */
            arweave_tx: string;
            /**
             * Format: uri
             * @description Arweave gateway URL for direct access
             * @example https://arweave.net/abc123xyz...
             */
            arweave_url: string;
            /**
             * @description Unix timestamp (milliseconds) of the operation
             * @example 1704455200000
             */
            ts: number;
        };
        AttestationPendingResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description Attestation upload status
             * @enum {string}
             */
            attestation_status: "pending";
            /**
             * @description Status message
             * @example Attestation upload in progress
             */
            message: string;
        };
        ChainHeadResponse: {
            /**
             * @description Sequence number of the latest attestation
             * @example 784
             */
            seq: number;
            /**
             * @description Arweave transaction ID
             * @example Rxv_BpobNBUr0x5DstsAEUVxCO12hKxv7cnHnGLYp2c
             */
            tx: string;
            /**
             * Format: uri
             * @description Arweave gateway URL for direct access
             * @example https://arweave.net/Rxv_BpobNBUr0x5DstsAEUVxCO12hKxv7cnHnGLYp2c
             */
            arweave_url: string;
        };
        VerifyAttestationResponse: {
            arweave_tx: string;
            attestation: {
                /**
                 * @description Entity ID (ULID format)
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                id: string;
                /**
                 * @description Entity version number
                 * @example 1
                 */
                ver: number;
                /**
                 * @description Content Identifier (CID) - content-addressed hash
                 * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
                 */
                cid: string;
                /**
                 * @description Operation type: C=Create, U=Update
                 * @enum {string}
                 */
                op: "C" | "U";
                /**
                 * @description Visibility at time of operation
                 * @enum {string}
                 */
                vis: "pub" | "priv";
                /**
                 * @description Previous version CID (null for creates)
                 * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
                 */
                prev_cid: string | null;
                /** @description Unix timestamp (milliseconds) */
                ts: number;
            };
            /** @description True if hash(manifest) matches the attested CID */
            cid_valid: boolean;
            /** @description Truncated preview of the manifest content */
            manifest_preview: {
                /**
                 * @description Entity type
                 * @example collection
                 */
                type: string;
            };
        };
    };
    responses: never;
    parameters: {
        /** @description Target network. Use `test` for isolated test data with II-prefixed IDs. */
        "X-Arke-Network": "main" | "test";
        /** @description User entity ID for service accounts acting on behalf of a user. Only valid with `role: service` authentication. */
        "X-On-Behalf-Of": string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
