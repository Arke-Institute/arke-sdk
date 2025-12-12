/**
 * DiffEngine - Text comparison and diff formatting
 */

import * as Diff from 'diff';
import type { TextDiff, ComponentDiff, Correction } from './types';

export class DiffEngine {
  /**
   * Compute diff between two strings
   */
  static diff(original: string, modified: string): TextDiff[] {
    const changes = Diff.diffLines(original, modified);
    const diffs: TextDiff[] = [];
    let lineNumber = 1;

    for (const change of changes) {
      if (change.added) {
        diffs.push({
          type: 'addition',
          modified: change.value.trimEnd(),
          lineNumber,
        });
      } else if (change.removed) {
        diffs.push({
          type: 'deletion',
          original: change.value.trimEnd(),
          lineNumber,
        });
      } else {
        // Track line numbers for unchanged content
        const lines = change.value.split('\n').length - 1;
        lineNumber += lines;
      }

      // Update line number for added content
      if (change.added) {
        lineNumber += change.value.split('\n').length - 1;
      }
    }

    return diffs;
  }

  /**
   * Compute word-level diff for more granular changes
   */
  static diffWords(original: string, modified: string): TextDiff[] {
    const changes = Diff.diffWords(original, modified);
    const diffs: TextDiff[] = [];

    for (const change of changes) {
      if (change.added) {
        diffs.push({
          type: 'addition',
          modified: change.value,
        });
      } else if (change.removed) {
        diffs.push({
          type: 'deletion',
          original: change.value,
        });
      }
    }

    return diffs;
  }

  /**
   * Create a ComponentDiff from original and modified content
   */
  static createComponentDiff(
    componentName: string,
    original: string,
    modified: string
  ): ComponentDiff {
    const diffs = this.diff(original, modified);
    const hasChanges = diffs.length > 0;

    let summary: string;
    if (!hasChanges) {
      summary = 'No changes';
    } else {
      const additions = diffs.filter((d) => d.type === 'addition').length;
      const deletions = diffs.filter((d) => d.type === 'deletion').length;
      const parts: string[] = [];
      if (additions > 0) parts.push(`${additions} addition${additions > 1 ? 's' : ''}`);
      if (deletions > 0) parts.push(`${deletions} deletion${deletions > 1 ? 's' : ''}`);
      summary = parts.join(', ');
    }

    return {
      componentName,
      diffs,
      summary,
      hasChanges,
    };
  }

  /**
   * Format diffs for AI prompt consumption
   */
  static formatForPrompt(diffs: TextDiff[]): string {
    if (diffs.length === 0) {
      return 'No changes detected.';
    }

    const lines: string[] = [];

    for (const diff of diffs) {
      const linePrefix = diff.lineNumber ? `Line ${diff.lineNumber}: ` : '';

      if (diff.type === 'addition') {
        lines.push(`${linePrefix}+ ${diff.modified}`);
      } else if (diff.type === 'deletion') {
        lines.push(`${linePrefix}- ${diff.original}`);
      } else if (diff.type === 'change') {
        lines.push(`${linePrefix}"${diff.original}" → "${diff.modified}"`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Format component diffs for AI prompt
   */
  static formatComponentDiffsForPrompt(componentDiffs: ComponentDiff[]): string {
    const sections: string[] = [];

    for (const cd of componentDiffs) {
      if (!cd.hasChanges) continue;

      sections.push(`## Changes to ${cd.componentName}:`);
      sections.push(this.formatForPrompt(cd.diffs));
      sections.push('');
    }

    return sections.join('\n');
  }

  /**
   * Create a unified diff view
   */
  static unifiedDiff(
    original: string,
    modified: string,
    options?: { filename?: string; context?: number }
  ): string {
    const filename = options?.filename || 'content';
    const patch = Diff.createPatch(filename, original, modified, '', '', {
      context: options?.context ?? 3,
    });
    return patch;
  }

  /**
   * Extract corrections from diffs (specific text replacements)
   */
  static extractCorrections(
    original: string,
    modified: string,
    sourceFile?: string
  ): Correction[] {
    const wordDiffs = Diff.diffWords(original, modified);
    const corrections: Correction[] = [];

    let i = 0;
    while (i < wordDiffs.length) {
      const current = wordDiffs[i];

      // Look for removal followed by addition (a replacement)
      if (current.removed && i + 1 < wordDiffs.length && wordDiffs[i + 1].added) {
        const removed = current.value.trim();
        const added = wordDiffs[i + 1].value.trim();

        if (removed && added && removed !== added) {
          corrections.push({
            original: removed,
            corrected: added,
            sourceFile,
          });
        }
        i += 2;
      } else {
        i++;
      }
    }

    return corrections;
  }

  /**
   * Check if two strings are meaningfully different
   * (ignoring whitespace differences)
   */
  static hasSignificantChanges(original: string, modified: string): boolean {
    const normalizedOriginal = original.replace(/\s+/g, ' ').trim();
    const normalizedModified = modified.replace(/\s+/g, ' ').trim();
    return normalizedOriginal !== normalizedModified;
  }
}
