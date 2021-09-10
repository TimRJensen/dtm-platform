/**
 * Vendor imports.
 */
import { Fragment, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Custom import.
 */
import { PouchDBContext } from "db";
import { BlogDocument, AllDocuments } from "db/src/db";
import { Thread } from "../Thread/Thread";

/**
 * Blog functonal component.
 */
export const Blog = function Blog() {
  const { key }: { key: string } = useParams();
  const db = useContext(PouchDBContext);
  const [blog, setBlog] = useState({} as AllDocuments);

  const fetch = async () => {
    const blog = await db.get(key);

    if (blog) setBlog(blog);
  };

  useEffect(() => {
    fetch();
  }, []);

  if (blog.type !== "blog") return null;

  return (
    <Fragment>
      <div>
        {blog.threads.map((thread) => {
          return <Thread key={thread._id} doc={thread} />;
        })}
      </div>
    </Fragment>
  );
};
