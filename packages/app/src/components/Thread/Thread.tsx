/**
 * Vendor imports.
 */
import { Fragment } from "react";

/**
 * Custom imports.
 */
import { ThreadDocument } from "db/src/db";
import { Post } from "../Post/Post";

/**
 * Thread functional component.
 */
interface Props {
  doc: ThreadDocument;
}

export const Thread = function Thread({ doc }: Props) {
  if (!doc) return null;

  return (
    <Fragment>
      <div style={{ border: "2px solid black" }}>
        <Post doc={doc.post} />
      </div>
      <div>
        {doc.comments.map((comment) => {
          return (
            <div key={comment._id}>
              <Post doc={comment} />
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};
