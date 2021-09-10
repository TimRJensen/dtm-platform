/**
 * Vendor imports.
 */

import { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { PouchDBContext } from "db";
import { AllDocuments } from "db/src/db";

/**
 * HomeView functional component.
 */
export const HomeView = function HomeView() {
  const db = useContext(PouchDBContext);
  const [blogs, setBlogs] = useState([] as AllDocuments[]);

  const fetch = async () => {
    const response = await db.find(["type"], { selector: { type: "blog" } });

    if (response) setBlogs(response.docs);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
      <div>Home</div>
      {blogs.map((blog, i) => {
        return (
          <Fragment key={`blog-${i}`}>
            <Link to={`/blogs/blog:${i}`}>{"Blog " + i}</Link>
            <br></br>
          </Fragment>
        );
      })}
    </div>
  );
};
