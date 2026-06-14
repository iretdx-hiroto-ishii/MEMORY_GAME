import branding from '../assets/branding.json';

/** 運営者・コピーライト（正本: src/assets/branding.json） */
export const OPERATOR_NAME = branding.operatorName;

export const COPYRIGHT_START_YEAR = branding.copyrightStartYear;

export function getCopyrightText(): string {
  return `© ${COPYRIGHT_START_YEAR} ${OPERATOR_NAME}`;
}
