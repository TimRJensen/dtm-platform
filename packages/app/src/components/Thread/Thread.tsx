/**
 * Vendor imports.
 */
import { useContext, useEffect, useState } from "react";

/**
 * Custom imports.
 */
import { AllDocuments, GetDocument, PouchDBContext } from "db";
import { Post } from "../Post/Post";
import { Comment } from "../Comment/Comment";
import { CommentTexteditor } from "../CommentTexteditor/CommentTexteditor";
import "./Thread.scss";
import { AppStateContext } from "../../AppState/context";

/**
 * Thread functional component.
 */
interface Props {
  doc: GetDocument<AllDocuments, "thread">;
}

export const Thread = function Thread({ doc }: Props) {
  if (!doc) return null;

  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const [showEditor, setShowEditor] = useState(state.showEditor !== undefined);

  const handleSubmit = async (content?: string) => {
    const blog = state.currentBlog;

    if (!content || !blog) {
      setShowEditor(false);
      return;
    }

    // Update the model.
    const post = db.createDoc<"post">(
      `${doc._id}/comment-${doc.stats.comments}`,
      {
        type: "post",
        content,
        creator: db.createDoc<"user">("/users/john.doe@gmail.com", {
          type: "user",
          name: "John Doe",
          email: "john.doe@gmail.com",
          stats: {
            infractions: 0,
            upvotes: 0,
            downvotes: 0,
            comments: 0,
            threads: 0,
          },
        }),
        stats: {
          infractions: 0,
        },
      }
    );
    doc.comments[post.key] = post;
    doc.stats.comments++;

    //Update the db.
    await db.put(blog._id, blog);

    // Update the view.
    dispatch({
      type: "setCurrentBlog",
      value: await db.get<"blog">(blog._id),
    });
    setShowEditor(false);
  };

  useEffect(() => {
    console.log(state);
  });

  return (
    <section className="thread">
      <Post
        doc={doc.post}
        showEditor={(flag: boolean) => setShowEditor(flag)}
      />
      {Object.values(doc.comments).map((comment) => {
        return <Comment key={comment._id} doc={comment} />;
      })}
      <CommentTexteditor onSubmit={handleSubmit} show={showEditor} />
      <div className="thread-divider" />
    </section>
  );
};
