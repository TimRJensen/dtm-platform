/**
 * Vendor imports.
 */

/**
 * Custom imports.
 */
import { AllDocuments } from "db";

/**
 * Utility functions.
 */
export function formatDate(value: number) {
  return new Date(value).toLocaleDateString("da-DK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatString(value: string) {
  return value.toLowerCase().replace(/[^\sa-zA-Z0-9_]+/g, "");
}

export function stringIncludes(value: string, queries: string[]) {
  let i = -1;

  while (++i < queries.length)
    if (formatString(value).includes(queries[i])) return true;

  return false;
}

export function docIncludes(
  doc: AllDocuments,
  fields: string[],
  queries: string[]
) {
  const entries = Object.entries(doc);
  let i = -1;

  while (++i < entries.length) {
    const [key, element] = entries[i];

    if (!fields.includes(key)) continue;

    if (typeof element === "object") {
      if (element instanceof Map) {
        for (const doc of element.values())
          if (docIncludes(doc, fields, queries)) return true;
      } else if (docIncludes(element, fields, queries)) return true;
    } else if (typeof element === "number") {
      if (
        stringIncludes(
          new Date(element).toLocaleDateString("da-DK", {
            month: "long",
            year: "numeric",
          }),
          queries
        )
      )
        return true;
    } else if (stringIncludes(element, queries)) return true;
  }

  return false;
}
