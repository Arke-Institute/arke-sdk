/**
 * Processing configuration types for per-directory control
 */

/**
 * Configuration for processing stages applied to files
 */
export interface ProcessingConfig {
  /** Enable OCR on eligible files */
  ocr: boolean;

  /** Enable description/summary generation */
  describe: boolean;

  /** Enable pinax metadata generation */
  pinax: boolean;
}

/**
 * Default processing configuration
 */
export const DEFAULT_PROCESSING_CONFIG: ProcessingConfig = {
  ocr: true,
  describe: true,
  pinax: true,
};
