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
// formatDate
export function formatDate(value: number) {
  return new Date(value).toLocaleDateString("da-DK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// formatString
const matchWhitespcaeLettersNumbers = /[^\sa-zA-Z0-9_]+/g;

export function formatString(value: string) {
  return value.toLowerCase().replace(matchWhitespcaeLettersNumbers, "");
}

// formatAttrKey
export function formatAttributeKey(key: string) {
  if (!key.includes("-")) return key;

  const result = key.split("-");
  let i = 0;

  while (++i < result.length)
    result[i] = result[i].slice(0, 1).toUpperCase() + result[i].slice(1);

  return result.join("");
}

// formatAttributesObject
const matchWhitespace = /\s/g;

export function formatAttributesObject(attributeObject: {
  [key: string]: any;
}) {
  if (!("style" in attributeObject)) return attributeObject;

  const styles = attributeObject.style.split(";");
  const result = {} as { [key: string]: any };

  for (const style of styles) {
    const [key, value] = style.replace(matchWhitespace, "").split(":");

    result[formatAttributeKey(key)] = formatAttributeKey(value);
  }

  return { ...attributeObject, style: result };
}

// stringIncludes
export function stringIncludes(value: string, queries: string[]) {
  for (const query of queries)
    if (formatString(value).includes(query)) return true;

  return false;
}

// docIncludes
export function docIncludes(
  doc: AllDocuments,
  fields: string[],
  queries: string[]
): boolean {
  const entries = Object.entries(doc);

  for (const entry of entries) {
    const [key, value] = entry;

    if (!fields.includes(key)) continue;

    switch (typeof value) {
      case "string": {
        if (stringIncludes(value, queries)) return true;
      }
      case "number": {
        if (
          stringIncludes(
            new Date(value).toLocaleDateString("da-DK", {
              month: "long",
              year: "numeric",
            }),
            queries
          )
        )
          return true;
      }
      case "object": {
        if (value instanceof Map) {
          for (const doc of value.values()) {
            if (docIncludes(doc, fields, queries)) return true;
          }
        } else {
          if (docIncludes(value, queries, fields)) return true;
        }
      }
    }
  }

  return false;
}
