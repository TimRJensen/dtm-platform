/**
 * Vendor imports.
 */
import {} from "react";

/**
 * Custom imports.
 */
import { GetDocument, PostDocument } from "db";
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
  doc: GetDocument<PostDocument>;
}

export const Comment = function Comment({ doc }: Props) {
  const { content, creator, timestamp } = doc;

  return (
    <section className={"comment"}>
      <div className="panel"></div>
      <div className="body">
        <div className="content">{content}</div>
        <div className="footer">
          <span className="controls">
            <a>rediger</a>
          </span>
          <div className="info">
            <span className="timestamp">{formatDate(timestamp) + " af "}</span>
            <span className="user">{creator.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
