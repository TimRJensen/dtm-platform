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
}

export const Thread = function Thread({ doc }: Props) {
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
      // Create a new doc.
      const key = `${doc._id}/comment${doc.comments.length}`;
      const newDoc = db.createDoc(key, {
        type: "post",
        content,
        creator: {
          type: "user",
          name: "John Doe",
          email: "john.doe@gmail.com",
        },
      });
      // Update db.
      //await db.put(key, newDoc);

      // Update view.
      const i = formatPath(doc._id).thread;

      doc.comments = doc.comments.concat(newDoc);

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

    console.log(formatPath(doc._id));
    return (
      <section className="thread">
        <Post doc={doc.post} onCommenting={handleCommenting} />
        {comments.map((comment) => {
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
