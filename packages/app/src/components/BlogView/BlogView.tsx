/**
 * Vendor imports.
 */
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom import.
 */
import { BlogDocument, PouchDBContext } from "db";
import { useEditor } from "../../hooks";
import { AppStateContext } from "../App/app-state/context";
import { Artifact } from "../Artifact/Artifact";
import { Thread } from "../Thread/Thread";
import { TextEditor } from "../TextEditor/TextEditor";
import styles from "./styles.module.scss";

/**
 * Blog functonal component.
 */
interface Props {
  blog: BlogDocument | undefined;
}

export const BlogView = function BlogView({ blog }: Props) {
  const db = useContext(PouchDBContext);
  const { dispatch } = useContext(AppStateContext);
  const { showEditor, handleShowEditor, handleSubmit } = useEditor(blog);
  const { blogId } = useParams<{ blogId: string }>();

  const fetch = async () => {
    const response = await db.get<BlogDocument>(`/blogs/${blogId}`);

    if (response) dispatch({ type: "CURRENT_BLOG", value: response });
  };

  useEffect(() => {
    if (!blog) fetch();

    return () => dispatch({ type: "CURRENT_BLOG", value: undefined });
  }, []);

  if (!blog) return null;

  return (
    <section className={styles.blogView}>
      <Artifact doc={blog.artifact} onComment={handleShowEditor} />
      <TextEditor
        styles={styles}
        onSubmit={handleSubmit}
        show={showEditor()}
        advanced
      ></TextEditor>
      {blog.threads.map((thread, i) => {
        return <Thread key={thread._id} doc={thread} />;
      })}
    </section>
  );
};
