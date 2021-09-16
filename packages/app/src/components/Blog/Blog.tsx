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
export const Blog = function Blog() {
  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const { blogId } = useParams<{ blogId: string }>();

  const fetch = async () => {
    const response = await db.get<BlogDocument>(`/blogs/${blogId}`);

    if (response) dispatch({ type: "setCurrentBlog", value: response });
  };

  useEffect(() => {
    if (!state.currentBlog) fetch();

    return () => dispatch({ type: "setCurrentBlog", value: undefined });
  }, []);

  if (!state.currentBlog) return null;

  return (
    <div>
      {Array.from(state.currentBlog.threads.values()).map((thread, i) => {
        return <Thread key={thread._id} doc={thread} />;
      })}
    </div>
  );
};
