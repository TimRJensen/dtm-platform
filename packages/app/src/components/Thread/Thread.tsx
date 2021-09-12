/**
 * Vendor imports.
 */
import { FormEvent, useContext, useEffect, useRef, useState } from "react";

/**
 * Custom imports.
 */
import { GetDocument, PouchDBContext, ThreadDocument } from "db";
import { AppStateContext } from "../../AppState/context";
import { Post } from "../Post/Post";
import { Comment } from "../Comment/Comment";
import { CommentEditor } from "../CommentEditor/CommentEditor";
import "./Thread.scss";

/**
 * Helpers.
 */
function formatPath(path: string): { blog: number; thread: number } {
  const arr = path.split("/").slice(1);
  const result: any = {};

  for (let element of arr) {
    const [key, value] = element.split(":");

    result[key] = value;
  }

  return result;
}

/**
 * Thread functional component.
 */
interface Props {
  doc: GetDocument<ThreadDocument>;
  index: number;
}

export const Thread = function Thread({ doc, index }: Props) {
  if (doc) {
    const db = useContext(PouchDBContext);
    const { state, dispatch } = useContext(AppStateContext);

    const [comments, setComment] = useState(doc.comments);
    const [commenting, setCommenting] = useState(false);
    const handleCommenting = () => setCommenting(true);
    const handleSubmit = async (event?: FormEvent<any>, content?: string) => {
      if (!content) {
        setCommenting(false);
        return;
      }

      // Update the db.
      const key = `${doc._id}/comment${doc.stats.comments}`;
      doc.comments[key] = db.createDoc(key, {
        type: "post",
        content,
        creator: {
          type: "user",
          name: "John Doe",
          email: "john.doe@gmail.com",
        },
      });
      doc.stats.comments++;
      state.currentBlog.threads[doc._id] = doc;
      await db.put(state.currentBlog._id, state.currentBlog);

      // Update view.
      dispatch({ type: "setCurrentBlog", value: state.currentBlog });
      setCommenting(false);
    };

    const editorRef = useRef(null as unknown as HTMLFormElement);
    useEffect(() => {
      // Fix focus & scroll.
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.scroll(0, 100);
        console.dir();
      }
    }, [commenting]);

    return (
      <section className="thread">
        <Post doc={doc.post} onCommenting={handleCommenting} />
        {Object.values(comments).map((comment) => {
          return <Comment key={comment._id} doc={comment} />;
        })}
        {commenting ? (
          <CommentEditor onSubmit={handleSubmit} ref={editorRef} />
        ) : null}
      </section>
    );
  }

  return null;
};
