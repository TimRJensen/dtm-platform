/**
 * Vendor imports.
 */
import { useState, useContext, useEffect } from "react";

/**
 * Custom imports.
 */
import { BaseDocument, PostDocument } from "db/src/db";
import "./Comment.scss";

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
 * Comment functional component.
 */
interface Props {
  doc: PostDocument & Pick<BaseDocument, "timestamp">;
}

export const Comment = function Comment({ doc }: Props) {
  const { content, creator, timestamp } = doc;

  return (
    <div className={"comment"}>
      <section className="panel"></section>
      <section className="body">
        <div className="content">{content}</div>
        <div className="info">
          <div>
            <p className="timestamp">{formatDate(timestamp) + " af "}</p>
            <p className="user">{creator.name}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
