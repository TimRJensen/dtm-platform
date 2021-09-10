/**
 * Vendor imports.
 */
import { useState, useContext, useEffect } from "react";

/**
 * Custom imports.
 */
import { PostDocument } from "db/src/db";

/**
 * Helpers.
 */
function formatDate(value: number) {
  return new Date(value).toLocaleDateString("da-DK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Post functional component.
 */
interface Props {
  doc: PostDocument & { timestamp: number };
}

export const Post = function Post({ doc }: Props) {
  const { content, creator, timestamp } = doc;

  return (
    <div>
      <p style={{ display: "inline" }}>{content}</p>
      <p style={{ display: "inline" }}>{` - ${formatDate(timestamp)} af ${
        creator.name
      }`}</p>
    </div>
  );
};
