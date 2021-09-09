/**
 * Vendor imports.
 */
import { useState, useContext, useEffect } from "react";

/**
 * Custom imports.
 */
import { PouchDBContext } from "db";

/**
 * Post functional component.
 */
interface Props {
  id: string;
}

export const Post = function (props: Props) {
  const db = useContext(PouchDBContext);
  const [content, setContent] = useState("");

  const fetchPost = async () => {
    const blog = await db.get(props.id);

    if (blog?.type === "blog") {
      const post = blog.threads[2].posts[3];

      setContent(
        `${post.content} - ${post.creator.name} ${new Date(
          post.timestamp
        ).toLocaleDateString("da-DK", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`
      );
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div>
      <div className={"body"}>{content}</div>
    </div>
  );
};
