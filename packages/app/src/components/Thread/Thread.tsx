/**
 * Vendor imports.
 */
import { Fragment } from "react";

/**
 * Custom imports.
 */
import { ThreadDocument } from "db/src/db";
import { Post } from "../Post/Post";
import { Comment } from "../Comment/Comment";

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
      <div>
        <Post doc={doc.post} />
      </div>
      <div>
        {doc.comments.map((comment) => {
          return (
            <div key={comment._id}>
              <Comment doc={comment} />
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};
