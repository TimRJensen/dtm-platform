/**
 * Vendor imports.
 */
import { useContext, useEffect, useRef, useState } from "react";
import { Editor } from "draft-js";

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
  if (doc) {
    const db = useContext(PouchDBContext);
    const { state, dispatch } = useContext(AppStateContext);
    const [showEditor, setShowEditor] = useState(false);

    const handleSubmit = async (content?: string) => {
      const blog = state.currentBlog;

      if (!content || !blog) {
        setShowEditor(false);
        return;
      }

      // Update the db.
      const _id = `${doc._id}/comment${doc.stats.comments}`;

      blog.threads[doc._id].comments[_id] = db.createDoc<"post">(_id, {
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
      });
      blog.threads[doc._id].stats.comments++;
      await db.put<"blog">(blog._id, blog);

      // Update the view.
      dispatch({
        type: "setCurrentBlog",
        value: await db.get<"blog">(blog._id),
      });
      setShowEditor(false);
    };

    const textboxRef = useRef<Editor>(null);
    useEffect(() => {
      // Fix focus & scroll.
      if (textboxRef.current) {
        textboxRef.current.focus();
        console.log("A");
      }
    }, [showEditor]);

    return (
      <section className="thread">
        <Post
          doc={doc.post}
          showEditor={(flag: boolean) => setShowEditor(flag)}
        />
        {Object.values(doc.comments).map((comment) => {
          return <Comment key={comment._id} doc={comment} />;
        })}
        {showEditor ? (
          <CommentTexteditor onSubmit={handleSubmit} ref={textboxRef} />
        ) : null}
        <div className="thread-divider" />
      </section>
    );
  }

  return null;
};
