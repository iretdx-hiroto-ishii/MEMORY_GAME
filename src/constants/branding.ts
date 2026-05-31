import branding from '../../public/branding.json';

/** 運営者・コピーライト（正本: public/branding.json） */
export const OPERATOR_NAME = branding.operatorName;

export const COPYRIGHT_START_YEAR = branding.copyrightStartYear;

export function getCopyrightText(): string {
  return `© ${COPYRIGHT_START_YEAR} ${OPERATOR_NAME}`;
}
