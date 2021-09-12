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
  const appState = useContext(AppStateContext);

  const fetch = async () => {
    const blog = await db.get(`/${blogId}`);

    if (blog?.type === "blog")
      appState.dispatch({ type: "setCurrentBlog", value: blog });
  };

  useEffect(() => {
    fetch();
  }, []);

  if (appState.state.currentBlog)
    return (
      <Fragment>
        <div>
          {appState.state.currentBlog.threads.map((thread) => {
            return <Thread key={thread._id} doc={thread} />;
          })}
        </div>
      </Fragment>
    );

  return null;
};
