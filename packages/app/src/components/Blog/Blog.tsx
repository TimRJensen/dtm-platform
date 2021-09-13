/**
 * Vendor imports.
 */
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom import.
 */
import { PouchDBContext } from "db";
import { Thread } from "../Thread/Thread";
import { AppStateContext } from "../../AppState/context";

/**
 * Blog functonal component.
 */
export const Blog = function Blog() {
  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);
  const { blogId } = useParams<{ blogId: string }>();

  const fetch = async () => {
    const response = await db.get<"blog">(`/blogs/${blogId}`);

    if (response) dispatch({ type: "setCurrentBlog", value: response });
  };

  useEffect(() => {
    if (!state.currentBlog) fetch();

    return () => dispatch({ type: "setCurrentBlog", value: undefined });
  }, []);

  if (!state.currentBlog) return null;

  return (
    <div>
      {Object.values(state.currentBlog.threads).map((thread, i) => {
        return <Thread key={thread._id} doc={thread} />;
      })}
    </div>
  );
};
