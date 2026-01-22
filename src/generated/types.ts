/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 *
 * This file was generated from the Arke v1 OpenAPI spec.
 * To regenerate, run: npm run generate
 *
 * Source: Arke v1 API
 * Version: 1.0.0
 * Generated: 2026-01-22T16:50:20.274Z
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
    "/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get user by ID
         * @description Returns a user entity by ID. May require authentication depending on permissions.
         *
         *     ---
         *     **Permission:** `user:view`
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
                /** @description User found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UserResponse"];
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
         * Update user profile
         * @description Updates a user's profile. Requires user:update permission (typically self-ownership).
         *
         *     ---
         *     **Permission:** `user:update`
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
                    "application/json": components["schemas"]["UserUpdateRequest"];
                };
            };
            responses: {
                /** @description User updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UserUpdateResponse"];
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
         * @description Returns entities belonging to this collection from the graph database.
         *
         *     Supports pagination and optional type filtering. Results are ordered by creation date (newest first).
         *
         *     ---
         *     **Permission:** `collection:view`
         *     **Auth:** optional
         */
        get: {
            parameters: {
                query?: {
                    type?: string;
                    limit?: number;
                    offset?: number | null;
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
         *     ---
         *     **Permission:** `entity:create`
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
         *     Note: entity:update on a collection requires collection:update permission.
         *
         *     ---
         *     **Permission:** `entity:update`
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
    "/relationships": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add relationship between entities
         * @description Creates a relationship from source to target entity.
         *
         *     **⚠️ For single-entity updates, prefer `PUT /entities/:id` with `relationships_add` - simpler API, one CAS guard, can update properties too.**
         *
         *     Use this endpoint only for **bidirectional** relationships requiring atomic updates to TWO entities.
         *
         *     If `target_predicate` is provided (bidirectional):
         *     - Updates both source and target entities
         *     - Requires `entity:update` on both, plus two CAS guards
         *
         *     If `target_predicate` is omitted (unidirectional):
         *     - Use `PUT /entities/:id` instead
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
                    "application/json": components["schemas"]["AddRelationshipRequest"];
                };
            };
            responses: {
                /** @description Relationship created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AddRelationshipResponse"];
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
        /**
         * Remove relationship between entities
         * @description Removes a relationship from source to target entity.
         *
         *     **⚠️ For single-entity updates, prefer `PUT /entities/:id` with `relationships_remove` - simpler API, one CAS guard, can update properties too.**
         *
         *     Use this endpoint only for **bidirectional** relationships requiring atomic updates to TWO entities.
         *
         *     If `target_predicate` is provided (bidirectional):
         *     - Updates both source and target entities
         *     - Requires `entity:update` on both, plus two CAS guards
         *
         *     If `target_predicate` is omitted (unidirectional):
         *     - Use `PUT /entities/:id` instead
         *
         *     ---
         *     **Permission:** `entity:update`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["RemoveRelationshipRequest"];
                };
            };
            responses: {
                /** @description Relationship removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RemoveRelationshipResponse"];
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
    "/connect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Connect two entities
         * @description Creates a unidirectional relationship from source to target entity.
         *
         *     This is a shorthand for adding a relationship with sensible defaults:
         *     - Default predicate: `connects_to` (customizable)
         *     - Optional label and description stored in relationship properties
         *     - Only requires `entity:update` permission on source entity
         *
         *     Use this for simple entity linking. For bidirectional relationships or
         *     advanced options, use the `/relationships` endpoint.
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
                    "application/json": components["schemas"]["ConnectRequest"];
                };
            };
            responses: {
                /** @description Connection created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ConnectResponse"];
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
    "/connect/disconnect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Disconnect two entities
         * @description Removes a unidirectional relationship from source to target entity.
         *
         *     This is a shorthand for removing a relationship:
         *     - Default predicate: `connects_to` (customizable)
         *     - Only requires `entity:update` permission on source entity
         *
         *     For bidirectional removal, use the `/relationships` endpoint.
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
                    "application/json": components["schemas"]["DisconnectRequest"];
                };
            };
            responses: {
                /** @description Connection removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DisconnectResponse"];
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
    "/files": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create file entity
         * @description Creates a new file entity.
         *
         *     ## Flow
         *     1. Call this endpoint with file metadata (key, filename, content_type, size)
         *     2. Receive entity data (uploaded: false)
         *     3. POST the file content to /{id}/content
         *     4. Entity will be updated with uploaded: true and verified CID
         *
         *     ## Key Best Practice
         *     Use a unique identifier as the key (e.g., version number, timestamp).
         *     The actual CID is computed during upload.
         *
         *     ---
         *     **Permission:** `file:create`
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
                    "application/json": components["schemas"]["CreateFileRequest"];
                };
            };
            responses: {
                /** @description File entity created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CreateFileResponse"];
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
    "/files/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get file metadata
         * @description Returns file entity metadata. Use /{id}/content to download the file content.
         *
         *     ---
         *     **Permission:** `file:view`
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
                /** @description File found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FileResponse"];
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
         * Update file metadata
         * @description Updates file metadata without changing the file content.
         *
         *     ## Key Changes
         *     The key can be changed, but ONLY to a key that already exists in R2.
         *     This allows "regressing" to a previous file version.
         *
         *     To upload a new file, use POST /{id}/reupload instead.
         *
         *     ---
         *     **Permission:** `file:update`
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
                    "application/json": components["schemas"]["UpdateFileRequest"];
                };
            };
            responses: {
                /** @description File updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UpdateFileResponse"];
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
    "/files/{id}/content": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download file content
         * @description Downloads the binary content of a file entity.
         *
         *     ## Response Headers
         *     - Content-Type: The MIME type of the file
         *     - Content-Length: File size in bytes
         *     - Content-Disposition: attachment; filename="original_filename"
         *
         *     ## Streaming
         *     Response is streamed directly from R2 storage.
         *
         *     ---
         *     **Permission:** `file:download`
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
                /** @description File content */
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
         * Upload file content
         * @description Uploads the binary content for a file entity.
         *
         *     ## Request
         *     - Content-Type: The MIME type of the file (must match entity's content_type)
         *     - Body: Binary file content (streaming supported)
         *
         *     ## Limits
         *     - Maximum file size: 500 MB
         *
         *     ## Behavior
         *     - Streams content directly to R2
         *     - Computes CID from file bytes
         *     - Updates entity with uploaded: true, verified size, and computed CID
         *     - Atomic operation - either fully succeeds or fails
         *
         *     ## Idempotency
         *     Re-uploading content for an already-uploaded file will fail with 409 Conflict.
         *     Use POST /{id}/reupload first to create a new version.
         *
         *     ---
         *     **Permission:** `file:upload`
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
            requestBody?: never;
            responses: {
                /** @description File content uploaded */
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
                /** @description File too large (max 500 MB) */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ValidationErrorResponse"];
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
    "/files/{id}/reupload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Prepare for new file version
         * @description Prepares the entity for uploading a new file version.
         *
         *     ## Flow
         *     1. Call this endpoint with new key and file metadata
         *     2. Receive updated entity (uploaded: false)
         *     3. POST the new file content to /{id}/content
         *     4. Entity will be updated with uploaded: true and verified CID
         *
         *     ## Key Requirement
         *     The new key must NOT already exist in R2 (no overwrites).
         *     Previous file versions remain accessible via manifest history.
         *
         *     ---
         *     **Permission:** `file:reupload`
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
                    "application/json": components["schemas"]["ReuploadFileRequest"];
                };
            };
            responses: {
                /** @description Ready for new file version upload */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ReuploadFileResponse"];
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
    "/folders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create folder
         * @description Creates a new folder entity. Optionally sets parent for immediate hierarchy.
         *
         *     If a parent folder is specified, a bidirectional relationship is created:
         *     - Parent folder contains this folder
         *     - This folder is in parent folder
         *
         *     ---
         *     **Permission:** `folder:create`
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
                    "application/json": components["schemas"]["CreateFolderRequest"];
                };
            };
            responses: {
                /** @description Folder created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CreateFolderResponse"];
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
    "/folders/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get folder
         * @description Returns folder metadata including children and parent relationships.
         *
         *     ---
         *     **Permission:** `folder:view`
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
                /** @description Folder found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FolderResponse"];
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
         * Update folder
         * @description Updates folder properties (label, description, metadata). Properties are merged.
         *
         *     ---
         *     **Permission:** `folder:update`
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
                    "application/json": components["schemas"]["UpdateFolderRequest"];
                };
            };
            responses: {
                /** @description Folder updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UpdateFolderResponse"];
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
    "/folders/{id}/children": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add child to folder
         * @description Adds a child entity (file or folder) to this folder.
         *
         *     Creates bidirectional relationship:
         *     - Folder contains child
         *     - Child is in folder
         *
         *     **Idempotent**: if relationship already exists, returns current state without error.
         *
         *     ---
         *     **Permission:** `folder:update`
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
                    "application/json": components["schemas"]["AddChildRequest"];
                };
            };
            responses: {
                /** @description Child added */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AddChildResponse"];
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
    "/folders/{id}/children/{childId}": {
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
         * Remove child from folder
         * @description Removes a child entity from this folder (bidirectional).
         *
         *     ---
         *     **Permission:** `folder:update`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                    /** @description Child entity ID */
                    childId: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["RemoveChildRequest"];
                };
            };
            responses: {
                /** @description Child removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RemoveChildResponse"];
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
    "/folders/{id}/children/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Bulk add children to folder
         * @description Efficiently adds multiple children to a folder.
         *
         *     **Limit**: Maximum 50 children per request. For larger batches, make multiple
         *     requests, refetching the folder's CID between each to satisfy the CAS guard.
         *
         *     **Strategy**:
         *     1. Updates folder once with all 'contains' relationships
         *     2. Updates each child in parallel with 'in' back-link
         *
         *     **Idempotent**: skips children that already have the relationship.
         *     Returns both added and skipped children in the response.
         *
         *     ---
         *     **Permission:** `folder:update`
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
                    "application/json": components["schemas"]["BulkAddChildrenRequest"];
                };
            };
            responses: {
                /** @description Children added */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["BulkAddChildrenResponse"];
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
    "/folders/{id}/parents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add parent to folder
         * @description Adds this folder to a parent folder.
         *
         *     Creates bidirectional relationship:
         *     - Parent contains this folder
         *     - This folder is in parent
         *
         *     **Idempotent**: if relationship already exists, returns current state without error.
         *
         *     ---
         *     **Permission:** `folder:update`
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
                    "application/json": components["schemas"]["AddParentRequest"];
                };
            };
            responses: {
                /** @description Parent added */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AddParentResponse"];
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
    "/folders/{id}/parents/{parentId}": {
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
         * Remove parent from folder
         * @description Removes this folder from a parent folder (bidirectional).
         *
         *     ---
         *     **Permission:** `folder:update`
         *     **Auth:** required
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Entity ID (ULID) */
                    id: string;
                    /** @description Parent folder ID */
                    parentId: string;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["RemoveParentRequest"];
                };
            };
            responses: {
                /** @description Parent removed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RemoveParentResponse"];
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
    "/agents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create an agent
         * @description Creates a new agent entity. Requires agent:create permission in the target collection.
         *
         *     ---
         *     **Permission:** `agent:create`
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
                    "application/json": components["schemas"]["CreateAgentRequest"];
                };
            };
            responses: {
                /** @description Agent created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AgentResponse"];
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
    "/agents/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get agent by ID
         * @description Returns an agent entity by ID.
         *
         *     ---
         *     **Permission:** `agent:view`
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
                /** @description Agent found */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AgentResponse"];
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
         * Update agent
         * @description Updates an agent. Requires agent:update permission.
         *
         *     **Field placement:** Agent-specific fields (`label`, `endpoint`, `actions_required`, `input_schema`, etc.) must be at the root level, NOT inside `properties`. The `properties` bag is for additional custom data only.
         *
         *     **properties_remove syntax:** Use nested objects, not dot notation.
         *     - Correct: `{ "input_schema": { "properties": ["field_to_remove"] } }`
         *     - Wrong: `["input_schema.properties.field_to_remove"]`
         *
         *     ---
         *     **Permission:** `agent:update`
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
                    "application/json": components["schemas"]["UpdateAgentRequest"];
                };
            };
            responses: {
                /** @description Agent updated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["AgentUpdateResponse"];
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
    "/agents/{id}/invoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Invoke an agent
         * @description Invoke an agent to perform work on a target collection.
         *
         *     **Note:** The `target` parameter must be a collection ID. Agents receive permissions scoped to collections, not individual entities. To process a specific entity, pass the collection it belongs to.
         *
         *     **Two-phase interaction:**
         *     1. `confirm: false` (default) - preview permissions that will be granted
         *     2. `confirm: true` - execute the agent
         *
         *     The agent receives temporal (time-limited) permissions on the target collection.
         *
         *     ---
         *     **Permission:** `agent:invoke`
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
                    "application/json": components["schemas"]["InvokeAgentRequest"];
                };
            };
            responses: {
                /** @description Invoke preview (confirm: false) or execution started (confirm: true) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InvokePreviewResponse"];
                    };
                };
                /** @description Agent execution started */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["InvokeConfirmedResponse"];
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
    "/agents/{id}/keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List API keys for agent
         * @description Lists all active API keys for the agent (without the actual key values).
         *
         *     ---
         *     **Permission:** `agent:manage`
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
                        "application/json": components["schemas"]["ListAgentApiKeysResponse"];
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
         * Create API key for agent
         * @description Creates an API key for the agent. The full key is only returned once.
         *
         *     ---
         *     **Permission:** `agent:manage`
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
                    "application/json": components["schemas"]["CreateAgentApiKeyRequest"];
                };
            };
            responses: {
                /** @description API key created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CreateAgentApiKeyResponse"];
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
    "/agents/{id}/keys/{prefix}": {
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
         * @description Revokes an API key for the agent.
         *
         *     ---
         *     **Permission:** `agent:manage`
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
    "/agents/{id}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Verify agent endpoint ownership
         * @description Verify that you control the agent's endpoint URL. This is required before activating an agent.
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
         *       "agent_id": "IIxxx..."
         *     }
         *     ```
         *
         *     ---
         *     **Permission:** `agent:manage`
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
                    "application/json": components["schemas"]["VerifyAgentRequest"];
                };
            };
            responses: {
                /** @description Verification token (when confirm is false) or verification result (when confirm is true) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["VerifyAgentTokenResponse"] | components["schemas"]["VerifyAgentSuccessResponse"] | components["schemas"]["VerifyAgentFailureResponse"];
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
    "/jobs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get job status
         * @description Returns focused job status and summary. Use this endpoint for quick status polling.
         *
         *     Returns 404 if the entity is not a job collection.
         *
         *     **Response includes:**
         *     - Current status (running/done/error)
         *     - Timestamps (started_at, completed_at)
         *     - Agent references (agent, main_agent, target)
         *     - Counts (files_count, sub_jobs_count)
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
                /** @description Job status */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JobStatusResponse"];
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
         *     - `pi`: Entity ID that changed
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
         *     ---
         *     **Permission:** `graph:query`
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
         *     ---
         *     **Permission:** `graph:query`
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
         *     ---
         *     **Permission:** `graph:query`
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
                        /** @description Collection PI to find similar collections for */
                        pi: string;
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
                                pi: string;
                                label: string;
                                score: number;
                                created_at?: string;
                                updated_at?: string;
                            }[];
                            metadata: {
                                source_pi: string;
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
                        /** @description Entity PI to find similar items for */
                        pi: string;
                        /** @description Entity's collection PI */
                        collection_pi: string;
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
                                pi: string;
                                type: string;
                                label: string;
                                collection_pi: string | null;
                                score: number;
                                created_at?: string;
                                updated_at?: string;
                            }[];
                            metadata: {
                                source_pi: string;
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
                                pi: string;
                                label: string;
                                type: string;
                                score: number;
                                created_at?: string;
                                updated_at?: string;
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
         *     Use this endpoint to discover agents across the network. Only active agents are returned. Results are ranked by semantic similarity to your query based on agent descriptions and capabilities.
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
                                pi: string;
                                label: string;
                                score: number;
                                collection_pi: string | null;
                                status?: string;
                                created_at?: string;
                                updated_at?: string;
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
         *     Provide either `collection_pi` for a single collection or `collection_pis` for multiple collections (searched in parallel).
         *
         *     Use `per_collection_limit` to ensure result diversity when searching multiple collections.
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
                        /** @description Single collection PI to search within */
                        collection_pi?: string;
                        /** @description Multiple collection PIs to search (max 20) */
                        collection_pis?: string[];
                        /** @description Search query text */
                        query: string;
                        /**
                         * @description Maximum total results to return
                         * @default 20
                         */
                        limit?: number;
                        /** @description Filter by entity types */
                        types?: string[];
                        /** @description Max results per collection for diversity */
                        per_collection_limit?: number;
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
                                pi: string;
                                label: string;
                                type: string;
                                score: number;
                                collection_pi: string;
                                created_at?: string;
                                updated_at?: string;
                            }[];
                            metadata: {
                                collection_pis: string[];
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
                         * @description Number of collections to search
                         * @default 10
                         */
                        collection_limit?: number;
                        /**
                         * @description Max results per collection
                         * @default 5
                         */
                        per_collection_limit?: number;
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
                                pi: string;
                                label: string;
                                type: string;
                                score: number;
                                collection_pi: string;
                                created_at?: string;
                                updated_at?: string;
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
            };
        };
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
         *     Sessions are publicly viewable for sharing purposes. Only the owner can send messages or delete the session.
         *
         *     ---
         *     **Permission:** `chat:view`
         *     **Auth:** optional
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
             * @description Audit trail for edits
             * @example {
             *       "user_id": "01JCAPTAINAHAB000000000000",
             *       "method": "manual"
             *     }
             */
            edited_by: {
                user_id: string;
                /** @enum {string} */
                method: "manual" | "ai_generated" | "system" | "import";
                on_behalf_of?: string;
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
        UserUpdateResponse: components["schemas"]["UserResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
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
        UserUpdateRequest: {
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
             * @description Updated display name
             * @example Captain Ahab
             */
            label?: string;
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
             * @description Collection persistent identifier
             * @example 01JCOLLECTION123456789AB
             */
            pi: string;
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
        SearchResultItem: {
            /**
             * @description Entity persistent identifier
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            pi: string;
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
            collection_pi: string | null;
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
             * @description Custom role definitions (defaults to owner/editor/viewer/public)
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
            /** @description Entity persistent identifier */
            pi: string;
            /**
             * @description Entity type
             * @example document
             */
            type: string;
            /**
             * @description Entity display label
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
             * @description When the entity was last updated
             */
            updated_at: string;
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
             * @description Audit trail for edits
             * @example {
             *       "user_id": "01JCAPTAINAHAB000000000000",
             *       "method": "manual"
             *     }
             */
            edited_by: {
                user_id: string;
                /** @enum {string} */
                method: "manual" | "ai_generated" | "system" | "import";
                on_behalf_of?: string;
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
            pi: string;
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
             *       "entity:update",
             *       "file:download"
             *     ]
             */
            allowed_actions: string[];
            resolution: components["schemas"]["PermissionResolution"];
        };
        AddRelationshipResponse: {
            source: components["schemas"]["EntityResponse"] & unknown;
            target?: components["schemas"]["EntityResponse"] & unknown;
        };
        AddRelationshipRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /**
             * @description Source entity ID
             * @example 01JFKY3XQWM0MJVKM8DK3AEXPY
             */
            source_id: string;
            /**
             * @description Target entity ID
             * @example 01JFKY3XQWM0MJVKM8DK3AEXQZ
             */
            target_id: string;
            /**
             * @description Predicate on source entity pointing to target
             * @example collection
             */
            source_predicate: string;
            /**
             * @description Predicate on target entity pointing to source. If provided, creates bidirectional relationship.
             * @example root
             */
            target_predicate?: string;
            /**
             * @description Expected current tip CID of source entity
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_source_tip: string;
            /**
             * @description Expected current tip CID of target entity. Required for bidirectional relationships if target is protected.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_target_tip?: string;
        };
        RemoveRelationshipResponse: {
            source: components["schemas"]["EntityResponse"] & unknown;
            target?: components["schemas"]["EntityResponse"] & unknown;
        };
        RemoveRelationshipRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /**
             * @description Source entity ID
             * @example 01JFKY3XQWM0MJVKM8DK3AEXPY
             */
            source_id: string;
            /**
             * @description Target entity ID (peer of the relationship to remove)
             * @example 01JFKY3XQWM0MJVKM8DK3AEXQZ
             */
            target_id: string;
            /**
             * @description Predicate on source entity to remove
             * @example collection
             */
            source_predicate: string;
            /**
             * @description Predicate on target entity to remove. If provided, removes bidirectional relationship.
             * @example root
             */
            target_predicate?: string;
            /**
             * @description Expected current tip CID of source entity
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_source_tip: string;
            /**
             * @description Expected current tip CID of target entity. Required for bidirectional relationships.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_target_tip?: string;
        };
        ConnectResponse: {
            source: components["schemas"]["EntityResponse"] & unknown;
        };
        ConnectRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /**
             * @description Source entity ID (the entity you're connecting FROM)
             * @example 01JFKY3XQWM0MJVKM8DK3AEXPY
             */
            source_id: string;
            /**
             * @description Target entity ID (the entity you're connecting TO)
             * @example 01JFKY3XQWM0MJVKM8DK3AEXQZ
             */
            target_id: string;
            /**
             * @description Expected current tip CID of source entity
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Relationship predicate. Defaults to "connects_to".
             * @example connects_to
             */
            predicate?: string;
            /**
             * @description Optional display label for this connection
             * @example Related document
             */
            label?: string;
            /**
             * @description Optional description explaining why this connection exists
             * @example Links to the supporting research paper
             */
            description?: string;
        };
        DisconnectResponse: {
            source: components["schemas"]["EntityResponse"] & unknown;
        };
        DisconnectRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /**
             * @description Source entity ID
             * @example 01JFKY3XQWM0MJVKM8DK3AEXPY
             */
            source_id: string;
            /**
             * @description Target entity ID (peer of the connection to remove)
             * @example 01JFKY3XQWM0MJVKM8DK3AEXQZ
             */
            target_id: string;
            /**
             * @description Expected current tip CID of source entity
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_tip: string;
            /**
             * @description Relationship predicate to remove. Defaults to "connects_to".
             * @example connects_to
             */
            predicate?: string;
        };
        CreateFileResponse: {
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
            /** @enum {string} */
            type: "file";
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
             * @description Audit trail for edits
             * @example {
             *       "user_id": "01JCAPTAINAHAB000000000000",
             *       "method": "manual"
             *     }
             */
            edited_by: {
                user_id: string;
                /** @enum {string} */
                method: "manual" | "ai_generated" | "system" | "import";
                on_behalf_of?: string;
            };
        };
        CreateFileRequest: {
            /**
             * @description Storage key in R2. Best practice: use the CID.
             * @example bafkreiabc123...
             */
            key: string;
            /**
             * @description Original filename
             * @example document.pdf
             */
            filename: string;
            /**
             * @description MIME type of the file
             * @example application/pdf
             */
            content_type: string;
            /**
             * @description Expected file size in bytes (verified on upload)
             * @example 1048576
             */
            size: number;
            /**
             * @description Display label for the file. Defaults to filename if not provided.
             * @example Q4 Financial Report
             */
            label?: string;
            /**
             * @description Description of the file
             * @example Quarterly financial report for Q4 2024
             */
            description?: string;
            /**
             * @description Additional properties to store
             * @example {
             *       "source": "upload",
             *       "category": "financial"
             *     }
             */
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
            /**
             * @description Collection to add this file to (for permissions). Shortcut for adding a collection relationship.
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            collection?: string;
        };
        FileResponse: components["schemas"]["EntityResponse"] & {
            /** @enum {string} */
            type?: "file";
        };
        UploadContentResponse: components["schemas"]["EntityResponse"] & {
            /** @enum {string} */
            type?: "file";
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        UpdateFileResponse: components["schemas"]["FileResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        UpdateFileRequest: {
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
            /** @description New storage key. Must already exist in R2 (for regression to old version). */
            key?: string;
            /** @description New filename */
            filename?: string;
            /** @description New MIME type */
            content_type?: string;
            /** @description New file size in bytes */
            size?: number;
            /** @description New display label */
            label?: string;
            /** @description New description */
            description?: string;
        };
        ReuploadFileResponse: components["schemas"]["FileResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        ReuploadFileRequest: {
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
             * @description New storage key. Must NOT already exist in R2.
             * @example v2
             */
            key: string;
            /**
             * @description MIME type of the new file
             * @example application/pdf
             */
            content_type: string;
            /**
             * @description Expected size of the new file in bytes (verified on upload)
             * @example 2097152
             */
            size: number;
            /** @description New filename (optional, keeps current if not provided) */
            filename?: string;
            /** @description New display label (optional, keeps current if not provided) */
            label?: string;
            /** @description New description */
            description?: string;
        };
        CreateFolderResponse: {
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
            /** @enum {string} */
            type: "folder";
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
             * @description Audit trail for edits
             * @example {
             *       "user_id": "01JCAPTAINAHAB000000000000",
             *       "method": "manual"
             *     }
             */
            edited_by: {
                user_id: string;
                /** @enum {string} */
                method: "manual" | "ai_generated" | "system" | "import";
                on_behalf_of?: string;
            };
        };
        CreateFolderRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /**
             * @description Display name for the folder
             * @example Research Documents
             */
            label: string;
            /** @description Short description */
            description?: string;
            /** @description Rich content description (markdown) */
            rich_description?: string;
            /** @description Flexible metadata */
            metadata?: {
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
            /**
             * @description Collection to add folder to (for permissions). Shortcut for adding a collection relationship.
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            collection?: string;
            /**
             * @description Parent folder ID (creates bidirectional relationship)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            parent?: string;
        };
        FolderResponse: components["schemas"]["EntityResponse"] & {
            /** @enum {string} */
            type?: "folder";
        };
        UpdateFolderResponse: components["schemas"]["FolderResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        UpdateFolderRequest: {
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
            /** @description New display name */
            label?: string;
            /** @description New description */
            description?: string;
            /** @description New rich description */
            rich_description?: string;
            /** @description New metadata (deep merged) */
            metadata?: {
                [key: string]: unknown;
            };
        };
        AddChildResponse: {
            folder: components["schemas"]["FolderResponse"] & unknown;
            /** @description Updated child info */
            child: {
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
        };
        AddChildRequest: {
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
             * @description Child entity ID to add (file or folder)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            child_id: string;
            /**
             * @description Expected CID of child (CAS guard, optional if child in open season)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_child_tip?: string;
        };
        RemoveChildResponse: {
            folder: components["schemas"]["FolderResponse"] & unknown;
            /** @description Updated child info */
            child: {
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
        };
        RemoveChildRequest: {
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
             * @description Expected CID of child (CAS guard)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_child_tip: string;
        };
        BulkAddChildrenResponse: {
            folder: components["schemas"]["FolderResponse"] & unknown;
            /** @description Children that were added */
            added: {
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
            }[];
            /** @description Children that were skipped (already existed) */
            skipped: string[];
        };
        BulkAddChildrenRequest: {
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
             * @description Children to add (max 50 per request)
             * @example [
             *       {
             *         "id": "01JFILE123ABCDEFGHJKMNPQRS"
             *       },
             *       {
             *         "id": "01JFOLDER456ABCDEFGHJKMNPQ",
             *         "type": "folder"
             *       }
             *     ]
             */
            children: {
                /**
                 * @description Entity ID (ULID format)
                 * @example 01KDETYWYWM0MJVKM8DK3AEXPY
                 */
                id: string;
                type?: string;
            }[];
        };
        AddParentResponse: {
            folder: components["schemas"]["FolderResponse"] & unknown;
            parent: components["schemas"]["FolderResponse"] & unknown;
        };
        AddParentRequest: {
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
             * @description Parent folder or collection ID to add
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            parent_id: string;
            /**
             * @description Expected CID of parent (CAS guard, optional if parent in open season)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_parent_tip?: string;
        };
        RemoveParentResponse: {
            folder: components["schemas"]["FolderResponse"] & unknown;
            parent: components["schemas"]["FolderResponse"] & unknown;
        };
        RemoveParentRequest: {
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
             * @description Expected CID of parent (CAS guard)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            expect_parent_tip: string;
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
             * @description Audit trail for edits
             * @example {
             *       "user_id": "01JCAPTAINAHAB000000000000",
             *       "method": "manual"
             *     }
             */
            edited_by: {
                user_id: string;
                /** @enum {string} */
                method: "manual" | "ai_generated" | "system" | "import";
                on_behalf_of?: string;
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
                 * @description Audit trail for edits
                 * @example {
                 *       "user_id": "01JCAPTAINAHAB000000000000",
                 *       "method": "manual"
                 *     }
                 */
                edited_by: {
                    user_id: string;
                    /** @enum {string} */
                    method: "manual" | "ai_generated" | "system" | "import";
                    on_behalf_of?: string;
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
             *       "file:download"
             *     ]
             */
            actions: string[];
            /**
             * @description All unique verbs (the part after the colon)
             * @example [
             *       "view",
             *       "create",
             *       "update",
             *       "delete",
             *       "download"
             *     ]
             */
            verbs: string[];
            /**
             * @description All unique types (the part before the colon)
             * @example [
             *       "entity",
             *       "user",
             *       "collection",
             *       "file"
             *     ]
             */
            types: string[];
            /**
             * @description Verb implications. If you have a verb, you also have its implied verbs. Example: view implies download.
             * @example {
             *       "view": [
             *         "download"
             *       ],
             *       "update": [
             *         "reupload"
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
        AgentResponse: components["schemas"]["EntityResponse"] & {
            /** @enum {string} */
            type?: "agent";
            /** @description Warnings about sub-agent references that could not be validated. Present only when uses_agents contains references to non-existent, non-agent, or disabled entities. */
            warnings?: {
                /** @description The sub-agent ID that has an issue */
                sub_agent_id: string;
                /**
                 * @description Why this is a warning: not_found (entity does not exist), not_an_agent (entity exists but is not an agent), or disabled (agent is disabled)
                 * @enum {string}
                 */
                reason: "not_found" | "not_an_agent" | "disabled";
                /** @description Human-readable explanation */
                message: string;
            }[];
        };
        CreateAgentRequest: {
            /**
             * @description Optional note describing this change
             * @example Added Chapter 42: The Whiteness of the Whale
             */
            note?: string;
            /** @description Custom entity ID (generated if not provided) */
            id?: string;
            /**
             * @description Agent display name
             * @example OCR Processor
             */
            label: string;
            /**
             * Format: uri
             * @description Agent service base URL
             * @example https://ocr.example.com/v1
             */
            endpoint: string;
            /**
             * @description Actions this agent requires on target collections
             * @example [
             *       "entity:view",
             *       "entity:update",
             *       "file:create"
             *     ]
             */
            actions_required: string[];
            /** @description Collection to place agent in */
            collection: string;
            /**
             * @description Agent description
             * @example Extracts text from scanned documents using OCR
             */
            description?: string;
            /** @description Sub-agents this orchestrator delegates work to. Only provide the sub-agent ID (pi) - their permissions are fetched dynamically at invocation time. Warnings are returned if any referenced sub-agents do not exist or are disabled. */
            uses_agents?: {
                /** @description Sub-agent entity ID. The sub-agent's actions_required will be fetched dynamically at invocation time. */
                pi: string;
                /** @description Optional display label override (defaults to sub-agent's own label) */
                label?: string;
                /** @description Optional description of the sub-agent's role in this orchestrator's workflow */
                description?: string;
            }[];
            /** @description JSON Schema for input validation */
            input_schema?: {
                [key: string]: unknown;
            };
            /** @description JSON Schema for output description */
            output_schema?: {
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
        AgentUpdateResponse: components["schemas"]["AgentResponse"] & {
            /**
             * @description Previous version CID
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid: string;
        };
        UpdateAgentRequest: {
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
            /** @description Updated agent display name */
            label?: string;
            /** @description Updated agent description */
            description?: string;
            /**
             * Format: uri
             * @description Updated agent service URL
             */
            endpoint?: string;
            /**
             * @description Actions this agent requires on target collections
             * @example [
             *       "entity:view",
             *       "entity:update",
             *       "file:create"
             *     ]
             */
            actions_required?: string[];
            /**
             * @description Agent status
             * @example development
             * @enum {string}
             */
            status?: "development" | "active" | "disabled";
            /** @description Updated sub-agent references. Only provide sub-agent IDs (pi) - their permissions are fetched dynamically at invocation time. */
            uses_agents?: {
                /** @description Sub-agent entity ID. The sub-agent's actions_required will be fetched dynamically at invocation time. */
                pi: string;
                /** @description Optional display label override (defaults to sub-agent's own label) */
                label?: string;
                /** @description Optional description of the sub-agent's role in this orchestrator's workflow */
                description?: string;
            }[];
            /** @description Updated input schema */
            input_schema?: {
                [key: string]: unknown;
            };
            /** @description Updated output schema */
            output_schema?: {
                [key: string]: unknown;
            };
        };
        InvokeGrant: {
            agent: {
                id: string;
                label: string;
            };
            actions: string[];
            role: string;
            already_granted: boolean;
            expired?: boolean;
            missing_actions?: boolean;
            /** Format: date-time */
            current_expires_at?: string;
        };
        InvokePreviewResponse: {
            /** @enum {string} */
            status: "pending_confirmation";
            message: string;
            grants: components["schemas"]["InvokeGrant"][];
            target: {
                id: string;
                label: string;
            };
            /** Format: date-time */
            expires_at: string;
            /** @description True if all grants exist or user can create them */
            can_proceed: boolean;
            /** @description True if some agents need permission grants */
            grants_needed: boolean;
            /** @description Warnings about sub-agents that were skipped */
            warnings?: {
                /** @description The sub-agent ID that could not be resolved */
                sub_agent_id: string;
                /** @description The orchestrator or parent agent that declared this sub-agent reference */
                parent_agent_id: string;
                /**
                 * @description Why the sub-agent was skipped: not_found (entity does not exist) or disabled (agent status is disabled)
                 * @enum {string}
                 */
                reason: "not_found" | "disabled";
                /** @description Human-readable explanation of the warning */
                message: string;
            }[];
        };
        InvokeGrantResult: {
            agent_id: string;
            role: string;
            /** Format: date-time */
            expires_at: string;
            was_update: boolean;
        };
        InvokeStartedResponse: {
            /** @enum {string} */
            status: "started";
            /**
             * @description Unique job identifier
             * @example job_01JEXAMPLEID12345678901
             */
            job_id: string;
            /** @description The job collection where agent writes logs */
            job_collection: string;
            grants: components["schemas"]["InvokeGrantResult"][];
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            target_cid: string;
            /** Format: date-time */
            expires_at: string;
        };
        InvokeRejectedResponse: {
            /** @enum {string} */
            status: "rejected";
            /** @description Error message explaining why the agent rejected the job */
            error: string;
            /** @description Suggested seconds to wait before retrying */
            retry_after?: number;
            grants: components["schemas"]["InvokeGrantResult"][];
            /**
             * @description Content Identifier (CID) - content-addressed hash
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            target_cid: string;
            /** Format: date-time */
            expires_at: string;
        };
        InvokeConfirmedResponse: components["schemas"]["InvokeStartedResponse"] | components["schemas"]["InvokeRejectedResponse"];
        InvokeAgentRequest: {
            /** @description Collection ID to grant the agent access to. All agent permissions are collection-scoped. */
            target: string;
            /** @description Job collection where agent should write logs. If not provided, creates new root collection. */
            job_collection?: string;
            /** @description Input data for the agent (validated against agent input_schema) */
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
             * @description false = preview grants, true = execute agent
             * @default false
             * @example false
             */
            confirm: boolean;
        };
        CreateAgentApiKeyResponse: {
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
        CreateAgentApiKeyRequest: {
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
        AgentApiKeyInfo: {
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
        ListAgentApiKeysResponse: {
            keys: components["schemas"]["AgentApiKeyInfo"][];
        };
        VerifyAgentTokenResponse: {
            /**
             * @description Token to deploy at your endpoint
             * @example vt_abc123def456...
             */
            verification_token: string;
            /** @description Agent ID to include in verification response */
            agent_id: string;
            /**
             * Format: uri
             * @description Your agent endpoint URL
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
        VerifyAgentSuccessResponse: {
            /** @enum {boolean} */
            verified: true;
            /**
             * Format: date-time
             * @description When the endpoint was verified
             */
            verified_at: string;
        };
        VerifyAgentFailureResponse: {
            /** @enum {boolean} */
            verified: false;
            /**
             * @description Verification error code
             * @enum {string}
             */
            error: "no_token" | "token_expired" | "fetch_failed" | "invalid_response" | "token_mismatch" | "agent_id_mismatch";
            /** @description Human-readable error description */
            message: string;
        };
        VerifyAgentRequest: {
            /**
             * @description Set to true to perform verification. Omit or false to generate/get verification token.
             * @example true
             */
            confirm?: boolean;
        };
        EntityRef: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            pi: string;
            type?: string;
            label?: string;
        };
        JobStatusResponse: {
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
             * @description Job collection status
             * @example running
             * @enum {string}
             */
            status: "running" | "done" | "error";
            /**
             * Format: date-time
             * @description ISO 8601 datetime
             * @example 2025-12-26T12:00:00.000Z
             */
            started_at: string;
            /**
             * Format: date-time
             * @description ISO 8601 datetime
             * @example 2025-12-26T12:00:00.000Z
             */
            completed_at: string | null;
            agent: components["schemas"]["EntityRef"];
            target?: components["schemas"]["EntityRef"];
            main_agent?: components["schemas"]["EntityRef"];
            /**
             * @description Number of files contained in this job collection
             * @example 5
             */
            files_count: number;
            /**
             * @description Number of sub-job collections
             * @example 2
             */
            sub_jobs_count: number;
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
            pi: string;
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
        PathEdge: {
            /**
             * @description Source entity PI
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            subject_pi: string;
            /** @description Source entity label */
            subject_label: string;
            /** @description Source entity type */
            subject_type: string;
            /** @description Relationship predicate */
            predicate: string;
            /**
             * @description Target entity PI
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            object_pi: string;
            /** @description Target entity label */
            object_label: string;
            /** @description Target entity type */
            object_type: string;
        };
        PathResult: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            source_pi: string;
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            target_pi: string;
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
            source_pis: string[];
            /**
             * @description Target entity PIs
             * @example [
             *       "01KE506KZGD8M2P1XK3VNQT4YR"
             *     ]
             */
            target_pis: string[];
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
        ReachableResult: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            source_pi: string;
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            target_pi: string;
            target_label: string;
            target_type: string;
            /** @description Path length (number of hops) */
            length: number;
            edges: components["schemas"]["PathEdge"][];
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
            source_pis: string[];
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
        RelationshipInfo: {
            /** @enum {string} */
            direction: "outgoing" | "incoming";
            predicate: string;
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            peer_pi: string;
            peer_type: string;
            peer_label: string;
            properties: {
                [key: string]: unknown;
            };
        };
        GraphEntityResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            pi: string;
            type: string;
            label: string;
            collection_pi: string | null;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            updated_at: string;
            relationships: components["schemas"]["RelationshipInfo"][];
        };
        QueryEntity: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            pi: string;
            type: string;
            label: string;
            collection_pi: string | null;
        };
        EntityStep: {
            entity: string;
            label?: string;
            type?: string;
            score?: number;
        };
        EdgeStep: {
            edge: string;
            /** @enum {string} */
            direction: "outgoing" | "incoming";
            score?: number;
        };
        PathStep: components["schemas"]["EntityStep"] | components["schemas"]["EdgeStep"];
        QueryResultItem: {
            entity: components["schemas"]["QueryEntity"];
            path: components["schemas"]["PathStep"][];
            score: number;
        };
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
            results: components["schemas"]["QueryResultItem"][];
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
            pi: string;
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
            pi: string;
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
                pi: string;
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
