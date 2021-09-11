/**
 * Vendor imports.
 */
import { useState, useContext, useEffect } from "react";

/**
 * Custom imports.
 */
import { PostDocument, BaseDocument } from "db/src/db";
import "./Post.scss";

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
  doc: PostDocument & Pick<BaseDocument, "timestamp">;
}

export const Post = function Post({ doc }: Props) {
  const { content, creator, timestamp } = doc;

  return (
    <div className={"post"}>
      <section className="panel">
        <a>upvote</a>
      </section>
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
