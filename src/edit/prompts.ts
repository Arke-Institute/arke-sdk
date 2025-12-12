/**
 * PromptBuilder - Context-aware AI prompt construction
 */

import { DiffEngine } from './diff';
import type {
  RegeneratableComponent,
  EntityContext,
  CascadeContext,
  ComponentDiff,
  Correction,
} from './types';

export class PromptBuilder {
  /**
   * Build prompt for AI-first mode (user provides instructions)
   */
  static buildAIPrompt(
    userPrompt: string,
    component: RegeneratableComponent,
    entityContext: EntityContext,
    currentContent?: string
  ): string {
    const sections: string[] = [];

    // User instruction
    sections.push(`## Instructions for ${component}`);
    sections.push(userPrompt);
    sections.push('');

    // Entity context
    sections.push('## Entity Context');
    sections.push(`- PI: ${entityContext.pi}`);
    sections.push(`- Current version: ${entityContext.ver}`);
    if (entityContext.parentPi) {
      sections.push(`- Parent: ${entityContext.parentPi}`);
    }
    if (entityContext.childrenCount > 0) {
      sections.push(`- Children: ${entityContext.childrenCount}`);
    }
    sections.push('');

    // Current content reference
    if (currentContent) {
      sections.push(`## Current ${component} content for reference:`);
      sections.push('```');
      sections.push(currentContent.slice(0, 2000)); // Truncate if very long
      if (currentContent.length > 2000) {
        sections.push('... [truncated]');
      }
      sections.push('```');
    }

    return sections.join('\n');
  }

  /**
   * Build prompt incorporating manual edits and diffs
   */
  static buildEditReviewPrompt(
    componentDiffs: ComponentDiff[],
    corrections: Correction[],
    component: RegeneratableComponent,
    userInstructions?: string
  ): string {
    const sections: string[] = [];

    sections.push('## Manual Edits Made');
    sections.push('');
    sections.push('The following manual edits were made to this entity:');
    sections.push('');

    // Show diffs
    const diffContent = DiffEngine.formatComponentDiffsForPrompt(componentDiffs);
    if (diffContent) {
      sections.push(diffContent);
    }

    // Show corrections
    if (corrections.length > 0) {
      sections.push('## Corrections Identified');
      sections.push('');
      for (const correction of corrections) {
        const source = correction.sourceFile ? ` (in ${correction.sourceFile})` : '';
        sections.push(`- "${correction.original}" → "${correction.corrected}"${source}`);
      }
      sections.push('');
    }

    // User instructions
    sections.push('## Instructions');
    if (userInstructions) {
      sections.push(userInstructions);
    } else {
      sections.push(
        `Update the ${component} to accurately reflect these changes. ` +
          'Ensure any corrections are incorporated and the content is consistent.'
      );
    }
    sections.push('');

    // Specific guidance per component
    sections.push('## Guidance');
    switch (component) {
      case 'pinax':
        sections.push(
          'Update metadata fields to reflect any corrections. Pay special attention to dates, ' +
            'names, and other factual information that may have been corrected.'
        );
        break;
      case 'description':
        sections.push(
          'Regenerate the description incorporating the changes. Maintain the overall tone ' +
            'and structure while ensuring accuracy based on the corrections.'
        );
        break;
      case 'cheimarros':
        sections.push(
          'Update the knowledge graph to reflect any new or corrected entities, relationships, ' +
            'and facts identified in the changes.'
        );
        break;
    }

    return sections.join('\n');
  }

  /**
   * Build cascade-aware prompt additions
   */
  static buildCascadePrompt(basePrompt: string, cascadeContext: CascadeContext): string {
    const sections: string[] = [basePrompt];

    sections.push('');
    sections.push('## Cascade Context');
    sections.push('');
    sections.push(
      'This edit is part of a cascading update. After updating this entity, ' +
        'parent entities will also be updated to reflect these changes.'
    );
    sections.push('');

    if (cascadeContext.path.length > 1) {
      sections.push(`Cascade path: ${cascadeContext.path.join(' → ')}`);
      sections.push(`Depth: ${cascadeContext.depth}`);
    }

    if (cascadeContext.stopAtPi) {
      sections.push(`Cascade will stop at: ${cascadeContext.stopAtPi}`);
    }

    sections.push('');
    sections.push(
      'Ensure the content accurately represents the source material so parent ' +
        'aggregations will be correct.'
    );

    return sections.join('\n');
  }

  /**
   * Build a general prompt combining multiple instructions
   */
  static buildCombinedPrompt(
    generalPrompt: string | undefined,
    componentPrompt: string | undefined,
    component: RegeneratableComponent
  ): string {
    const sections: string[] = [];

    if (generalPrompt) {
      sections.push('## General Instructions');
      sections.push(generalPrompt);
      sections.push('');
    }

    if (componentPrompt) {
      sections.push(`## Specific Instructions for ${component}`);
      sections.push(componentPrompt);
      sections.push('');
    }

    if (sections.length === 0) {
      return `Regenerate the ${component} based on the current entity content.`;
    }

    return sections.join('\n');
  }

  /**
   * Build prompt for correction-based updates
   */
  static buildCorrectionPrompt(corrections: Correction[]): string {
    if (corrections.length === 0) {
      return '';
    }

    const sections: string[] = [];

    sections.push('## Corrections Applied');
    sections.push('');
    sections.push('The following corrections were made to the source content:');
    sections.push('');

    for (const correction of corrections) {
      const source = correction.sourceFile ? ` in ${correction.sourceFile}` : '';
      sections.push(`- "${correction.original}" was corrected to "${correction.corrected}"${source}`);
      if (correction.context) {
        sections.push(`  Context: ${correction.context}`);
      }
    }

    sections.push('');
    sections.push(
      'Update the metadata and description to reflect these corrections. ' +
        'Previous content may have contained errors based on the incorrect text.'
    );

    return sections.join('\n');
  }

  /**
   * Get component-specific regeneration guidance
   */
  static getComponentGuidance(component: RegeneratableComponent): string {
    switch (component) {
      case 'pinax':
        return (
          'Extract and structure metadata including: institution, creator, title, ' +
          'date range, subjects, type, and other relevant fields. Ensure accuracy ' +
          'based on the source content.'
        );
      case 'description':
        return (
          'Generate a clear, informative description that summarizes the entity content. ' +
          'Focus on what the material contains, its historical significance, and context. ' +
          'Write for a general audience unless otherwise specified.'
        );
      case 'cheimarros':
        return (
          'Extract entities (people, places, organizations, events) and their relationships. ' +
          'Build a knowledge graph that captures the key facts and connections in the content.'
        );
      default:
        return '';
    }
  }
}
