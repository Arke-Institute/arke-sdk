import { CollectionsError } from './errors';
import type {
  ChangeRootPayload,
  ChangeRootResponse,
  Collection,
  CollectionDetails,
  CollectionRole,
  CreateCollectionPayload,
  Invitation,
  InvitationsResponse,
  Member,
  MembersResponse,
  MyAccessResponse,
  MyCollectionsResponse,
  PaginatedCollections,
  PiPermissions,
  RegisterRootPayload,
  RootResponse,
  SuccessResponse,
  UpdateCollectionPayload,
} from './types';

export interface CollectionsClientConfig {
  /**
   * Gateway base URL (e.g., https://api.arke.institute).
   * Must already point at the Arke gateway that proxies /collections/*.
   */
  gatewayUrl: string;
  /**
   * Optional bearer token for authenticated routes.
   * Public routes will still include it if provided.
   */
  authToken?: string;
  /**
   * Optional custom fetch (useful for testing).
   */
  fetchImpl?: typeof fetch;
}

type JsonBody = Record<string, unknown>;

export class CollectionsClient {
  private baseUrl: string;
  private authToken?: string;
  private fetchImpl: typeof fetch;

  constructor(config: CollectionsClientConfig) {
    this.baseUrl = config.gatewayUrl.replace(/\/$/, '');
    this.authToken = config.authToken;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  setAuthToken(token?: string) {
    this.authToken = token;
  }

  // ---------------------------------------------------------------------------
  // Request helpers
  // ---------------------------------------------------------------------------

  private buildUrl(path: string, query?: Record<string, string | number | undefined>) {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private getHeaders(authRequired: boolean): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (authRequired || this.authToken) {
      if (!this.authToken && authRequired) {
        throw new CollectionsError('Authentication required for this operation', 'AUTH_REQUIRED');
      }
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }
    }
    return headers;
  }

  private async request<T>(
    path: string,
    options: RequestInit & {
      authRequired?: boolean;
      query?: Record<string, string | number | undefined>;
    } = {}
  ): Promise<T> {
    const authRequired = options.authRequired ?? false;
    const url = this.buildUrl(path, options.query);
    const headers = new Headers(this.getHeaders(authRequired));
    if (options.headers) {
      Object.entries(options.headers).forEach(([k, v]) => {
        if (v !== undefined) headers.set(k, v as string);
      });
    }

    const response = await this.fetchImpl(url, { ...options, headers });

    if (response.ok) {
      if (response.status === 204) {
        return undefined as T;
      }
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return (await response.json()) as T;
      }
      return (await response.text()) as unknown as T;
    }

    let body: unknown;
    const text = await response.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    const message =
      (body as JsonBody)?.error && typeof (body as JsonBody).error === 'string'
        ? ((body as JsonBody).error as string)
        : `Request failed with status ${response.status}`;

    throw new CollectionsError(message, 'HTTP_ERROR', {
      status: response.status,
      body,
    });
  }

  // ---------------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------------

  async listCollections(params?: { limit?: number; offset?: number }): Promise<PaginatedCollections> {
    return this.request('/collections', {
      method: 'GET',
      query: { limit: params?.limit, offset: params?.offset },
    });
  }

  async getCollection(id: string): Promise<CollectionDetails> {
    return this.request(`/collections/${id}`, { method: 'GET' });
  }

  async getCollectionRoot(id: string): Promise<RootResponse> {
    return this.request(`/collections/${id}/root`, { method: 'GET' });
  }

  async getMyAccess(id: string): Promise<MyAccessResponse> {
    return this.request(`/collections/${id}/my-access`, { method: 'GET', authRequired: true });
  }

  async createCollection(payload: CreateCollectionPayload): Promise<Collection> {
    return this.request('/collections', {
      method: 'POST',
      authRequired: true,
      body: JSON.stringify(payload),
    });
  }

  async registerRoot(payload: RegisterRootPayload): Promise<Collection & { rootPi: string }> {
    return this.request('/collections/register-root', {
      method: 'POST',
      authRequired: true,
      body: JSON.stringify(payload),
    });
  }

  async updateCollection(id: string, payload: UpdateCollectionPayload): Promise<Collection> {
    return this.request(`/collections/${id}`, {
      method: 'PATCH',
      authRequired: true,
      body: JSON.stringify(payload),
    });
  }

  async changeRoot(id: string, payload: ChangeRootPayload): Promise<ChangeRootResponse> {
    return this.request(`/collections/${id}/change-root`, {
      method: 'PATCH',
      authRequired: true,
      body: JSON.stringify(payload),
    });
  }

  async deleteCollection(id: string): Promise<SuccessResponse> {
    return this.request(`/collections/${id}`, {
      method: 'DELETE',
      authRequired: true,
    });
  }

  // ---------------------------------------------------------------------------
  // Members
  // ---------------------------------------------------------------------------

  async listMembers(collectionId: string): Promise<MembersResponse> {
    return this.request(`/collections/${collectionId}/members`, { method: 'GET' });
  }

  async updateMemberRole(
    collectionId: string,
    userId: string,
    role: CollectionRole
  ): Promise<{ success: true; role: CollectionRole }> {
    return this.request(`/collections/${collectionId}/members/${userId}`, {
      method: 'PATCH',
      authRequired: true,
      body: JSON.stringify({ role }),
    });
  }

  async removeMember(collectionId: string, userId: string): Promise<SuccessResponse> {
    return this.request(`/collections/${collectionId}/members/${userId}`, {
      method: 'DELETE',
      authRequired: true,
    });
  }

  // ---------------------------------------------------------------------------
  // Invitations
  // ---------------------------------------------------------------------------

  async createInvitation(collectionId: string, email: string, role: CollectionRole): Promise<Invitation> {
    return this.request(`/collections/${collectionId}/invitations`, {
      method: 'POST',
      authRequired: true,
      body: JSON.stringify({ email, role }),
    });
  }

  async listInvitations(collectionId: string): Promise<InvitationsResponse> {
    return this.request(`/collections/${collectionId}/invitations`, {
      method: 'GET',
      authRequired: true,
    });
  }

  async acceptInvitation(invitationId: string): Promise<{ success: true; role: CollectionRole }> {
    return this.request(`/invitations/${invitationId}/accept`, {
      method: 'POST',
      authRequired: true,
    });
  }

  async declineInvitation(invitationId: string): Promise<SuccessResponse> {
    return this.request(`/invitations/${invitationId}/decline`, {
      method: 'POST',
      authRequired: true,
    });
  }

  async revokeInvitation(invitationId: string): Promise<SuccessResponse> {
    return this.request(`/invitations/${invitationId}`, {
      method: 'DELETE',
      authRequired: true,
    });
  }

  // ---------------------------------------------------------------------------
  // Current user
  // ---------------------------------------------------------------------------

  async getMyCollections(): Promise<MyCollectionsResponse> {
    return this.request('/me/collections', { method: 'GET', authRequired: true });
  }

  async getMyInvitations(): Promise<InvitationsResponse> {
    return this.request('/me/invitations', { method: 'GET', authRequired: true });
  }

  // ---------------------------------------------------------------------------
  // PI permissions
  // ---------------------------------------------------------------------------

  async getPiPermissions(pi: string): Promise<PiPermissions> {
    return this.request(`/pi/${pi}/permissions`, { method: 'GET' });
  }
}
