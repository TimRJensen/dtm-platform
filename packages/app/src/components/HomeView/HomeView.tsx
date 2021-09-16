/**
 * Vendor imports.
 */

import { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Custom imports.
 */
import { PouchDBContext, AllDocuments } from "db";

/**
 * HomeView functional component.
 */
export const HomeView = function HomeView() {
  const db = useContext(PouchDBContext);
  const [blogs, setBlogs] = useState<AllDocuments[]>([]);

  const fetch = async () => {
    const response = await db.find(["type"], { selector: { type: "blog" } });

    if (response) setBlogs(response.docs);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleClick = async () => {
    const obj = {
      a: { a: 1, b: 2 },
      b: { a: 3, b: 4 },
      c: { a: "hello world", b: 5 },
    };

    const arr = Object.values(obj).map((o) => {
      (o.a = typeof o.a === "string" ? "ave terra" : o.a++), (o.b = o.b + 1);

      return o;
    });
    arr[1].b = 15;
  };

  return (
    <div>
      <div>Home</div>
      {blogs.map((blog, i) => {
        return (
          <Fragment key={`blog-${i}`}>
            <Link to={`/blogs/blog-${i}`}>{"Blog " + i}</Link>
            <br></br>
          </Fragment>
        );
      })}
      <button onClick={handleClick}>Run Test</button>
    </div>
  );
};
