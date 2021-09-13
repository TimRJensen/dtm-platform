/**
 * Vendor imports.
 */
import {} from "react";

/**
 * Custom imports.
 */
import { AllDocuments, GetDocument } from "db";
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
  doc: GetDocument<AllDocuments, "post">;
}

export const Comment = function Comment({ doc }: Props) {
  const { content, creator, timestamp } = doc;

  return (
    <section className="comment">
      <div className="comment-body">
        <div className="comment-content">{content}</div>
        <div className="comment-divider" />
        <div className="comment-footer">
          <span className="comment-controls">
            <a>rediger</a>
          </span>
          <div className="comment-info">
            <span className="comment-timestamp">
              {formatDate(timestamp) + " af "}
            </span>
            <span className="comment-user">{creator.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
