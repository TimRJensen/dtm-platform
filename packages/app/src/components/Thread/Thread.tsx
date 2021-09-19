/**
 * Vendor imports.
 */
import { useEffect } from "react";

/**
 * Custom imports.
 */
import { ThreadDocument } from "db";
import { useEditor } from "../App/hooks/main";
import { Post } from "../Post/Post";
import { Comment } from "../Comment/Comment";
import { TextEditor } from "../TextEditor/TextEditor";
import "./style.scss";

/**
 * Thread functional component.
 */
interface Props {
  doc: ThreadDocument;
}

export const Thread = function Thread({ doc }: Props) {
  if (!doc) return null;

  const { showEditor, handleShowEditor, handleSubmit } = useEditor(doc);

  useEffect(() => {
    //console.log(state);
  });

  return (
    <section className="thread">
      <div className="thread-body">
        <Post doc={doc.post} onComment={handleShowEditor} />
        {Array.from(doc.comments.values()).map((comment) => {
          return <Comment key={comment._id} doc={comment} />;
        })}
        <TextEditor onSubmit={handleSubmit} show={showEditor()} />
      </div>
    </section>
  );
};
