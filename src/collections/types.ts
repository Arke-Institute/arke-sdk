export type CollectionVisibility = 'public' | 'private';
export type CollectionRole = 'owner' | 'editor';

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  visibility: CollectionVisibility;
  creator_user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionDetails extends Collection {
  member_count: number;
  root_pi: string | null;
  users?: {
    email?: string;
    name?: string | null;
  };
}

export interface PaginatedCollections {
  collections: CollectionDetails[];
  pagination: {
    total: number | null;
    limit: number;
    offset: number;
  };
}

export interface MemberUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface Member {
  role: CollectionRole;
  created_at?: string;
  user: MemberUser;
}

export interface MembersResponse {
  members: Member[];
}

export interface InvitationUser {
  email: string;
  name?: string | null;
}

export interface Invitation {
  id: string;
  role: CollectionRole;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string;
  created_at: string;
  responded_at?: string | null;
  invitee?: InvitationUser;
  inviter?: InvitationUser;
  collection?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface InvitationsResponse {
  invitations: Invitation[];
}

export interface CreateCollectionPayload {
  title: string;
  slug: string;
  description?: string;
  visibility?: CollectionVisibility;
}

export interface RegisterRootPayload extends CreateCollectionPayload {
  rootPi: string;
}

export interface UpdateCollectionPayload {
  title?: string;
  description?: string;
  visibility?: CollectionVisibility;
}

export interface ChangeRootPayload {
  newRootPi: string;
}

export interface MyCollectionsResponse {
  owned: Array<Collection & { role: CollectionRole }>;
  editing: Array<Collection & { role: CollectionRole }>;
  total: number;
}

export interface MyAccessResponse {
  isMember: boolean;
  role: CollectionRole | null;
  canView: boolean;
  canEdit: boolean;
  canInvite: boolean;
  canManageMembers: boolean;
  canDelete: boolean;
}

export interface RootResponse {
  rootPi: string;
}

export interface ChangeRootResponse {
  previousRoot: string | null;
  newRoot: string;
}

export interface SuccessResponse {
  success: boolean;
}

export interface PiPermissions {
  pi: string;
  canView: boolean;
  canEdit: boolean;
  canAdminister: boolean;
  collection: {
    id: string;
    title: string;
    slug: string;
    visibility: CollectionVisibility;
    role: CollectionRole | null;
    rootPi: string;
    hops: number;
  } | null;
}
