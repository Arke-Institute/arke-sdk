/**
 * EditSession - Stateful session managing an edit workflow
 */

import { EditClient } from './client';
import { DiffEngine } from './diff';
import { PromptBuilder } from './prompts';
import type {
  Entity,
  EditMode,
  EditSessionConfig,
  EditScope,
  Correction,
  ComponentDiff,
  RegeneratableComponent,
  PromptTarget,
  ChangeSummary,
  EditResult,
  EditStatus,
  PollOptions,
  CustomPrompts,
} from './types';
import { ValidationError } from './errors';

const DEFAULT_SCOPE: EditScope = {
  components: [],
  cascade: false,
};

const DEFAULT_POLL_OPTIONS: Required<Omit<PollOptions, 'onProgress'>> = {
  intervalMs: 2000,
  timeoutMs: 300000, // 5 minutes
};

export class EditSession {
  readonly pi: string;
  readonly mode: EditMode;
  readonly aiReviewEnabled: boolean;

  private client: EditClient;
  private entity: Entity | null = null;
  private loadedComponents: Record<string, string> = {};

  // AI mode state
  private prompts: Record<string, string> = {};

  // Manual mode state
  private editedContent: Record<string, string> = {};
  private corrections: Correction[] = [];

  // Scope
  private scope: EditScope = { ...DEFAULT_SCOPE };

  // Execution state
  private submitting = false;
  private result: EditResult | null = null;
  private statusUrl: string | null = null;

  constructor(client: EditClient, pi: string, config?: EditSessionConfig) {
    this.client = client;
    this.pi = pi;
    this.mode = config?.mode ?? 'ai-prompt';
    this.aiReviewEnabled = config?.aiReviewEnabled ?? true;
  }

  // ===========================================================================
  // Loading
  // ===========================================================================

  /**
   * Load the entity and its key components
   */
  async load(): Promise<void> {
    this.entity = await this.client.getEntity(this.pi);

    // Load key components that are commonly edited
    const priorityComponents = ['description.md', 'pinax.json', 'cheimarros.json'];

    await Promise.all(
      priorityComponents.map(async (name) => {
        const cid = this.entity!.components[name];
        if (cid) {
          try {
            this.loadedComponents[name] = await this.client.getContent(cid);
          } catch {
            // Component may not exist, that's ok
          }
        }
      })
    );
  }

  /**
   * Load a specific component on demand
   */
  async loadComponent(name: string): Promise<string | undefined> {
    if (this.loadedComponents[name]) {
      return this.loadedComponents[name];
    }

    if (!this.entity) {
      throw new ValidationError('Session not loaded');
    }

    const cid = this.entity.components[name];
    if (!cid) {
      return undefined;
    }

    const content = await this.client.getContent(cid);
    this.loadedComponents[name] = content;
    return content;
  }

  /**
   * Get the loaded entity
   */
  getEntity(): Entity {
    if (!this.entity) {
      throw new ValidationError('Session not loaded. Call load() first.');
    }
    return this.entity;
  }

  /**
   * Get loaded component content
   */
  getComponents(): Record<string, string> {
    return { ...this.loadedComponents };
  }

  // ===========================================================================
  // AI Prompt Mode
  // ===========================================================================

  /**
   * Set a prompt for AI regeneration
   */
  setPrompt(target: PromptTarget, prompt: string): void {
    if (this.mode === 'manual-only') {
      throw new ValidationError('Cannot set prompts in manual-only mode');
    }
    this.prompts[target] = prompt;
  }

  /**
   * Get all prompts
   */
  getPrompts(): Record<string, string> {
    return { ...this.prompts };
  }

  /**
   * Clear a prompt
   */
  clearPrompt(target: PromptTarget): void {
    delete this.prompts[target];
  }

  // ===========================================================================
  // Manual Edit Mode
  // ===========================================================================

  /**
   * Set edited content for a component
   */
  setContent(componentName: string, content: string): void {
    if (this.mode === 'ai-prompt') {
      throw new ValidationError('Cannot set content in ai-prompt mode');
    }
    this.editedContent[componentName] = content;
  }

  /**
   * Get all edited content
   */
  getEditedContent(): Record<string, string> {
    return { ...this.editedContent };
  }

  /**
   * Clear edited content for a component
   */
  clearContent(componentName: string): void {
    delete this.editedContent[componentName];
  }

  /**
   * Add a correction (for OCR fixes, etc.)
   */
  addCorrection(original: string, corrected: string, sourceFile?: string): void {
    this.corrections.push({ original, corrected, sourceFile });
  }

  /**
   * Get all corrections
   */
  getCorrections(): Correction[] {
    return [...this.corrections];
  }

  /**
   * Clear corrections
   */
  clearCorrections(): void {
    this.corrections = [];
  }

  // ===========================================================================
  // Scope Configuration
  // ===========================================================================

  /**
   * Set the edit scope
   */
  setScope(scope: Partial<EditScope>): void {
    this.scope = { ...this.scope, ...scope };
  }

  /**
   * Get the current scope
   */
  getScope(): EditScope {
    return { ...this.scope };
  }

  // ===========================================================================
  // Preview & Summary
  // ===========================================================================

  /**
   * Get diffs for manual changes
   */
  getDiff(): ComponentDiff[] {
    const diffs: ComponentDiff[] = [];

    for (const [name, edited] of Object.entries(this.editedContent)) {
      const original = this.loadedComponents[name] || '';
      if (DiffEngine.hasSignificantChanges(original, edited)) {
        diffs.push(DiffEngine.createComponentDiff(name, original, edited));
      }
    }

    return diffs;
  }

  /**
   * Preview what prompts will be sent to AI
   */
  previewPrompt(): Record<RegeneratableComponent, string> {
    const result: Record<string, string> = {};

    if (!this.entity) return result as Record<RegeneratableComponent, string>;

    const entityContext = {
      pi: this.entity.id,
      ver: this.entity.ver,
      parentPi: this.entity.parent_pi,
      childrenCount: this.entity.children_pi?.length ?? 0,
      currentContent: this.loadedComponents,
    };

    for (const component of this.scope.components) {
      let prompt: string;

      if (this.mode === 'ai-prompt') {
        // AI prompt mode: use user's prompt
        const componentPrompt = this.prompts[component];
        const generalPrompt = this.prompts['general'];
        const combined = PromptBuilder.buildCombinedPrompt(generalPrompt, componentPrompt, component);
        prompt = PromptBuilder.buildAIPrompt(
          combined,
          component,
          entityContext,
          this.loadedComponents[`${component}.json`] || this.loadedComponents[`${component}.md`]
        );
      } else {
        // Manual mode: build from diffs and corrections
        const diffs = this.getDiff();
        const userInstructions = this.prompts['general'] || this.prompts[component];
        prompt = PromptBuilder.buildEditReviewPrompt(diffs, this.corrections, component, userInstructions);
      }

      // Add cascade context if applicable
      if (this.scope.cascade) {
        prompt = PromptBuilder.buildCascadePrompt(prompt, {
          path: [this.entity.id, this.entity.parent_pi || 'root'].filter(Boolean) as string[],
          depth: 0,
          stopAtPi: this.scope.stopAtPi,
        });
      }

      result[component] = prompt;
    }

    return result as Record<RegeneratableComponent, string>;
  }

  /**
   * Get a summary of pending changes
   */
  getChangeSummary(): ChangeSummary {
    const diffs = this.getDiff();
    const hasManualEdits = diffs.some((d) => d.hasChanges);

    return {
      mode: this.mode,
      hasManualEdits,
      editedComponents: Object.keys(this.editedContent),
      corrections: [...this.corrections],
      prompts: { ...this.prompts },
      scope: { ...this.scope },
      willRegenerate: [...this.scope.components],
      willCascade: this.scope.cascade,
      willSave: hasManualEdits,
      willReprocess: this.scope.components.length > 0,
    };
  }

  // ===========================================================================
  // Execution
  // ===========================================================================

  /**
   * Submit changes (saves first if manual edits, then reprocesses)
   */
  async submit(note: string): Promise<EditResult> {
    if (this.submitting) {
      throw new ValidationError('Submit already in progress');
    }
    if (!this.entity) {
      throw new ValidationError('Session not loaded. Call load() first.');
    }

    this.submitting = true;
    this.result = {};

    try {
      // Phase 1: Save manual edits if any
      const diffs = this.getDiff();
      const hasManualEdits = diffs.some((d) => d.hasChanges);

      if (hasManualEdits) {
        // Upload edited components and collect CIDs
        const componentUpdates: Record<string, string> = {};

        for (const [name, content] of Object.entries(this.editedContent)) {
          const original = this.loadedComponents[name] || '';
          if (DiffEngine.hasSignificantChanges(original, content)) {
            const cid = await this.client.uploadContent(content, name);
            componentUpdates[name] = cid;
          }
        }

        // Update entity
        const version = await this.client.updateEntity(this.pi, {
          expect_tip: this.entity.manifest_cid,
          components: componentUpdates,
          note,
        });

        this.result.saved = {
          pi: version.id,
          newVersion: version.ver,
          newTip: version.tip,
        };

        // Update our entity reference
        this.entity.manifest_cid = version.tip;
        this.entity.ver = version.ver;
      }

      // Phase 2: Trigger reprocessing if components selected
      if (this.scope.components.length > 0) {
        const customPrompts = this.buildCustomPrompts();

        const reprocessResult = await this.client.reprocess({
          pi: this.pi,
          phases: this.scope.components,
          cascade: this.scope.cascade,
          options: {
            stop_at_pi: this.scope.stopAtPi,
            custom_prompts: customPrompts,
            custom_note: note,
          },
        });

        this.result.reprocess = reprocessResult;
        this.statusUrl = reprocessResult.status_url;
      }

      return this.result;
    } finally {
      this.submitting = false;
    }
  }

  /**
   * Wait for reprocessing to complete
   */
  async waitForCompletion(options?: PollOptions): Promise<EditStatus> {
    const opts = { ...DEFAULT_POLL_OPTIONS, ...options };

    if (!this.statusUrl) {
      return {
        phase: 'complete',
        saveComplete: true,
      };
    }

    const startTime = Date.now();
    let isFirstPoll = true;

    while (true) {
      // Pass isFirstPoll flag - the client will use longer retry delays on first poll
      // since the orchestrator often needs time to initialize after reprocess is triggered
      const status = await this.client.getReprocessStatus(this.statusUrl, isFirstPoll);
      isFirstPoll = false;

      const editStatus: EditStatus = {
        phase: status.status === 'DONE' ? 'complete' : status.status === 'ERROR' ? 'error' : 'reprocessing',
        saveComplete: true,
        reprocessStatus: status,
        error: status.error,
      };

      if (opts.onProgress) {
        opts.onProgress(editStatus);
      }

      if (status.status === 'DONE' || status.status === 'ERROR') {
        return editStatus;
      }

      if (Date.now() - startTime > opts.timeoutMs) {
        return {
          phase: 'error',
          saveComplete: true,
          reprocessStatus: status,
          error: 'Timeout waiting for reprocessing to complete',
        };
      }

      await new Promise((resolve) => setTimeout(resolve, opts.intervalMs));
    }
  }

  /**
   * Get current status without waiting
   */
  async getStatus(): Promise<EditStatus> {
    if (!this.statusUrl) {
      return {
        phase: this.result?.saved ? 'complete' : 'idle',
        saveComplete: !!this.result?.saved,
      };
    }

    const status = await this.client.getReprocessStatus(this.statusUrl);

    return {
      phase: status.status === 'DONE' ? 'complete' : status.status === 'ERROR' ? 'error' : 'reprocessing',
      saveComplete: true,
      reprocessStatus: status,
      error: status.error,
    };
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  private buildCustomPrompts(): CustomPrompts {
    const custom: CustomPrompts = {};

    // In AI prompt mode, prompts go directly to reprocess API
    if (this.mode === 'ai-prompt') {
      if (this.prompts['general']) custom.general = this.prompts['general'];
      if (this.prompts['pinax']) custom.pinax = this.prompts['pinax'];
      if (this.prompts['description']) custom.description = this.prompts['description'];
      if (this.prompts['cheimarros']) custom.cheimarros = this.prompts['cheimarros'];
    } else {
      // Manual mode: build prompts from diffs, corrections, and user instructions
      const diffs = this.getDiff();
      const diffContext = DiffEngine.formatComponentDiffsForPrompt(diffs);
      const correctionContext = PromptBuilder.buildCorrectionPrompt(this.corrections);

      // Combine all context: diffs + corrections + user instructions
      const basePrompt = [diffContext, correctionContext, this.prompts['general']]
        .filter(Boolean)
        .join('\n\n');

      if (basePrompt) {
        custom.general = basePrompt;
      }

      // Component-specific prompts
      if (this.prompts['pinax']) custom.pinax = this.prompts['pinax'];
      if (this.prompts['description']) custom.description = this.prompts['description'];
      if (this.prompts['cheimarros']) custom.cheimarros = this.prompts['cheimarros'];
    }

    return custom;
  }
}
