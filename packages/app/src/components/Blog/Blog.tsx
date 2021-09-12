/**
 * Vendor imports.
 */
import { Fragment, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom import.
 */
import { PouchDBContext, AllDocuments } from "db";
import { AppStateContext } from "../../AppState/context";
import { Thread } from "../Thread/Thread";
import { PathParams } from "../App/App";

/**
 * Blog functonal component.
 */
export const Blog = function Blog() {
  const { blogId } = useParams() as PathParams;
  const db = useContext(PouchDBContext);
  const { state, dispatch } = useContext(AppStateContext);

  const fetch = async () => {
    const response = await db.get(`/${blogId}`);

    if (response && response.type === "blog")
      dispatch({ type: "setCurrentBlog", value: response });
  };

  useEffect(() => {
    fetch();
  }, []);

  if (state.currentBlog)
    return (
      <div>
        {Object.values(state.currentBlog.threads).map((thread, i) => {
          return <Thread key={thread._id} doc={thread} index={i} />;
        })}
      </div>
    );

  return null;
};
