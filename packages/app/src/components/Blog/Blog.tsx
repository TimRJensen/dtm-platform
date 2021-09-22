/**
 * Vendor imports.
 */
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom import.
 */
import { BlogDocument, PouchDBContext } from "db";
import { Thread } from "../Thread/Thread";
import { AppStateContext } from "../App/app-state/context";

/**
 * Blog functonal component.
 */
interface Props {
  blog: BlogDocument | undefined;
}

export const Blog = function Blog({ blog }: Props) {
  const db = useContext(PouchDBContext);
  const { dispatch } = useContext(AppStateContext);
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
    <div>
      {Array.from(blog.threads.values()).map((thread, i) => {
        return <Thread key={thread._id} doc={thread} />;
      })}
    </div>
  );
};
