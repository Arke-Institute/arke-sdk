/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 *
 * This file was generated from the Arke v1 OpenAPI spec.
 * To regenerate, run: npm run generate
 *
 * Source: Arke v1 API
 * Version: 1.0.0
 * Generated: 2026-01-01T18:48:14.305Z
 */

export type paths = {
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
         * @description Updates any entity with merge semantics. Properties are deep merged, relationships use upsert semantics. Use properties_remove and relationships_remove for deletions. Note: entity:update on a collection requires collection:update permission.
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
         *     If `target_predicate` is provided, creates a **bidirectional** relationship:
         *     - Adds `source_predicate` relationship on source pointing to target
         *     - Adds `target_predicate` relationship on target pointing to source
         *     - Requires `entity:update` permission on both entities
         *
         *     If `target_predicate` is omitted, creates a **unidirectional** relationship:
         *     - Adds `source_predicate` relationship on source pointing to target
         *     - Requires `entity:update` permission on source only
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
         *     If `target_predicate` is provided, removes a **bidirectional** relationship:
         *     - Removes `source_predicate` relationship from source
         *     - Removes `target_predicate` relationship from target
         *     - Requires `entity:update` permission on both entities
         *
         *     If `target_predicate` is omitted, removes a **unidirectional** relationship:
         *     - Removes `source_predicate` relationship from source
         *     - Requires `entity:update` permission on source only
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
         * @description Creates a new file entity and returns a presigned upload URL.
         *
         *     ## Flow
         *     1. Call this endpoint with file metadata (key, filename, content_type, size)
         *     2. Receive entity data + presigned S3 upload URL (uploaded: false)
         *     3. PUT the file content to the upload URL
         *     4. Call POST /{id}/confirm-upload to verify and set uploaded: true
         *
         *     ## Key Best Practice
         *     Use the file's CID as the key for content-addressable storage.
         *     The system does NOT verify the CID - it's just metadata.
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
         * @description Returns file entity metadata. Use /download to get the file content.
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
         *     The key can be changed, but ONLY to a key that already exists in S3.
         *     This allows "regressing" to a previous file version.
         *
         *     To upload a new file, use POST /{id}/reupload instead.
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
    "/files/{id}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get download URL
         * @description Returns a presigned URL for downloading the file content. URL expires in 5 minutes.
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
                /** @description Download URL generated */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DownloadResponse"];
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
         * Upload new file version
         * @description Uploads a new version of a file.
         *
         *     ## Flow
         *     1. Call this endpoint with new key and file metadata
         *     2. Receive updated entity + presigned upload URL (uploaded: false)
         *     3. PUT the new file content to the upload URL
         *     4. Call POST /{id}/confirm-upload to verify and set uploaded: true
         *     5. Old file versions remain accessible via manifest history
         *
         *     ## Key Requirement
         *     The new key must NOT already exist in S3 (no overwrites).
         *     Previous file versions are preserved.
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
                /** @description File version created */
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
    "/files/{id}/confirm-upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Confirm upload completed
         * @description Confirms that file content has been uploaded to S3.
         *
         *     ## Flow
         *     1. Create file entity (POST /files) - sets uploaded: false
         *     2. PUT file content to the presigned upload URL
         *     3. Call this endpoint to confirm - verifies file exists in S3, sets uploaded: true
         *
         *     ## Verification
         *     The server verifies the file exists in S3 before setting uploaded: true.
         *     If the file doesn't exist, returns 400 error.
         *
         *     ## Idempotency
         *     If already uploaded: true, returns success without modification.
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
                    "application/json": components["schemas"]["ConfirmUploadRequest"];
                };
            };
            responses: {
                /** @description Upload confirmed */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ConfirmUploadResponse"];
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
         *     **Two-phase interaction:**
         *     1. First call with `confirm: false` (default) returns a preview of permissions that will be granted
         *     2. After user reviews and confirms, call again with `confirm: true` to execute
         *
         *     The agent receives temporal (time-limited) permissions on the target collection.
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
    "/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List events
         * @description Returns entity change events in reverse chronological order (newest first).
         *
         *     Each event represents a create or update operation on an entity. Use cursor-based pagination to walk through the event history.
         *
         *     **Use cases:**
         *     - Syncing entity changes to external systems
         *     - Building search indexes
         *     - Change tracking and audit logs
         *
         *     **Note:** This endpoint is public. Access control is enforced at the entity level - if you don't have permission to view an entity, you won't be able to fetch its manifest even if you see an event for it.
         */
        get: {
            parameters: {
                query?: {
                    /** @description Maximum events to return (1-100, default 50) */
                    limit?: number;
                    /** @description Event CID to continue from (for pagination) */
                    cursor?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Event list */
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
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        RegisterUser: {
            /** @example 01J1SHMAE10000000000000000 */
            id: string;
            /**
             * @description IPFS Content Identifier (CID)
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
             * @description IPFS Content Identifier (CID)
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
            /** @description Properties to remove */
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
            /** @description Properties to remove */
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
             * @description IPFS Content Identifier (CID)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description IPFS Content Identifier (CID)
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
             * @description IPFS Content Identifier (CID)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description IPFS Content Identifier (CID)
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
             * @description IPFS Content Identifier (CID)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            cid: string;
            /**
             * @description IPFS Content Identifier (CID)
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
        EntityCreatedResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description IPFS Content Identifier (CID)
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
             * @description Entity properties (type-specific)
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
            /** @description Properties to remove */
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
        CreateFileResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description IPFS Content Identifier (CID)
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
             * Format: uri
             * @description Presigned S3 URL for uploading file content
             * @example https://arke-blocks.s3.amazonaws.com/01JFILE123.../v1?X-Amz-...
             */
            upload_url: string;
            /**
             * Format: date-time
             * @description When the upload URL expires (15 minutes)
             * @example 2025-12-26T12:00:00.000Z
             */
            upload_expires_at: string;
        };
        CreateFileRequest: {
            /**
             * @description Storage key in S3. Best practice: use the CID.
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
             * @description File size in bytes
             * @example 1048576
             */
            size: number;
            /**
             * @description Content identifier (CID). Not verified, just metadata.
             * @example bafkreiabc123...
             */
            cid?: string;
            /**
             * @description Description of the file
             * @example Q4 Financial Report
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
        DownloadResponse: {
            /**
             * Format: uri
             * @description Presigned S3 URL for downloading file content
             * @example https://arke-blocks.s3.amazonaws.com/01JFILE123.../v1?X-Amz-...
             */
            download_url: string;
            /**
             * Format: date-time
             * @description When the download URL expires (5 minutes)
             * @example 2025-12-26T12:00:00.000Z
             */
            expires_at: string;
            /**
             * @description Filename for download
             * @example document.pdf
             */
            filename: string;
            /**
             * @description MIME type of the file
             * @example application/pdf
             */
            content_type: string;
            /**
             * @description File size in bytes
             * @example 1048576
             */
            size: number;
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
            /** @description Properties to remove */
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
            /** @description New storage key. Must already exist in S3 (for regression to old version). */
            key?: string;
            /** @description New filename */
            filename?: string;
            /** @description New MIME type */
            content_type?: string;
            /** @description New file size in bytes */
            size?: number;
            /** @description New content identifier */
            cid?: string;
            /** @description New description */
            description?: string;
        };
        ReuploadFileResponse: components["schemas"]["UpdateFileResponse"] & {
            /**
             * Format: uri
             * @description Presigned S3 URL for uploading new file content
             */
            upload_url: string;
            /**
             * Format: date-time
             * @description When the upload URL expires (15 minutes)
             * @example 2025-12-26T12:00:00.000Z
             */
            upload_expires_at: string;
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
             * @description New storage key. Must NOT already exist in S3.
             * @example v2
             */
            key: string;
            /**
             * @description MIME type of the new file
             * @example application/pdf
             */
            content_type: string;
            /**
             * @description Size of the new file in bytes
             * @example 2097152
             */
            size: number;
            /** @description New filename (optional, keeps current if not provided) */
            filename?: string;
            /** @description Content identifier for new file */
            cid?: string;
            /** @description New description */
            description?: string;
        };
        ConfirmUploadResponse: components["schemas"]["FileResponse"] & {
            /**
             * @description Previous version CID. Not present if upload was already confirmed.
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            prev_cid?: string;
            /**
             * @description True if upload was already confirmed. Entity was not modified.
             * @example false
             */
            already_confirmed: boolean;
        };
        ConfirmUploadRequest: {
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
        CreateFolderResponse: {
            /**
             * @description Entity ID (ULID format)
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            id: string;
            /**
             * @description IPFS Content Identifier (CID)
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
            /** @description Properties to remove */
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
                 * @description IPFS Content Identifier (CID)
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
                 * @description IPFS Content Identifier (CID)
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
                 * @description IPFS Content Identifier (CID)
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
             * @description IPFS Content Identifier (CID)
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
             * @description IPFS Content Identifier (CID)
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
        };
        SubAgentRef: {
            pi: string;
            /** @description Display label for the sub-agent */
            label?: string;
            /** @description Description of the sub-agent role */
            description?: string;
            /**
             * @description Actions this sub-agent requires
             * @example [
             *       "entity:view",
             *       "entity:update"
             *     ]
             */
            actions_required: string[];
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
            /** @description Sub-agents used by this orchestrator */
            uses_agents?: components["schemas"]["SubAgentRef"][];
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
            /** @description Properties to remove */
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
            /** @description Updated sub-agents */
            uses_agents?: components["schemas"]["SubAgentRef"][];
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
             * @description IPFS Content Identifier (CID)
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
             * @description IPFS Content Identifier (CID)
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            target_cid: string;
            /** Format: date-time */
            expires_at: string;
        };
        InvokeConfirmedResponse: components["schemas"]["InvokeStartedResponse"] | components["schemas"]["InvokeRejectedResponse"];
        InvokeAgentRequest: {
            /** @description Target collection ID to operate on */
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
        EventItem: {
            /**
             * @description CID of this event in the event chain
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            event_cid: string;
            /**
             * @description Type of entity change event
             * @example create
             * @enum {string}
             */
            type: "create" | "update";
            /**
             * @description Entity ID that was created or updated
             * @example 01KDETYWYWM0MJVKM8DK3AEXPY
             */
            pi: string;
            /**
             * @description Entity version number
             * @example 1
             */
            ver: number;
            /**
             * @description CID of the entity manifest at this version
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            tip_cid: string;
            /**
             * Format: date-time
             * @description When the event was recorded
             * @example 2025-12-26T12:00:00.000Z
             */
            ts: string;
        };
        EventsListResponse: {
            /** @description Events in reverse chronological order */
            items: components["schemas"]["EventItem"][];
            /**
             * @description Total events in the event chain
             * @example 1542
             */
            total_events: number;
            /**
             * @description Total unique entity IDs across all events
             * @example 987
             */
            total_pis: number;
            /** @description Whether more events exist beyond this page */
            has_more: boolean;
            /**
             * @description CID to use as "cursor" parameter for next page
             * @example bafyreibug443cnd4endcwinwttw3c3dzmcl2ikht64xzn5qg56bix3usfy
             */
            next_cursor: string | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
