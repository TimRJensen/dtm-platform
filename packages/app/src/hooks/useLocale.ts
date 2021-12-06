/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import locale from "../locale";

/**
 * Types.
 */

/**
 * useLocale hook.
 */
export default function useLocale(key: keyof typeof locale) {
  return {
    locale: locale[key],
  };
}
