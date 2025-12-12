/**
 * Arke SDK - Edit Package
 *
 * Provides intelligent editing capabilities for Arke entities:
 * - Direct content editing with version control
 * - AI-powered regeneration of components (pinax, description, cheimarros)
 * - Cascade updates up the entity tree
 *
 * @example
 * ```typescript
 * import { EditClient, EditSession } from '@arke-institute/sdk/edit';
 *
 * const client = new EditClient({
 *   gatewayUrl: 'https://gateway.arke.io',
 *   authToken: 'your-jwt-token',
 * });
 *
 * // Create an edit session for an entity
 * const session = new EditSession(client, 'PI_HERE', {
 *   mode: 'ai-prompt',
 * });
 *
 * // Load the entity
 * await session.load();
 *
 * // Set a prompt for AI regeneration
 * session.setPrompt('general', 'Fix any OCR errors and improve the description.');
 * session.setScope({ components: ['description', 'pinax'], cascade: true });
 *
 * // Submit and wait for completion
 * const result = await session.submit('Fix OCR errors');
 * const status = await session.waitForCompletion();
 * ```
 */

// Client
export { EditClient, type EditClientConfig } from './client';

// Session
export { EditSession } from './session';

// Types
export type {
  // Configuration
  EditMode,
  EditSessionConfig,
  // Entity
  Entity,
  EntityUpdate,
  EntityVersion,
  // Edit
  RegeneratableComponent,
  EditScope,
  Correction,
  // Diff
  DiffType,
  TextDiff,
  ComponentDiff,
  // Prompt
  PromptTarget,
  EntityContext,
  CascadeContext,
  // Reprocess
  CustomPrompts,
  ReprocessRequest,
  ReprocessResult,
  ReprocessPhase,
  ReprocessProgress,
  ReprocessStatus,
  // Results
  SaveResult,
  EditResult,
  EditPhase,
  EditStatus,
  PollOptions,
  // Summary
  ChangeSummary,
} from './types';

// Errors
export {
  EditError,
  EntityNotFoundError,
  CASConflictError,
  ReprocessError,
  ValidationError,
  PermissionError,
} from './errors';

// Utilities (for advanced use cases)
export { DiffEngine } from './diff';
export { PromptBuilder } from './prompts';
