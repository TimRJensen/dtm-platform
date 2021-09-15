/**
 * Vendor imports.
 */
import { useContext, useEffect, useState } from "react";

/**
 * Custom imports.
 */
import { BlogDocument, PouchDBContext, ThreadDocument } from "db";
import { AppStateContext } from "../App/app-state/context";
import { Post } from "../Post/Post";
import { Comment } from "../Comment/Comment";
import { CommentTexteditor } from "../CommentTexteditor/CommentTexteditor";
import "./Thread.scss";

/**
 * Thread functional component.
 */
interface Props {
  doc: ThreadDocument;
}

export const Thread = function Thread({ doc }: Props) {
  if (!doc) return null;

  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const [showEditor, setShowEditor] = useState(false);

  const handleSubmit = async (content?: string) => {
    if (!content || !state.currentBlog || !state.user) {
      setShowEditor(false);
      return;
    }

    // Update the model.
    const post = db.createDoc(
      "post",
      `${doc._id}/comment-${doc.stats.comments}`,
      {
        type: "post",
        content,
        creator: state.user,
        stats: { infractions: 0 },
      }
    );
    doc.comments[post.key] = post;
    doc.stats.comments++;

    //Update the db.
    await db.put(state.currentBlog._id, state.currentBlog);

    // Update the view.
    dispatch({
      type: "setCurrentBlog",
      value: await db.get<BlogDocument>(state.currentBlog._id),
    });
    setShowEditor(false);
  };

  useEffect(() => {
    //console.log(state);
  });

  return (
    <section className="thread">
      <Post doc={doc.post} onClick={(flag: boolean) => setShowEditor(flag)} />
      {Object.values(doc.comments).map((comment) => {
        return <Comment key={comment._id} doc={comment} />;
      })}
      <CommentTexteditor onSubmit={handleSubmit} show={showEditor} />
      <div className="thread-divider" />
    </section>
  );
};
