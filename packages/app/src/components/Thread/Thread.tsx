/**
 * Vendor imports.
 */
import { useContext, useEffect, useState } from "react";

/**
 * Custom imports.
 */
import { BlogDocument, PouchDBContext, ThreadDocument } from "db";
import { AppStateContext } from "../App/app-state/context";
import { useEditor } from "../App/hooks/main";
import { Post } from "../Post/Post";
import { Comment } from "../Comment/Comment";
import { CommentTexteditor } from "../CommentTexteditor/CommentTexteditor";
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
        <CommentTexteditor
          onSubmit={handleSubmit}
          show={showEditor()}
          className="thread-text-editor"
        />
      </div>
    </section>
  );
};
